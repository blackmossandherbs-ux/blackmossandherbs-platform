import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { z } from "zod";

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().min(1),
    })
  ),
  shippingAddress: z.object({
    name: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string(),
  }),
  billingAddress: z.object({
    name: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string(),
  }),
  couponCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const validated = checkoutSchema.parse(body);

    // Fetch products and calculate totals
    const products = await prisma.product.findMany({
      where: {
        id: { in: validated.items.map((i) => i.productId) },
        status: "ACTIVE",
      },
      include: {
        variants: true,
      },
    });

    let subtotal = 0;
    const lineItems: Array<{ price: string; quantity: number }> = [];
    const orderItems: Array<{
      productId: string;
      variantId: string | null;
      name: string;
      sku: string | null;
      quantity: number;
      price: number;
      total: number;
      isDigital: boolean;
    }> = [];
    let hasDigitalProducts = false;

    for (const item of validated.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      const variant = item.variantId
        ? product.variants.find((v) => v.id === item.variantId)
        : product.variants[0];

      if (!variant) continue;

      const price = Number(variant.price);
      const total = price * item.quantity;
      subtotal += total;

      // For Stripe, you'd need to create products/prices in Stripe first
      // For now, we'll create a payment intent instead
      orderItems.push({
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        sku: variant.sku || null,
        quantity: item.quantity,
        price: price,
        total: total,
        isDigital: product.type === "DIGITAL",
      });

      if (product.type === "DIGITAL") {
        hasDigitalProducts = true;
      }
    }

    // Apply coupon if provided
    let discount = 0;
    if (validated.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: validated.couponCode, isActive: true },
      });

      if (coupon && coupon.validFrom && coupon.validUntil) {
        const now = new Date();
        if (now >= coupon.validFrom && now <= coupon.validUntil) {
          if (coupon.discountType === "percentage") {
            discount = (subtotal * Number(coupon.discountValue)) / 100;
          } else {
            discount = Number(coupon.discountValue);
          }

          if (coupon.maxDiscount) {
            discount = Math.min(discount, Number(coupon.maxDiscount));
          }
        }
      }
    }

    const tax = subtotal * 0.1; // 10% tax - adjust as needed
    const shipping = hasDigitalProducts ? 0 : 10; // $10 shipping for physical products
    const total = subtotal + tax + shipping - discount;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: session?.user?.id,
        email: session?.user?.email || validated.shippingAddress.name,
        status: "PENDING",
        paymentStatus: "PENDING",
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        discount: discount,
        total: total,
        shippingAddress: validated.shippingAddress,
        billingAddress: validated.billingAddress,
        isDigitalOnly: hasDigitalProducts,
        items: {
          create: orderItems,
        },
      },
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId: order.id,
        userId: session?.user?.id || "",
        hasDigitalProducts: hasDigitalProducts.toString(),
      },
    });

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}
