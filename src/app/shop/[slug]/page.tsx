/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Product Detail View
 */
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Heart, Share2, Check, Globe2, ShieldAlert } from 'lucide-react'
import Button from '@/components/Button'
import AddToCartButton from '@/components/AddToCartButton'
import { formatPrice } from '@/lib/utils'
import { ProductService } from '@/services/ProductService'
import { getResearchForProduct } from '@/data/herbResearch'
import { getGlobalDisclaimer } from '@/lib/compliance'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const product = await ProductService.getProductBySlug(params.slug)

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

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await ProductService.getProductBySlug(params.slug)

    if (!product) {
        notFound()
    }

    const discount = product.compareAtPrice
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0

    const research = getResearchForProduct(product.name, product.category)

    return (
        <div className="py-24 bg-earth-950 min-h-screen relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/patterns/sea-moss-pattern.svg')] bg-repeat opacity-5 pointer-events-none" />

            <div className="container relative z-10 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Product Images */}
                    <div className="space-y-6">
                        <div className="premium-card overflow-hidden group">
                            <div className="aspect-square bg-earth-900 flex items-center justify-center relative">
                                <Image
                                    src={product.images[0] || "/images/product-placeholder.svg"}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                {discount > 0 && (
                                    <div className="absolute top-8 left-8">
                                        <span className="px-6 py-2 bg-secondary-500 text-stone-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                                            -{discount}% Authority
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images.slice(1).map((img, i) => (
                                <div key={i} className="premium-card overflow-hidden cursor-pointer hover:border-primary-500/50 transition-all aspect-square relative">
                                    <Image src={img} alt={`${product.name} detail ${i}`} fill sizes="25vw" className="object-cover" />
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
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Available</span>
                            ) : (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400">Dormant</span>
                            )}
                        </div>

                        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight tracking-tighter">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-2 mb-10">
                            <Globe2 className="w-4 h-4 text-primary-400" />
                            <span className="text-earth-400 text-xs font-bold uppercase tracking-widest">
                                Sourced &amp; Studied Worldwide
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

                        {/* The Research */}
                        {research && (
                            <div className="p-8 bg-earth-900/40 backdrop-blur-xl border border-earth-800 rounded-[2rem] mb-12">
                                <div className="flex items-center gap-2 mb-4">
                                    <Globe2 className="w-4 h-4 text-primary-400" />
                                    <h3 className="font-black text-[10px] uppercase text-earth-500 tracking-[0.2em]">The Research</h3>
                                </div>
                                <p className="text-xs text-earth-500 uppercase tracking-widest font-bold mb-3">{research.origin}</p>
                                <p className="text-sm text-stone-300 leading-relaxed mb-4">{research.summary}</p>
                                {research.safetyNote && (
                                    <div className="flex gap-3 p-4 mb-4 bg-amber-950/30 border border-amber-800/40 rounded-xl">
                                        <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-200 leading-relaxed">{research.safetyNote}</p>
                                    </div>
                                )}
                                {research.citations.length > 0 && (
                                    <ul className="space-y-2 mb-4">
                                        {research.citations.map((c) => (
                                            <li key={c.url}>
                                                <a
                                                    href={c.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer nofollow"
                                                    className="text-xs text-primary-400 hover:text-primary-300 underline underline-offset-2"
                                                >
                                                    {c.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <p className="text-[10px] text-earth-600 leading-relaxed">{getGlobalDisclaimer()}</p>
                            </div>
                        )}

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
                                <Button variant="outline" size="lg" className="h-20 flex-1 rounded-2xl border-earth-800 hover:border-earth-600">
                                    <Heart className="w-6 h-6" />
                                </Button>
                                <Button variant="outline" size="lg" className="h-20 flex-1 rounded-2xl border-earth-800 hover:border-earth-600">
                                    <Share2 className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>

                        {/* Technical Matrix */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-earth-950/50 border border-earth-800 rounded-2xl">
                                <h3 className="font-black text-[10px] mb-3 uppercase text-earth-500 tracking-[0.2em]">Therapeutic Goals</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.therapeuticGoals?.map((goal: string) => (
                                        <span key={goal} className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold text-earth-400 rounded-lg">
                                            {goal}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 bg-earth-950/50 border border-earth-800 rounded-2xl">
                                <h3 className="font-black text-[10px] mb-3 uppercase text-earth-500 tracking-[0.2em]">Biometric ID</h3>
                                <div className="text-secondary-400 font-mono text-xs uppercase">Entity_ALC_{product.id.slice(-8)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
