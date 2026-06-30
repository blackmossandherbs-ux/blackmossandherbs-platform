/**
 * Black Moss & Herbs Platform - Stripe Webhook Fulfillment
 */
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/mail'

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get('Stripe-Signature') as string

    let event: Stripe.Event

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            return new NextResponse('Webhook Error: Missing webhook secret', { status: 500 })
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
        const type = session?.metadata?.type
        const userId = session?.metadata?.userId || ''
        const userEmail = session?.metadata?.userEmail || session?.customer_details?.email || ''
        const planId = session?.metadata?.planId
        const consultationType = session?.metadata?.consultationType

        if (type === 'PRODUCT') {
            const ok = await fulfillProductOrder(session, userId, userEmail)
            if (!ok) {
                return new NextResponse('Fulfillment error', { status: 500 })
            }
        } else if (type === 'SUBSCRIPTION' && planId) {
            if (!userId) {
                console.error('[Stripe Webhook] Missing userId for subscription')
                return new NextResponse('Missing userId', { status: 400 })
            }
            const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null
            if (!subscriptionId) {
                console.error('[Stripe Webhook] Missing subscription id on completed session')
                return new NextResponse('Missing subscription id', { status: 400 })
            }
            try {
                const { start, end } = await getSubscriptionPeriod(subscriptionId)
                await prisma.subscription.create({
                    data: {
                        userId,
                        planId,
                        stripeSubscriptionId: subscriptionId,
                        status: 'ACTIVE',
                        currentPeriodStart: start,
                        currentPeriodEnd: end,
                    }
                })
                console.log(`[Stripe Webhook] Subscription created for user ${userId}`)
            } catch (error) {
                console.error('[Stripe Webhook] Subscription fulfillment error:', error)
                return new NextResponse('Fulfillment error', { status: 500 })
            }
        } else if (type === 'CONSULTATION' && consultationType) {
            if (!userId) {
                console.error('[Stripe Webhook] Missing userId for consultation')
                return new NextResponse('Missing userId', { status: 400 })
            }
            try {
                await prisma.consultation.create({
                    data: {
                        userId,
                        type: consultationType,
                        status: 'SCHEDULED',
                        date: new Date(),
                        duration: 30,
                    }
                })
                console.log(`[Stripe Webhook] Consultation created for user ${userId}`)
            } catch (error) {
                console.error('[Stripe Webhook] Consultation fulfillment error:', error)
                return new NextResponse('Fulfillment error', { status: 500 })
            }
        }
    }

    if (event.type === 'invoice.payment_succeeded') {
        const subscriptionId = (event.data.object as any).subscription as string
        if (subscriptionId) {
            try {
                const sub = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: subscriptionId } })
                if (sub) {
                    const { start, end } = await getSubscriptionPeriod(subscriptionId)
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: {
                            currentPeriodStart: start,
                            currentPeriodEnd: end,
                            status: 'ACTIVE',
                        },
                    })
                }
            } catch (error) {
                console.error('[Stripe Webhook] Subscription renewal error:', error)
            }
        }
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscriptionId = (event.data.object as any).id
        try {
            await prisma.subscription.update({
                where: { stripeSubscriptionId: subscriptionId },
                data: { status: 'CANCELLED' },
            })
        } catch (error) {
            console.error('[Stripe Webhook] Subscription cancellation error:', error)
        }
    }

    return new NextResponse('OK', { status: 200 })
}

/**
 * Read the true billing period from the Stripe subscription so the DB matches
 * the customer's actual renewal date (monthly vs yearly). Falls back to a 30-day
 * window only if Stripe can't be reached.
 */
async function getSubscriptionPeriod(subscriptionId: string): Promise<{ start: Date; end: Date }> {
    try {
        const sub = await stripe.subscriptions.retrieve(subscriptionId)
        const start = sub.current_period_start ? new Date(sub.current_period_start * 1000) : new Date()
        const end = sub.current_period_end
            ? new Date(sub.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        return { start, end }
    } catch (error) {
        console.error('[Stripe Webhook] Could not retrieve subscription period, using 30-day fallback:', error)
        return { start: new Date(), end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    }
}

/**
 * Fulfil a product purchase. Returns false only on a DB write failure that
 * Stripe should retry. Order creation is idempotent on the payment intent, so a
 * retry never produces a duplicate order. Email failures are non-fatal.
 */
async function fulfillProductOrder(
    session: Stripe.Checkout.Session,
    userId: string,
    userEmail: string
): Promise<boolean> {
    const rawItems = session?.metadata?.items
    if (!rawItems) {
        console.error('[Stripe Webhook] No items in product order metadata')
        return true // nothing to fulfil; don't ask Stripe to retry
    }

    let items: Array<{ productId: string; slug: string; quantity: number; price: number }>
    try {
        items = JSON.parse(rawItems)
    } catch {
        console.error('[Stripe Webhook] Malformed items metadata')
        return true
    }
    if (!items.length) return true

    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : null
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = subtotal >= 40 ? 0 : 3.99
    const total = subtotal + shipping
    const orderNumber = `BMH-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

    const shippingAddress = session.shipping_details?.address
        ? {
            line1: session.shipping_details.address.line1,
            line2: session.shipping_details.address.line2,
            city: session.shipping_details.address.city,
            postcode: session.shipping_details.address.postal_code,
            country: session.shipping_details.address.country,
        }
        : {}

    const customerName = session.shipping_details?.name || session.customer_details?.name || 'Customer'
    const email = userEmail || session.customer_details?.email || ''

    // Persist the order (critical path — retry on failure).
    try {
        if (userId) {
            // Idempotency: if this payment already produced an order, don't duplicate it.
            if (paymentIntentId) {
                const existing = await prisma.order.findFirst({ where: { stripePaymentId: paymentIntentId } })
                if (existing) {
                    console.log(`[Stripe Webhook] Order already exists for payment ${paymentIntentId}, skipping`)
                    return true
                }
            }
            const order = await prisma.order.create({
                data: {
                    userId,
                    orderNumber,
                    status: 'PENDING',
                    total,
                    subtotal,
                    tax: 0,
                    shipping,
                    stripePaymentId: paymentIntentId,
                    shippingAddress,
                    billingAddress: shippingAddress,
                    items: {
                        create: items.map(i => ({
                            productId: i.productId,
                            quantity: i.quantity,
                            price: i.price,
                        })),
                    },
                },
            })
            console.log(`[Stripe Webhook] Order ${order.orderNumber} created for user ${userId}`)
        } else {
            console.log(`[Stripe Webhook] Guest order ${orderNumber} — no userId, skipping DB record`)
        }
    } catch (error) {
        console.error('[Stripe Webhook] Product order DB write failed (will retry):', error)
        return false
    }

    // Send the confirmation email (non-critical — never trigger a retry for this).
    if (email) {
        try {
            const products = await prisma.product.findMany({ where: { id: { in: items.map(i => i.productId) } } })
            const emailItems = items.map(i => {
                const product = products.find(p => p.id === i.productId)
                return { name: product?.name || i.slug, quantity: i.quantity, price: i.price }
            })
            await sendOrderConfirmationEmail(email, customerName, orderNumber, emailItems, total)
            console.log(`[Stripe Webhook] Order confirmation sent to ${email}`)
        } catch (error) {
            console.error('[Stripe Webhook] Order confirmation email failed (non-fatal):', error)
        }
    }

    return true
}
