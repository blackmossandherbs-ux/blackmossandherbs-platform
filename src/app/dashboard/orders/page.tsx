import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ArrowLeft, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'My Orders - Black Moss & Herbs',
    description: 'View your order history and track shipments.',
}

const STATUS_STYLES: Record<string, string> = {
    PENDING: 'bg-yellow-900/30 text-yellow-400 border-yellow-800/50',
    PROCESSING: 'bg-blue-900/30 text-blue-400 border-blue-800/50',
    SHIPPED: 'bg-purple-900/30 text-purple-400 border-purple-800/50',
    DELIVERED: 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50',
    CANCELLED: 'bg-red-900/30 text-red-400 border-red-800/50',
}

export default async function DashboardOrdersPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect('/login')

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: {
                    product: { select: { name: true, images: true } }
                }
            }
        }
    })

    return (
        <div className="py-12 bg-earth-950 min-h-screen">
            <div className="container max-w-4xl">
                <div className="flex items-center gap-4 mb-10">
                    <Link href="/dashboard" className="text-earth-400 hover:text-amber-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-serif text-4xl font-bold text-white">Order History</h1>
                        <p className="text-earth-500 text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="card p-16 border border-earth-800 bg-earth-900/40 text-center">
                        <Package className="w-16 h-16 text-earth-700 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif font-bold text-white mb-3">No Orders Yet</h2>
                        <p className="text-earth-500 mb-8">Your botanical journey starts with your first order.</p>
                        <Link href="/shop" className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors uppercase tracking-widest text-sm">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="card border border-earth-800 bg-earth-900/40 overflow-hidden">
                                {/* Order Header */}
                                <div className="flex items-center justify-between p-6 border-b border-earth-800">
                                    <div>
                                        <div className="font-mono text-sm font-bold text-secondary-400">{order.orderNumber}</div>
                                        <div className="flex items-center gap-2 mt-1 text-earth-500 text-xs">
                                            <Clock className="w-3 h-3" />
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">
                                            £{order.total.toFixed(2)}
                                        </div>
                                        <span className={`mt-1 inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLES[order.status] || STATUS_STYLES.PENDING}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="divide-y divide-earth-800/50">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-5">
                                            <div className="w-14 h-14 bg-earth-800 rounded-xl overflow-hidden shrink-0">
                                                {item.product?.images?.[0] ? (
                                                    <Image
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        width={56}
                                                        height={56}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-white truncate">{item.product?.name || 'Product'}</div>
                                                <div className="text-earth-500 text-sm">Qty: {item.quantity}</div>
                                            </div>
                                            <div className="font-bold text-secondary-400 shrink-0">
                                                £{(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
