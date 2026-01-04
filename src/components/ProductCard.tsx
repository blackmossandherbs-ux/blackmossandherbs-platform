import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'
import Button from './Button'

interface ProductCardProps {
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number
    images: string[]
    category: string
    featured?: boolean
}

export default function ProductCard({
    id,
    name,
    slug,
    price,
    compareAtPrice,
    images,
    category,
    featured = false,
}: ProductCardProps) {
    const discount = compareAtPrice
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : 0

    return (
        <div className="card group">
            <Link href={`/shop/${slug}`}>
                <div className="relative h-64 bg-earth-900 overflow-hidden">
                    {images && images.length > 0 ? (
                        <img
                            src={images[0]}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-earth-800 text-earth-600">
                            <span className="text-4xl opacity-50">🌿</span>
                        </div>
                    )}

                    {/* Branding Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 to-transparent opacity-60" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {featured && <span className="badge-primary shadow-lg border border-primary-500/30">Featured</span>}
                        {discount > 0 && (
                            <span className="badge bg-secondary-500 text-black font-bold shadow-lg">
                                Save {discount}%
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="p-6">
                <div className="mb-2">
                    <span className="text-xs text-earth-500 uppercase tracking-wide">
                        {category}
                    </span>
                </div>

                <Link href={`/shop/${slug}`}>
                    <h3 className="font-serif text-xl font-bold text-earth-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                        {formatPrice(price)}
                    </span>
                    {compareAtPrice && (
                        <span className="text-sm text-earth-400 line-through">
                            {formatPrice(compareAtPrice)}
                        </span>
                    )}
                </div>

                <Button className="w-full" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                </Button>
            </div>
        </div>
    )
}
