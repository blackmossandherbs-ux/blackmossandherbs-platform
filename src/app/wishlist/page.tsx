'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, X, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const STORAGE_KEY = 'bm-wishlist'

interface WishProduct {
    name: string
    slug: string
    price: number
    compareAtPrice: number | null
    images: string[]
    category: string
}

export default function WishlistPage() {
    const [products, setProducts] = useState<WishProduct[]>([])
    const [loading, setLoading] = useState(true)

    const readSlugs = (): string[] => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        } catch {
            return []
        }
    }

    const load = async () => {
        const slugs = readSlugs()
        if (slugs.length === 0) {
            setProducts([])
            setLoading(false)
            return
        }
        try {
            const res = await fetch('/api/products/by-slugs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slugs }),
            })
            const data = await res.json()
            setProducts(data.products || [])
        } catch {
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const remove = (slug: string) => {
        try {
            const next = readSlugs().filter((s) => s !== slug)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch { /* ignore */ }
        setProducts((p) => p.filter((x) => x.slug !== slug))
    }

    return (
        <div className="py-24 bg-earth-950 min-h-screen">
            <div className="container pt-12">
                <div className="flex items-center gap-3 mb-2">
                    <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tighter">Your Wishlist</h1>
                </div>
                <p className="text-earth-400 mb-12">Saved for later. Add them to your cart whenever you&apos;re ready.</p>

                {loading ? (
                    <p className="text-earth-500 uppercase tracking-widest text-sm animate-pulse">Loading…</p>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 premium-card max-w-md mx-auto">
                        <Heart className="w-14 h-14 text-earth-700 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif font-bold text-white mb-3">No saved items yet</h2>
                        <p className="text-earth-500 mb-8">Tap the heart on any product to save it here.</p>
                        <Link href="/shop" className="inline-block px-8 py-4 bg-secondary-500 hover:bg-secondary-400 text-stone-950 font-bold rounded-xl transition-colors">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((p) => (
                            <div key={p.slug} className="premium-card overflow-hidden group relative flex flex-col">
                                <button
                                    onClick={() => remove(p.slug)}
                                    aria-label="Remove from wishlist"
                                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-earth-950/70 border border-earth-800 flex items-center justify-center text-earth-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <Link href={`/shop/${p.slug}`} className="block">
                                    <div className="aspect-square bg-earth-900 overflow-hidden">
                                        <img
                                            src={p.images?.[0] || '/images/product-placeholder.svg'}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </Link>
                                <div className="p-5 flex flex-col flex-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-1">{p.category}</span>
                                    <Link href={`/shop/${p.slug}`}>
                                        <h3 className="font-serif text-lg font-bold text-white mb-3 hover:text-secondary-400 transition-colors leading-snug flex-1">{p.name}</h3>
                                    </Link>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-white font-bold">{formatPrice(p.price)}</span>
                                        <Link
                                            href={`/shop/${p.slug}`}
                                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-secondary-400 hover:text-secondary-300 transition-colors"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" /> View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
