/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Product Detail View
 */
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Star, Check } from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'
import WishlistButton from '@/components/WishlistButton'
import ShareButton from '@/components/ShareButton'
import { formatPrice } from '@/lib/utils'
import { ProductService } from '@/services/ProductService'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const product = await ProductService.getProductBySlug(params.slug)

    if (!product) {
        return { title: 'Product Not Found' }
    }

    return {
        title: `${product.name} | Black Moss & Herbs`,
        description: product.description,
        alternates: { canonical: `https://blackmossandherbs.com/shop/${product.slug}` },
        openGraph: {
            title: `${product.name} | Black Moss & Herbs`,
            description: product.description,
            url: `https://blackmossandherbs.com/shop/${product.slug}`,
            images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : [],
            type: 'website',
        },
    }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await ProductService.getProductBySlug(params.slug)

    if (!product) {
        notFound()
    }

    const discount = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images,
        url: `https://blackmossandherbs.com/shop/${product.slug}`,
        brand: { '@type': 'Brand', name: 'Black Moss & Herbs' },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'GBP',
            price: product.price.toFixed(2),
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://blackmossandherbs.com/shop/${product.slug}`,
            seller: { '@type': 'Organization', name: 'Black Moss & Herbs' },
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://blackmossandherbs.com' },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://blackmossandherbs.com/shop' },
            { '@type': 'ListItem', position: 3, name: product.name, item: `https://blackmossandherbs.com/shop/${product.slug}` },
        ],
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <div className="py-24 bg-earth-950 min-h-screen relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/patterns/sea-moss-pattern.svg')] bg-repeat opacity-5 pointer-events-none" />

            <div className="container relative z-10 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Product Images */}
                    <div className="space-y-6">
                        <div className="premium-card overflow-hidden group">
                            <div className="aspect-square bg-earth-900 flex items-center justify-center relative">
                                <img
                                    src={product.images[0] || "/images/product-placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                {discount > 0 && (
                                    <div className="absolute top-8 left-8">
                                        <span className="px-6 py-2 bg-secondary-500 text-stone-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                                            -{discount}% Off
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.slice(1).map((img, i) => (
                                <div key={i} className="premium-card overflow-hidden cursor-pointer hover:border-primary-500/50 transition-all aspect-square">
                                    <img src={img} alt={`${product.name} detail ${i}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400">{product.category}</span>
                            <div className="h-1 w-1 bg-earth-800 rounded-full"></div>
                            {product.stock > 0 ? (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">In Stock</span>
                            ) : (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Out of Stock</span>
                            )}
                        </div>

                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight tracking-tighter">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-6 mb-10">
                            <div className="flex items-center gap-1.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={`${i < 5 ? 'text-secondary-400 fill-secondary-400' : 'text-earth-800'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-earth-400 text-xs font-bold uppercase tracking-widest">
                                Wildcrafted &amp; Verified
                            </span>
                        </div>

                        <div className="flex items-center gap-6 mb-12">
                            <span className="text-5xl font-bold text-white">
                                {formatPrice(product.price)}
                            </span>
                            {product.compareAtPrice && (
                                <span className="text-2xl text-earth-600 line-through italic font-light">
                                    {formatPrice(product.compareAtPrice)}
                                </span>
                            )}
                        </div>

                        <div className="p-8 bg-earth-900/40 backdrop-blur-xl border border-earth-800 rounded-[2rem] mb-12">
                            <p className="text-earth-300 text-lg leading-relaxed italic font-light mb-8">
                                &quot;{product.description}&quot;
                            </p>
                            <div className="space-y-4">
                                {product.benefits.map((benefit: string, index: number) => (
                                    <div key={index} className="flex items-center gap-3 text-sm text-stone-300 font-medium">
                                        <div className="w-5 h-5 bg-primary-900/40 rounded-full flex items-center justify-center border border-primary-500/30">
                                            <Check className="w-3 h-3 text-primary-400" />
                                        </div>
                                        {benefit}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <p className="text-xs text-earth-600 italic mb-4 leading-relaxed">
                            Food supplement. Not intended to diagnose, treat, cure or prevent any disease. Consult your GP before use, especially if pregnant, breastfeeding or on medication.
                        </p>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                            <AddToCartButton
                                slug={product.slug}
                                name={product.name}
                                price={product.price}
                                image={product.images[0]}
                                disabled={product.stock === 0}
                            />
                            <div className="flex gap-4">
                                <WishlistButton slug={product.slug} />
                                <ShareButton title={product.name} slug={product.slug} />
                            </div>
                        </div>

                        {/* Wellness Goals */}
                        {product.therapeuticGoals?.length > 0 && (
                            <div className="p-6 bg-earth-950/50 border border-earth-800 rounded-2xl">
                                <h3 className="text-xs font-bold mb-3 uppercase text-earth-500 tracking-widest">Wellness Goals</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.therapeuticGoals.map((goal: string) => (
                                        <span key={goal} className="px-3 py-1 bg-primary-900/30 border border-primary-800/40 text-xs text-primary-300 rounded-lg">
                                            {goal}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trust row */}
                        <div className="flex flex-wrap gap-4 pt-2 text-xs text-earth-500">
                            <span>🌿 Wildcrafted &amp; natural</span>
                            <span>🚚 Free UK delivery over £40</span>
                            <span>🔄 14-day returns</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
