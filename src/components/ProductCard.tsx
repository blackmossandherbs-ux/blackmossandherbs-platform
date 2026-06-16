'use client'

import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
    name: string
    slug: string
    price: number
    compareAtPrice?: number
    images?: string[]
    category?: string
    featured?: boolean
    discount?: number
    isBundle?: boolean
}

export default function ProductCard({
    name,
    slug,
    price,
    compareAtPrice,
    images,
    category,
    featured,
    discount = 0,
    isBundle
}: ProductCardProps) {
    const formatPrice = (amount: number) => `£${amount.toFixed(2)}`
    const { addItem } = useCart()
    const [added, setAdded] = useState(false)

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        addItem({ slug, name, price, image: images?.[0] })
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
    }

    const discountPct = compareAtPrice
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : discount

    return (
        <div className="bg-earth-900/40 backdrop-blur-md border border-earth-800/50 rounded-[2rem] overflow-hidden hover:border-primary-500/50 transition-all duration-500 group relative flex flex-col">
            <Link href={`/shop/${slug}`} className="relative block h-64 overflow-hidden bg-earth-950 shrink-0">
                <img
                    src={images?.[0] || '/images/product-placeholder.svg'}
                    alt={name}
                    onError={(e) => { e.currentTarget.src = '/images/product-placeholder.svg' }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {isBundle && (
                        <span className="px-3 py-1 bg-primary-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                            Bundle
                        </span>
                    )}
                    {featured && !isBundle && (
                        <span className="px-3 py-1 bg-secondary-500 text-earth-950 text-[9px] font-bold uppercase tracking-wider rounded-full">
                            Best Seller
                        </span>
                    )}
                    {discountPct > 0 && (
                        <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                            -{discountPct}% Off
                        </span>
                    )}
                </div>
            </Link>

            <div className="p-6 flex flex-col flex-1">
                {category && (
                    <span className="text-[10px] text-primary-400 font-bold uppercase tracking-widest mb-1">
                        {category}
                    </span>
                )}

                <Link href={`/shop/${slug}`}>
                    <h3 className="font-serif text-lg font-bold text-white mt-1 mb-3 group-hover:text-secondary-400 transition-colors line-clamp-2 leading-snug">
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-earth-800">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white">
                            {formatPrice(price)}
                        </span>
                        {compareAtPrice && (
                            <span className="text-sm text-earth-500 line-through">
                                {formatPrice(compareAtPrice)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleAdd}
                        aria-label={`Add ${name} to cart`}
                        className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-primary-600 hover:border-primary-600 transition-all text-white shrink-0"
                    >
                        {added ? <Check className="w-4 h-4 text-green-400" /> : <ShoppingCart className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    )
}
