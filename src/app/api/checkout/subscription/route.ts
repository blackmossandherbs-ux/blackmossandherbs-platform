/**
 * Black Moss & Herbs Platform - Subscription Checkout
 * Creates a Stripe subscription session using the plan's stripePriceId from the DB.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
            { error: 'Payments are not configured.' },
            { status: 503 }
        )
    }

    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Sign in to subscribe.', redirect: '/login' }, { status: 401 })
        }

        const { planId } = await req.json()
        if (!planId) {
            return NextResponse.json({ error: 'Plan ID is required.' }, { status: 400 })
        }

        const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId, active: true } })
        if (!plan) {
            return NextResponse.json({ error: 'This plan is not currently available.' }, { status: 404 })
        }

        const origin =
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.NEXTAUTH_URL ||
            req.nextUrl.origin

        const stripeSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{ price: plan.stripePriceId, quantity: 1 }],
            customer_email: session.user.email || undefined,
            success_url: `${origin}/dashboard?subscription=success`,
            cancel_url: `${origin}/membership?subscription=cancelled`,
            metadata: {
                type: 'SUBSCRIPTION',
                userId: session.user.id,
                planId: plan.id,
            },
        })

        return NextResponse.json({ url: stripeSession.url })
    } catch (error) {
        console.error('[checkout/subscription] error:', error)
        return NextResponse.json({ error: 'Could not start subscription checkout.' }, { status: 500 })
    }
}
