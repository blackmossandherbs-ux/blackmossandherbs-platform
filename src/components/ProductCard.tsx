import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import Button from './Button'

interface ProductCardProps {
    name: string
    slug: string
    price: number
    compareAtPrice?: number
    images?: string[]
    category?: string
    featured?: boolean
    discount?: number
}

export default function ProductCard({
    name,
    slug,
    price,
    compareAtPrice,
    images,
    category,
    featured,
    discount = 0
}: ProductCardProps) {
    const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`

    return (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden hover:border-green-500 transition-colors group">
            <Link href={`/shop/${slug}`}>
                <div className="relative h-80 overflow-hidden bg-stone-100">
                    {images && images.length > 0 ? (
                        <Image
                            src={images[0]}
                            alt={name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-400">
                            No Image
                        </div>
                    )}

                    {/* Badges */}
                    {(featured || discount > 0) && (
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {featured && (
                                <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold uppercase rounded-full">
                                    Featured
                                </span>
                            )}
                            {discount > 0 && (
                                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold uppercase rounded-full">
                                    -{discount}%
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-6">
                {category && (
                    <span className="text-xs text-green-600 font-semibold uppercase">
                        {category}
                    </span>
                )}

                <Link href={`/shop/${slug}`}>
                    <h3 className="font-serif text-xl font-bold text-stone-900 mt-2 mb-3 group-hover:text-green-600 transition-colors line-clamp-1">
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-stone-900">
                            {formatPrice(price)}
                        </span>
                        {compareAtPrice && (
                            <span className="text-sm text-stone-500 line-through">
                                {formatPrice(compareAtPrice)}
                            </span>
                        )}
                    </div>
                    <Button size="sm">
                        <ShoppingCart className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
