import { Metadata } from 'next'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import Button from '@/components/Button'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
    title: 'Shopping Cart - Black Moss & Herbs',
    description: 'Review your cart and proceed to checkout.',
}

// Mock cart data
const cartItems = [
    {
        id: '1',
        productId: '1',
        name: 'Sea Moss Gold Gel',
        price: 34.99,
        quantity: 2,
        image: '🌿',
    },
    {
        id: '2',
        productId: '2',
        name: 'Elderberry Syrup',
        price: 24.99,
        quantity: 1,
        image: '🌿',
    },
]

export default function CartPage() {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal > 50 ? 0 : 8.99
    const tax = subtotal * 0.08
    const total = subtotal + shipping + tax

    return (
        <div className="py-12">
            <div className="container">
                <h1 className="section-title mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
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
                            {cartItems.map((item) => (
                                <div key={item.id} className="card p-6">
                                    <div className="flex gap-6">
                                        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-4xl">{item.image}</span>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-serif text-xl font-bold text-earth-900 mb-2">
                                                {item.name}
                                            </h3>
                                            <div className="text-2xl font-bold text-primary-600 mb-4">
                                                {formatPrice(item.price)}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-earth-300 rounded-lg">
                                                    <button className="px-3 py-2 hover:bg-earth-100 transition-colors">
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-4 py-2 border-x border-earth-300 font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button className="px-3 py-2 hover:bg-earth-100 transition-colors">
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <button className="text-red-600 hover:text-red-700 transition-colors">
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

                                    {shipping === 0 && (
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

                                <Link href="/checkout">
                                    <Button size="lg" className="w-full mb-4">
                                        Proceed to Checkout
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>

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
