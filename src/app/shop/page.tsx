/**
 * HECTIC Intellectual Property - Copyright 2024
 */
import { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductService } from '@/services/ProductService'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Shop Herbal Products',
    description: 'Browse our full range of wildcrafted sea moss, herbal blends and wellness supplements. UK delivery.',
    alternates: { canonical: 'https://blackmossandherbs.com/shop' },
    openGraph: {
        title: 'Shop | Black Moss & Herbs',
        description: 'Wildcrafted sea moss, herbal blends and wellness supplements. Free UK delivery over £40.',
        url: 'https://blackmossandherbs.com/shop',
    },
}

const PER_PAGE = 12

export default async function ShopPage({
    searchParams,
}: {
    searchParams: { page?: string; category?: string; sort?: string; q?: string }
}) {
    const page = Math.max(1, parseInt(searchParams.page || '1', 10))
    const activeCategory = searchParams.category || 'All Products'
    const sortParam = searchParams.sort || 'featured'
    const searchQuery = searchParams.q?.trim() || ''

    const sortMap: Record<string, { field: 'price' | 'createdAt' | 'name'; order: 'asc' | 'desc' }> = {
        featured: { field: 'createdAt', order: 'desc' },
        'price-asc': { field: 'price', order: 'asc' },
        'price-desc': { field: 'price', order: 'desc' },
        newest: { field: 'createdAt', order: 'desc' },
        name: { field: 'name', order: 'asc' },
    }
    const sort = sortMap[sortParam] || sortMap['featured']
    const filters: Parameters<typeof ProductService.getProducts>[0] = {}
    if (activeCategory !== 'All Products') filters.category = activeCategory
    if (searchQuery) filters.search = searchQuery

    const [{ products, total, pages }, categories] = await Promise.all([
        ProductService.getProducts(filters, sort, page, PER_PAGE),
        ProductService.getCategories(),
    ])

    const availableCategories = ['All Products', ...categories]

    const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Shop | Black Moss & Herbs',
        description: 'Wildcrafted sea moss, herbal blends and wellness supplements.',
        url: 'https://blackmossandherbs.com/shop',
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: products.length,
            itemListElement: products.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `https://blackmossandherbs.com/shop/${p.slug}`,
                name: p.name,
            })),
        },
    }

    const buildUrl = (params: Record<string, string | number>) => {
        const merged = {
            page: String(page),
            category: activeCategory,
            sort: sortParam,
            ...(searchQuery ? { q: searchQuery } : {}),
            ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
        }
        const qs = new URLSearchParams(merged)
        if (merged.page === '1') qs.delete('page')
        if (merged.category === 'All Products') qs.delete('category')
        if (merged.sort === 'featured') qs.delete('sort')
        const s = qs.toString()
        return `/shop${s ? '?' + s : ''}`
    }

    return (
        <div className="py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
            <div className="container">
                {/* Header */}
                <div className="mb-10 pt-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-3">
                        {searchQuery
                            ? `Search: "${searchQuery}"`
                            : activeCategory === 'All Products'
                                ? 'All Products'
                                : activeCategory}
                    </h1>
                    <p className="text-earth-400">
                        Premium wildcrafted herbs &amp; sea moss — free UK delivery over £40
                    </p>
                    {searchQuery && (
                        <Link href="/shop" className="mt-2 inline-flex items-center text-sm text-primary-400 hover:text-primary-300">
                            ✕ Clear search
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 border border-earth-800 bg-earth-900/40 backdrop-blur-xl rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Filter className="w-4 h-4 text-secondary-400" />
                                <h2 className="text-base font-bold text-white">Filter Products</h2>
                            </div>

                            {/* Category filter */}
                            <div>
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-earth-500 mb-3">Category</h3>
                                <div className="space-y-1">
                                    {availableCategories.map((category) => (
                                        <Link
                                            key={category}
                                            href={buildUrl({ category, page: 1 })}
                                            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                                                activeCategory === category
                                                    ? 'bg-primary-700/30 text-primary-300 font-semibold'
                                                    : 'text-earth-400 hover:text-white hover:bg-earth-800/50'
                                            }`}
                                        >
                                            {category}
                                            {activeCategory === category && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {activeCategory !== 'All Products' && (
                                <Link
                                    href="/shop"
                                    className="mt-4 block w-full text-center py-2 text-xs font-semibold text-earth-500 hover:text-white border border-earth-800 rounded-lg transition-colors"
                                >
                                    Clear Filter
                                </Link>
                            )}
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {/* Sort + count row */}
                        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                            <p className="text-earth-400 text-sm">
                                <span className="text-white font-semibold">{total}</span> products
                                {pages > 1 && (
                                    <span className="text-earth-600"> — page {page} of {pages}</span>
                                )}
                            </p>
                            <Link href={buildUrl({ sort: 'featured', page: 1 })} className="hidden" />
                            <span className="text-earth-500 text-xs hidden sm:block">Sort using the pills below</span>
                        </div>

                        {/* Sort links (hidden, driven by JS-free anchor approach) */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[
                                { value: 'featured', label: 'Featured' },
                                { value: 'price-asc', label: 'Price ↑' },
                                { value: 'price-desc', label: 'Price ↓' },
                                { value: 'newest', label: 'Newest' },
                                { value: 'name', label: 'A–Z' },
                            ].map(o => (
                                <Link
                                    key={o.value}
                                    href={buildUrl({ sort: o.value, page: 1 })}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                                        sortParam === o.value
                                            ? 'bg-primary-700/40 border-primary-600 text-primary-300'
                                            : 'border-earth-800 text-earth-500 hover:text-white hover:border-earth-600'
                                    }`}
                                >
                                    {o.label}
                                </Link>
                            ))}
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-20 border border-dashed border-earth-800 rounded-2xl">
                                <p className="text-earth-500 text-lg">No products found in this category.</p>
                                <Link href="/shop" className="mt-4 inline-block text-primary-400 hover:text-primary-300">
                                    View all products →
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            name={product.name}
                                            slug={product.slug}
                                            price={product.price}
                                            compareAtPrice={product.compareAtPrice ?? undefined}
                                            images={product.images}
                                            category={product.category}
                                            featured={product.featured}
                                            isBundle={product.isBundle}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12">
                                        {page > 1 ? (
                                            <Link
                                                href={buildUrl({ page: page - 1 })}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-earth-700 text-earth-300 hover:text-white hover:border-earth-500 transition-colors text-sm font-semibold"
                                            >
                                                <ChevronLeft className="w-4 h-4" /> Previous
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-earth-900 text-earth-700 text-sm font-semibold cursor-not-allowed">
                                                <ChevronLeft className="w-4 h-4" /> Previous
                                            </span>
                                        )}

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                                                const pg = pages <= 7
                                                    ? i + 1
                                                    : page <= 4
                                                        ? i + 1
                                                        : page >= pages - 3
                                                            ? pages - 6 + i
                                                            : page - 3 + i
                                                return (
                                                    <Link
                                                        key={pg}
                                                        href={buildUrl({ page: pg })}
                                                        className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                                                            pg === page
                                                                ? 'bg-primary-700 text-white'
                                                                : 'text-earth-400 hover:text-white hover:bg-earth-800'
                                                        }`}
                                                    >
                                                        {pg}
                                                    </Link>
                                                )
                                            })}
                                        </div>

                                        {page < pages ? (
                                            <Link
                                                href={buildUrl({ page: page + 1 })}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-earth-700 text-earth-300 hover:text-white hover:border-earth-500 transition-colors text-sm font-semibold"
                                            >
                                                Next <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-earth-900 text-earth-700 text-sm font-semibold cursor-not-allowed">
                                                Next <ChevronRight className="w-4 h-4" />
                                            </span>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
