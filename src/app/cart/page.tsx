'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
    const { items, subtotal, updateQuantity, removeItem } = useCart()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // UK pricing: VAT already included in displayed prices. Free delivery over £40.
    const shipping = subtotal === 0 ? 0 : subtotal >= 40 ? 0 : 3.99
    const total = subtotal + shipping

    const handleCheckout = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(i => ({ slug: i.slug, quantity: i.quantity })),
                }),
            })
            const data = await res.json()
            if (!res.ok || !data.url) {
                setError(data.error || 'Could not start checkout. Please try again.')
                setLoading(false)
                return
            }
            window.location.href = data.url
        } catch {
            setError('Network error. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="py-24 bg-earth-950 min-h-screen">
            <div className="container pt-12">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-12 tracking-tighter">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-24 premium-card max-w-md mx-auto">
                        <ShoppingBag className="w-16 h-16 text-earth-700 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif font-bold text-white mb-3">Your cart is empty</h2>
                        <p className="text-earth-500 mb-8">Add products to get started on your wellness journey.</p>
                        <Link href="/shop" className="inline-block px-8 py-4 bg-secondary-500 hover:bg-secondary-400 text-stone-950 font-bold rounded-xl transition-colors">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.slug} className="premium-card p-6">
                                    <div className="flex gap-6">
                                        <div className="w-24 h-24 bg-earth-900 rounded-xl flex-shrink-0 overflow-hidden border border-earth-800">
                                            {item.image
                                                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center text-earth-700 text-2xl">🌿</div>
                                            }
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <Link href={`/shop/${item.slug}`}>
                                                <h3 className="font-serif text-lg font-bold text-white mb-1 hover:text-secondary-400 transition-colors truncate">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <div className="text-secondary-400 font-bold text-lg mb-4">
                                                {formatPrice(item.price)}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-earth-700 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                                                        aria-label="Decrease quantity"
                                                        className="px-3 py-2 hover:bg-earth-800 transition-colors text-earth-300"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="px-4 py-2 border-x border-earth-700 text-white font-bold text-sm min-w-[3rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                                                        aria-label="Increase quantity"
                                                        className="px-3 py-2 hover:bg-earth-800 transition-colors text-earth-300"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.slug)}
                                                    aria-label="Remove item"
                                                    className="text-earth-600 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <div className="text-white font-bold text-lg">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Link href="/shop" className="inline-block text-earth-500 hover:text-earth-300 text-sm font-bold uppercase tracking-widest transition-colors">
                                ← Continue Shopping
                            </Link>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="premium-card p-8 sticky top-24">
                                <h2 className="text-xl font-serif font-bold text-white mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-earth-400 text-sm">
                                        <span>Subtotal</span>
                                        <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-earth-400 text-sm">
                                        <span>UK Delivery</span>
                                        <span className={shipping === 0 ? 'text-emerald-400 font-bold' : 'text-white font-medium'}>
                                            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-earth-400 text-xs italic">
                                        <span>VAT</span>
                                        <span>Included</span>
                                    </div>

                                    {shipping > 0 && (
                                        <div className="bg-primary-900/20 border border-primary-800/40 text-primary-300 p-3 rounded-xl text-xs leading-relaxed">
                                            Add {formatPrice(40 - subtotal)} more for free UK delivery
                                        </div>
                                    )}
                                    {shipping === 0 && subtotal > 0 && (
                                        <div className="bg-emerald-900/20 border border-emerald-800/40 text-emerald-400 p-3 rounded-xl text-xs font-bold">
                                            You qualify for free UK delivery!
                                        </div>
                                    )}

                                    <div className="border-t border-earth-800 pt-4">
                                        <div className="flex justify-between text-white font-bold text-xl">
                                            <span>Total</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-900/20 border border-red-800 text-red-400 p-3 rounded-xl text-sm mb-4">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full py-4 bg-secondary-500 hover:bg-secondary-400 disabled:opacity-50 text-stone-950 font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 mb-4"
                                >
                                    {loading ? 'Starting Checkout…' : <>Proceed to Checkout <ArrowRight className="w-4 h-4" /></>}
                                </button>

                                <p className="text-center text-xs text-earth-600">
                                    Secure checkout powered by Stripe · All prices inc. VAT
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
