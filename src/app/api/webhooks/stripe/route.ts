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
        if (!session?.metadata?.userId) {
            return new NextResponse('Webhook Error: Missing User ID', { status: 400 })
        }

        // Example: Update user subscription
        // await prisma.user.update(...)
        console.log('Payment completed for user:', session.metadata.userId)
    }

    if (event.type === 'invoice.payment_succeeded') {
        // Handle subscription renewal
        console.log('Subscription renewed')
    }

    return new NextResponse(null, { status: 200 })
}
