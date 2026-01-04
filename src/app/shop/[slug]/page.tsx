/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Product Detail View
 */
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShoppingCart, Heart, Share2, Star, Check } from 'lucide-react'
import Button from '@/components/Button'
import { formatPrice } from '@/lib/utils'

// Mock product data
const getProduct = (slug: string) => {
    const products: Record<string, any> = {
        'sea-moss-gold-gel': {
            id: '1',
            name: 'Sea Moss Gold Gel',
            price: 34.99,
            compareAtPrice: 44.99,
            description: 'Premium wildcrafted sea moss gel packed with 92 of the 102 minerals your body needs. Supports immune function, digestion, and overall wellness.',
            category: 'Supplements',
            stock: 45,
            rating: 4.8,
            reviews: 127,
            benefits: [
                'Rich in 92 essential minerals',
                'Supports immune system',
                'Promotes healthy digestion',
                'Boosts energy levels',
                'Supports thyroid function',
            ],
            ingredients: 'Wildcrafted Sea Moss, Spring Water',
            usage: 'Take 1-2 tablespoons daily. Can be added to smoothies, teas, or consumed directly.',
        },
    }

    return products[slug] || null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const product = getProduct(params.slug)

    if (!product) {
        return {
            title: 'Product Not Found',
        }
    }

    return {
        title: `${product.name} - Black Moss & Herbs`,
        description: product.description,
    }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
    const product = getProduct(params.slug)

    if (!product) {
        notFound()
    }

    const discount = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0

    return (
        <div className="py-12">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div>
                        <div className="card overflow-hidden mb-4">
                            <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                                <span className="text-9xl">🌿</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="card overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all">
                                    <div className="aspect-square bg-gradient-to-br from-earth-100 to-earth-200 flex items-center justify-center">
                                        <span className="text-3xl">🌿</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-4">
                            <span className="badge-primary">{product.category}</span>
                            {discount > 0 && (
                                <span className="badge bg-red-100 text-red-800 ml-2">
                                    Save {discount}%
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl font-serif font-bold text-earth-900 mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating)
                                            ? 'text-secondary-500 fill-secondary-500'
                                            : 'text-earth-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-earth-600">
                                {product.rating} ({product.reviews} reviews)
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-4xl font-bold text-primary-600">
                                {formatPrice(product.price)}
                            </span>
                            {product.compareAtPrice && (
                                <span className="text-xl text-earth-400 line-through">
                                    {formatPrice(product.compareAtPrice)}
                                </span>
                            )}
                        </div>

                        <p className="text-earth-700 text-lg mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {product.stock > 0 ? (
                                <div className="flex items-center gap-2 text-primary-600">
                                    <Check className="w-5 h-5" />
                                    <span className="font-medium">In Stock ({product.stock} available)</span>
                                </div>
                            ) : (
                                <div className="text-red-600 font-medium">Out of Stock</div>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="label">Quantity</label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-earth-300 rounded-lg">
                                    <button className="px-4 py-2 hover:bg-earth-100 transition-colors">-</button>
                                    <input
                                        type="number"
                                        value="1"
                                        min="1"
                                        max={product.stock}
                                        className="w-16 text-center border-x border-earth-300 py-2 focus:outline-none"
                                        readOnly
                                    />
                                    <button className="px-4 py-2 hover:bg-earth-100 transition-colors">+</button>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-8">
                            <Button size="lg" className="flex-1" disabled={product.stock === 0}>
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Add to Cart
                            </Button>
                            <Button variant="outline" size="lg">
                                <Heart className="w-5 h-5" />
                            </Button>
                            <Button variant="outline" size="lg">
                                <Share2 className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Benefits */}
                        <div className="card p-6 mb-6">
                            <h3 className="font-serif text-xl font-bold text-earth-900 mb-4">
                                Key Benefits
                            </h3>
                            <ul className="space-y-2">
                                {product.benefits.map((benefit: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-earth-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-4">
                            <div className="card p-6">
                                <h3 className="font-semibold text-earth-900 mb-2">Ingredients</h3>
                                <p className="text-earth-700">{product.ingredients}</p>
                            </div>
                            <div className="card p-6">
                                <h3 className="font-semibold text-earth-900 mb-2">How to Use</h3>
                                <p className="text-earth-700">{product.usage}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
