import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;

  if (orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        stripePaymentIntentId: session.payment_intent as string,
        stripeChargeId: session.payment_intent as string,
        paidAt: new Date(),
      },
    });

    // Create downloads for digital products
    if (session.metadata?.hasDigitalProducts === "true") {
      await createDigitalDownloads(orderId, userId);
    }
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        stripePaymentIntentId: paymentIntent.id,
        stripeChargeId: paymentIntent.latest_charge as string,
        paidAt: new Date(),
      },
    });
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "FAILED",
      },
    });
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.metadata?.subscriptionId;
  if (subscriptionId) {
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        status: subscription.status === "active" ? "ACTIVE" : "PAUSED",
      },
    });
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.metadata?.subscriptionId;
  if (subscriptionId) {
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });
  }
}

async function createDigitalDownloads(orderId: string, userId?: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) return;

  for (const item of order.items) {
    if (item.isDigital && item.productId) {
      const digitalProduct = await prisma.digitalProduct.findUnique({
        where: { productId: item.productId },
      });

      if (digitalProduct && userId) {
        const expiresAt = digitalProduct.expiryDays
          ? new Date(Date.now() + digitalProduct.expiryDays * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default 1 year

        await prisma.download.create({
          data: {
            userId,
            productId: item.productId,
            digitalProductId: digitalProduct.id,
            orderId,
            downloadUrl: digitalProduct.fileUrl, // Will be signed in API
            expiresAt,
            maxDownloads: digitalProduct.downloadLimit || 5,
          },
        });
      }
    }
  }
}
