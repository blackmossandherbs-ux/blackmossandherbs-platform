/**
 * Returns lightweight product data for a set of slugs — used by the client-side
 * wishlist (which stores slugs in localStorage).
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        const { slugs } = await req.json()
        if (!Array.isArray(slugs) || slugs.length === 0) {
            return NextResponse.json({ products: [] })
        }

        const clean = slugs.filter((s: any) => typeof s === 'string').slice(0, 100)
        const products = await prisma.product.findMany({
            where: { slug: { in: clean }, active: true },
            select: { name: true, slug: true, price: true, images: true, category: true, compareAtPrice: true },
        })

        // Preserve the order the user saved them in.
        const ordered = clean
            .map((slug: string) => products.find(p => p.slug === slug))
            .filter(Boolean)
            .map((p: any) => ({ ...p, price: Number(p.price), compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null }))

        return NextResponse.json({ products: ordered })
    } catch (error) {
        console.error('[products/by-slugs] error:', error)
        return NextResponse.json({ products: [] }, { status: 500 })
    }
}
