import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/services/ProductService'

export const dynamic = 'force-dynamic'

/**
 * Public product catalog for client apps that can't run the server-component
 * queries the web shop pages use directly (i.e. the iOS app).
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || undefined
    const featured = searchParams.get('featured')

    try {
        const products = await ProductService.getProducts({
            category,
            featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
        })
        return NextResponse.json({ products })
    } catch (error) {
        console.error('[api/products] FAILURE:', error)
        return NextResponse.json({ error: 'Could not load products.' }, { status: 500 })
    }
}
