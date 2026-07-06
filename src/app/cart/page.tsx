'use client'

/**
 * Black Moss & Herbs Platform - Shopping Cart
 */
import { useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import Button from '@/components/Button'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
    const { items, subtotal, updateQuantity, removeItem } = useCart()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const shipping = subtotal > 50 || subtotal === 0 ? 0 : 8.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

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
        <div className="py-12">
            <div className="container">
                <h1 className="section-title mb-8">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-serif font-bold text-earth-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-earth-600 mb-6">
                            Add some products to get started on your wellness journey
                        </p>
                        <Link href="/shop">
                            <Button>Continue Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.slug} className="card p-6">
                                    <div className="flex gap-6">
                                        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl">🌿</span>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <Link href={`/shop/${item.slug}`}>
                                                <h3 className="font-serif text-xl font-bold text-earth-900 mb-2 hover:text-primary-600 transition-colors">
                                                    {item.name}
                                                </h3>
                                            </Link>
                                            <div className="text-2xl font-bold text-primary-600 mb-4">
                                                {formatPrice(item.price)}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-earth-300 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                                                        aria-label="Decrease quantity"
                                                        className="px-3 py-2 hover:bg-earth-100 transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-4 py-2 border-x border-earth-300 font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                                                        aria-label="Increase quantity"
                                                        className="px-3 py-2 hover:bg-earth-100 transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.slug)}
                                                    aria-label="Remove item"
                                                    className="text-red-600 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-earth-900">
                                                {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Link href="/shop">
                                <Button variant="outline" className="w-full">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <div className="card p-6 sticky top-24">
                                <h2 className="text-2xl font-serif font-bold text-earth-900 mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-earth-700">
                                        <span>Subtotal</span>
                                        <span className="font-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-earth-700">
                                        <span>Shipping</span>
                                        <span className="font-medium">
                                            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-earth-700">
                                        <span>Tax</span>
                                        <span className="font-medium">{formatPrice(tax)}</span>
                                    </div>

                                    {shipping === 0 && subtotal > 0 && (
                                        <div className="bg-primary-50 text-primary-700 p-3 rounded-lg text-sm">
                                            🎉 You qualify for free shipping!
                                        </div>
                                    )}

                                    <div className="border-t border-earth-200 pt-4">
                                        <div className="flex justify-between text-xl font-bold text-earth-900">
                                            <span>Total</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    size="lg"
                                    className="w-full mb-4"
                                    onClick={handleCheckout}
                                    disabled={loading}
                                >
                                    {loading ? 'Starting Checkout…' : 'Proceed to Checkout'}
                                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                                </Button>

                                <div className="text-center text-sm text-earth-600">
                                    <p>Secure checkout powered by Stripe</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
