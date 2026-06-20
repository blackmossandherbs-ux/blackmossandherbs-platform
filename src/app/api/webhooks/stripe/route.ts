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
            await fulfillProductOrder(session, userId, userEmail)
        } else if (type === 'SUBSCRIPTION' && planId) {
            if (!userId) {
                console.error('[Stripe Webhook] Missing userId for subscription')
                return new NextResponse('Missing userId', { status: 400 })
            }
            try {
                await prisma.subscription.create({
                    data: {
                        userId,
                        planId,
                        stripeSubscriptionId: session.subscription as string,
                        status: 'ACTIVE',
                        currentPeriodStart: new Date(),
                        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: {
                            currentPeriodStart: new Date(),
                            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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

async function fulfillProductOrder(
    session: Stripe.Checkout.Session,
    userId: string,
    userEmail: string
) {
    try {
        const rawItems = session?.metadata?.items
        if (!rawItems) {
            console.error('[Stripe Webhook] No items in product order metadata')
            return
        }

        const items: Array<{ productId: string; slug: string; quantity: number; price: number }> = JSON.parse(rawItems)
        if (!items.length) return

        const productIds = items.map(i => i.productId)
        const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

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

        // Only create DB order if we have a userId
        if (userId) {
            const order = await prisma.order.create({
                data: {
                    userId,
                    orderNumber,
                    status: 'PENDING',
                    total,
                    subtotal,
                    tax: 0,
                    shipping,
                    stripePaymentId: session.payment_intent as string,
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

        if (email) {
            const emailItems = items.map(i => {
                const product = products.find(p => p.id === i.productId)
                return { name: product?.name || i.slug, quantity: i.quantity, price: i.price }
            })
            await sendOrderConfirmationEmail(email, customerName, orderNumber, emailItems, total)
            console.log(`[Stripe Webhook] Order confirmation sent to ${email}`)
        }
    } catch (error) {
        console.error('[Stripe Webhook] Product order fulfillment error:', error)
    }
}
