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
    let event: Stripe.Event

    try {
        const body = await req.text()
        const signature = headers().get('Stripe-Signature')

        if (!signature) {
            console.error('[Stripe Webhook] Missing signature header')
            return new NextResponse('Missing signature', { status: 400 })
        }

        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error('[Stripe Webhook] Missing webhook secret in environment')
            return new NextResponse('Webhook Error: Missing Request Secret', { status: 500 })
        }

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            )
        } catch (error: any) {
            console.error('[Stripe Webhook] Signature verification failed:', error.message)
            return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
        }
    } catch (error: any) {
        console.error('[Stripe Webhook] Request processing error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
        const userId = session?.metadata?.userId
        const type = session?.metadata?.type // 'SUBSCRIPTION' or 'CONSULTATION'
        const planId = session?.metadata?.planId
        const consultationType = session?.metadata?.consultationType

        if (!userId) {
            console.error('[Stripe Webhook] CRITICAL: Missing User ID in metadata')
            return new NextResponse('Webhook Error: Missing User ID', { status: 400 })
        }

        try {
            if (type === 'SUBSCRIPTION' && planId) {
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
                })
                console.log(`[Stripe Webhook] SUCCESS: Subscription fulfilled for user ${userId}`)
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
                })
                console.log(`[Stripe Webhook] SUCCESS: Consultation fulfilled for user ${userId}`)
            } else {
                console.warn(`[Stripe Webhook] Unknown type or missing metadata: type=${type}, planId=${planId}, consultationType=${consultationType}`)
            }
        } catch (error) {
            console.error('[Stripe Webhook] PRISMA_FULFILLMENT_FAILURE:', error)
            return new NextResponse('Internal Fulfillment Error', { status: 500 })
        }
    }

    // Handle invoice.payment_succeeded (subscription renewal)
    if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (!subscriptionId) {
            console.warn('[Stripe Webhook] invoice.payment_succeeded: No subscription ID')
            return new NextResponse('Webhook Synchronized', { status: 200 })
        }

        try {
            const subscription = await prisma.subscription.findUnique({
                where: { stripeSubscriptionId: subscriptionId }
            })

            if (subscription) {
                // Get period from invoice if available
                const periodEnd = invoice.period_end 
                    ? new Date(invoice.period_end * 1000)
                    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                
                const periodStart = invoice.period_start
                    ? new Date(invoice.period_start * 1000)
                    : new Date()

                await prisma.subscription.update({
                    where: { id: subscription.id },
                    data: {
                        currentPeriodStart: periodStart,
                        currentPeriodEnd: periodEnd,
                        status: 'ACTIVE'
                    }
                })
                console.log(`[Stripe Webhook] SUCCESS: Subscription RENEWAL for ID ${subscriptionId}`)
            } else {
                console.warn(`[Stripe Webhook] Subscription not found: ${subscriptionId}`)
            }
        } catch (error) {
            console.error('[Stripe Webhook] RENEWAL_FAILURE:', error)
            // Don't return error - allow webhook to succeed even if update fails
            // This prevents Stripe from retrying and potentially causing issues
        }
    }

    // Handle customer.subscription.deleted (cancellation)
    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription
        const subscriptionId = subscription.id

        try {
            await prisma.subscription.update({
                where: { stripeSubscriptionId: subscriptionId },
                data: { status: 'CANCELLED' }
            })
            console.log(`[Stripe Webhook] SUCCESS: Subscription CANCELLED for ID ${subscriptionId}`)
        } catch (error) {
            console.error('[Stripe Webhook] CANCELLATION_FAILURE:', error)
            // Don't return error - subscription may already be cancelled
        }
    }

    return new NextResponse('Webhook Synchronized', { status: 200 })
}
