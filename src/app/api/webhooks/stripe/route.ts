/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Stripe Webhook Fulfillment
 */
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get('Stripe-Signature') as string

    let event: Stripe.Event

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            return new NextResponse('Webhook Error: Missing Request Secret', { status: 500 })
        }

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === 'checkout.session.completed') {
        const userId = session?.metadata?.userId;
        const type = session?.metadata?.type; // 'ORDER', 'SUBSCRIPTION', or 'CONSULTATION'
        const planId = session?.metadata?.planId;
        const consultationType = session?.metadata?.consultationType;

        if (!userId) {
            console.error('[Stripe Webhook] CRITICAL: Missing User ID in metadata');
            return new NextResponse('Webhook Error: Missing User ID', { status: 400 })
        }

        try {
            if (type === 'ORDER') {
                // Fulfill a product order. Line items are re-fetched from Stripe
                // (not trusted from the client) and matched back to our Product
                // rows via the productId metadata set at checkout creation time.
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
                    expand: ['data.price.product'],
                });

                const orderItemsData = lineItems.data.flatMap((item) => {
                    const product = item.price?.product as Stripe.Product | undefined;
                    const productId = product?.metadata?.productId;
                    const quantity = item.quantity || 1;
                    if (!productId) return [];
                    return [{
                        productId,
                        quantity,
                        price: (item.amount_subtotal ?? 0) / 100 / quantity,
                    }];
                });

                if (orderItemsData.length === 0) {
                    console.error('[Stripe Webhook] CRITICAL: No resolvable line items for order, session', session.id);
                } else {
                    const orderNumber = `BMH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
                    const address = session.shipping_details?.address ?? session.customer_details?.address;
                    const shippingAddress = address ? { name: session.shipping_details?.name ?? session.customer_details?.name, ...address } : {};
                    const billingAddress = session.customer_details?.address
                        ? { name: session.customer_details.name, ...session.customer_details.address }
                        : shippingAddress;

                    await prisma.$transaction([
                        prisma.order.create({
                            data: {
                                userId,
                                orderNumber,
                                status: 'PROCESSING',
                                subtotal: (session.amount_subtotal ?? 0) / 100,
                                tax: (session.total_details?.amount_tax ?? 0) / 100,
                                shipping: (session.total_details?.amount_shipping ?? 0) / 100,
                                total: (session.amount_total ?? 0) / 100,
                                stripePaymentId: (session.payment_intent as string) ?? undefined,
                                shippingAddress,
                                billingAddress,
                                items: { create: orderItemsData },
                            },
                        }),
                        ...orderItemsData.map((item) =>
                            prisma.product.update({
                                where: { id: item.productId },
                                data: { stock: { decrement: item.quantity } },
                            })
                        ),
                    ]);
                    console.log(`[Stripe Webhook] SUCCESS: Order ${orderNumber} fulfilled for user ${userId}`);
                }
            } else if (type === 'SUBSCRIPTION' && planId) {
                // Fulfill subscription
                await prisma.subscription.create({
                    data: {
                        userId,
                        planId,
                        stripeSubscriptionId: session.subscription as string,
                        status: 'ACTIVE',
                        currentPeriodStart: new Date(),
                        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
                    }
                });
                console.log(`[Stripe Webhook] SUCCESS: Subscription fulfilled for user ${userId}`);
            } else if (type === 'CONSULTATION' && consultationType) {
                // Fulfill consultation
                await prisma.consultation.create({
                    data: {
                        userId,
                        type: consultationType,
                        status: 'SCHEDULED',
                        date: new Date(),
                        duration: 30,
                    }
                });
                console.log(`[Stripe Webhook] SUCCESS: Consultation fulfilled for user ${userId}`);
            }
        } catch (error) {
            console.error('[Stripe Webhook] PRISMA_FULFILLMENT_FAILURE:', error);
            return new NextResponse('Internal Fulfillment Error', { status: 500 });
        }
    }

    if (event.type === 'invoice.payment_succeeded') {
        const subscriptionId = session.subscription as string;
        try {
            const subscription = await prisma.subscription.findUnique({
                where: { stripeSubscriptionId: subscriptionId }
            });

            if (subscription) {
                await prisma.subscription.update({
                    where: { id: subscription.id },
                    data: {
                        currentPeriodStart: new Date(),
                        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Renew for 30 days
                        status: 'ACTIVE'
                    }
                });
                console.log(`[Stripe Webhook] SUCCESS: Subscription RENEWAL for ID ${subscriptionId}`);
            }
        } catch (error) {
            console.error('[Stripe Webhook] RENEWAL_FAILURE:', error);
        }
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscriptionId = (event.data.object as any).id;
        try {
            await prisma.subscription.update({
                where: { stripeSubscriptionId: subscriptionId },
                data: { status: 'CANCELLED' }
            });
            console.log(`[Stripe Webhook] SUCCESS: Subscription CANCELLED for ID ${subscriptionId}`);
        } catch (error) {
            console.error('[Stripe Webhook] CANCELLATION_FAILURE:', error);
        }
    }

    return new NextResponse('Webhook Synchronized', { status: 200 })
}
