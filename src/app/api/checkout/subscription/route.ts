/**
 * Black Moss & Herbs Platform - Subscription Checkout
 * Starts a Stripe subscription Checkout Session for a given plan. Plan keys are
 * mapped to Stripe Price IDs via environment variables so the catalogue can be
 * managed entirely from the Stripe dashboard.
 */
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

const PRICE_ENV: Record<string, string | undefined> = {
    starter: process.env.STRIPE_PRICE_STARTER,
    plus: process.env.STRIPE_PRICE_PLUS,
    pro: process.env.STRIPE_PRICE_PRO,
}

export async function POST(req: NextRequest) {
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
            { error: 'Payments are not configured. Set STRIPE_SECRET_KEY to enable subscriptions.' },
            { status: 503 }
        )
    }

    try {
        const { plan } = await req.json()
        const priceId = PRICE_ENV[plan]

        if (!priceId) {
            return NextResponse.json(
                { error: 'This plan is not available yet. Configure its Stripe Price ID to enable it.' },
                { status: 503 }
            )
        }

        const origin =
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.NEXTAUTH_URL ||
            req.nextUrl.origin

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${origin}/dashboard?subscription=success`,
            cancel_url: `${origin}/subscriptions?subscription=cancelled`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('[checkout/subscription] FAILURE:', error)
        return NextResponse.json({ error: 'Could not start subscription checkout.' }, { status: 500 })
    }
}
