import Link from 'next/link'
import { ShoppingCart, Star, Heart, ArrowRight } from 'lucide-react'
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
    botanicalData?: {
        minerals?: string[]
        origin?: string
        alkalinity?: string
    }
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
    botanicalData = {
        minerals: ['Iron', 'Potassium', 'Magnesium'],
        origin: 'Wildcrafted Caribbean',
        alkalinity: '9.0 pH'
    },
    isBundle
}: ProductCardProps) {
    const formatPrice = (cents: number) => `£${(cents / 100).toFixed(2)}`

    return (
        <div className="bg-earth-900/40 backdrop-blur-md border border-earth-800/50 rounded-[2rem] overflow-hidden hover:border-primary-500/50 transition-all duration-700 group relative">
            <Link href={`/shop/${slug}`}>
                <div className="relative h-80 overflow-hidden bg-earth-950">
                    {images && images.length > 0 ? (
                        <img
                            src={images[0]}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-earth-950 text-earth-700 uppercase font-black text-[10px] tracking-widest">
                            No Matrix Image
                        </div>
                    )}

                    {/* Botanical Hover Data */}
                    <div className="absolute inset-0 bg-earth-950/90 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center p-8">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-400 mb-6">Biological Data</div>
                        <div className="space-y-4">
                            <div>
                                <div className="text-[8px] font-black uppercase text-earth-500 tracking-widest mb-1">Key Minerals</div>
                                <div className="flex flex-wrap gap-2">
                                    {botanicalData.minerals?.map(m => (
                                        <span key={m} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] text-white">{m}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[8px] font-black uppercase text-earth-500 tracking-widest mb-1">Origin</div>
                                    <div className="text-[10px] text-white font-bold">{botanicalData.origin}</div>
                                </div>
                                <div>
                                    <div className="text-[8px] font-black uppercase text-earth-500 tracking-widest mb-1">Alkalinity</div>
                                    <div className="text-[10px] text-primary-400 font-bold">{botanicalData.alkalinity}</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10 text-[10px] font-black uppercase tracking-widest text-secondary-400 flex items-center gap-2">
                            View Fact Sheet <ArrowRight size={10} />
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2 z-10 group-hover:opacity-0 transition-opacity">
                        {isBundle && (
                            <span className="px-3 py-1 bg-primary-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full border border-primary-400/30">
                                Therapeutic Package
                            </span>
                        )}
                        {featured && (
                            <span className="px-3 py-1 bg-secondary-600 text-earth-950 text-[8px] font-black uppercase tracking-widest rounded-full">
                                Authority Pick
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="px-3 py-1 bg-primary-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                                -{discount}% Restoration
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="p-8">
                {category && (
                    <span className="text-[10px] text-primary-400 font-black uppercase tracking-widest">
                        {category}
                    </span>
                )}

                <Link href={`/shop/${slug}`}>
                    <h3 className="font-serif text-2xl font-bold text-white mt-2 mb-4 group-hover:text-secondary-400 transition-colors line-clamp-1">
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-white">
                            {formatPrice(price)}
                        </span>
                        {compareAtPrice && (
                            <span className="text-sm text-earth-500 line-through font-medium">
                                {formatPrice(compareAtPrice)}
                            </span>
                        )}
                    </div>
                    <button className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:bg-primary-600 hover:border-primary-600 transition-all text-white">
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
