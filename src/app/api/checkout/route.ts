/**
 * Black Moss & Herbs Platform - Checkout Session
 * Creates a Stripe Checkout Session for the current cart. Prices are always
 * re-derived from the database (never trusted from the client) to prevent
 * price tampering.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface CheckoutLine {
    slug: string
    quantity: number
}

export async function POST(req: NextRequest) {
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
            { error: 'Payments are not configured. Set STRIPE_SECRET_KEY to enable checkout.' },
            { status: 503 }
        )
    }

    const session_ = await getServerSession(authOptions)
    if (!session_?.user?.id) {
        return NextResponse.json({ error: 'Please log in to checkout.' }, { status: 401 })
    }
    const userId = session_.user.id

    try {
        const body = await req.json()
        const lines: CheckoutLine[] = Array.isArray(body?.items) ? body.items : []

        if (lines.length === 0) {
            return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
        }

        // Authoritative pricing: look up every product by slug from the DB.
        const slugs = lines.map(l => l.slug)
        const products = await prisma.product.findMany({
            where: { slug: { in: slugs }, active: true },
        })

        const lineItems = lines.flatMap(line => {
            const product = products.find(p => p.slug === line.slug)
            const quantity = Math.max(1, Math.min(99, Math.floor(line.quantity || 1)))
            if (!product) return []
            return [{
                quantity,
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: product.name,
                        images: product.images?.length ? [product.images[0]] : undefined,
                        // Carried through to the webhook (via line item expansion) so
                        // the order can be reconstructed without trusting the client.
                        metadata: { productId: product.id },
                    },
                    // Stripe expects the amount in the smallest currency unit (pence).
                    unit_amount: Math.round(Number(product.price) * 100),
                },
            }]
        })

        if (lineItems.length === 0) {
            return NextResponse.json({ error: 'No purchasable items in cart.' }, { status: 400 })
        }

        const origin =
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.NEXTAUTH_URL ||
            req.nextUrl.origin

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            shipping_address_collection: { allowed_countries: ['GB', 'US', 'CA', 'IE', 'FR', 'DE'] },
            customer_email: session_.user.email ?? undefined,
            metadata: { type: 'ORDER', userId },
            success_url: `${origin}/dashboard?checkout=success`,
            cancel_url: `${origin}/cart?checkout=cancelled`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error('[checkout] FAILURE:', error)
        return NextResponse.json({ error: 'Could not start checkout.' }, { status: 500 })
    }
}
