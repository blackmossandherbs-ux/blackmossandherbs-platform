/**
 * Black Moss & Herbs Platform - User Dashboard
 */
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Package, CreditCard, Calendar, Crown, Settings, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Dashboard - Black Moss & Herbs',
    description: 'Manage your orders, subscriptions, and account settings.',
}

const STATUS_STYLES: Record<string, string> = {
    PENDING: 'text-yellow-400',
    PROCESSING: 'text-blue-400',
    SHIPPED: 'text-purple-400',
    DELIVERED: 'text-emerald-400',
    CANCELLED: 'text-red-400',
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) redirect('/login')

    const [recentOrders, activeSubscription, consultations] = await Promise.all([
        prisma.order.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            take: 3,
            include: { items: true }
        }),
        prisma.subscription.findFirst({
            where: { userId: session.user.id, status: 'ACTIVE' },
            include: { plan: true },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.consultation.findMany({
            where: { userId: session.user.id, status: { in: ['SCHEDULED', 'PENDING'] } },
            orderBy: { createdAt: 'desc' },
            take: 2
        })
    ])

    const totalOrders = await prisma.order.count({ where: { userId: session.user.id } })

    return (
        <div className="py-12 bg-earth-950 min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/patterns/sea-moss-pattern.svg')] bg-repeat opacity-5 pointer-events-none" />

            <div className="container relative z-10">
                <div className="mb-10">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent mb-2">
                        Welcome back{session.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}
                    </h1>
                    <p className="text-earth-400">Manage your botanical wellness journey</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Total Orders', value: totalOrders, icon: Package, color: 'primary' },
                        { label: 'Subscription', value: activeSubscription ? 'Active' : 'None', icon: CreditCard, color: 'secondary' },
                        { label: 'Consultations', value: consultations.length, icon: Calendar, color: 'earth' },
                        { label: 'Active Plan', value: activeSubscription?.plan.name || 'Free', icon: Crown, color: 'primary' },
                    ].map((stat, index) => (
                        <div key={index} className="card p-6 border border-earth-800 bg-earth-900/40">
                            <div className={`w-10 h-10 bg-${stat.color}-900/20 rounded-xl flex items-center justify-center mb-4`}>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-xs text-earth-500 uppercase tracking-widest font-bold">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Recent Orders */}
                        <div className="card border border-earth-800 bg-earth-900/40 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-serif font-bold text-white">Recent Orders</h2>
                                <Link href="/dashboard/orders" className="text-secondary-400 text-sm font-bold hover:text-secondary-300 flex items-center gap-1 transition-colors">
                                    View All <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            {recentOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-earth-500 mb-4">No orders yet.</p>
                                    <Link href="/shop" className="text-secondary-400 text-sm font-bold hover:text-secondary-300 transition-colors">
                                        Browse Products →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 bg-earth-950/50 border border-earth-800/50 rounded-xl">
                                            <div>
                                                <div className="font-mono font-bold text-secondary-400 text-sm">{order.orderNumber}</div>
                                                <div className="text-earth-500 text-xs mt-0.5">
                                                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    {' · '}{order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-white">£{order.total.toFixed(2)}</div>
                                                <div className={`text-xs font-bold uppercase tracking-widest ${STATUS_STYLES[order.status] || 'text-earth-400'}`}>
                                                    {order.status}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Active Subscription */}
                        <div className="card border border-earth-800 bg-earth-900/40 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-serif font-bold text-white">Subscription</h2>
                                <Link href="/subscriptions" className="text-secondary-400 text-sm font-bold hover:text-secondary-300 transition-colors">
                                    {activeSubscription ? 'Manage' : 'View Plans'}
                                </Link>
                            </div>
                            {activeSubscription ? (
                                <div className="bg-gradient-to-r from-primary-900/40 to-secondary-900/40 border border-primary-700/30 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Crown className="w-6 h-6 text-secondary-400" />
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{activeSubscription.plan.name}</h3>
                                            <p className="text-earth-400 text-sm">Active Subscription</p>
                                        </div>
                                    </div>
                                    <div className="text-secondary-400 font-bold text-xl">
                                        £{activeSubscription.plan.price.toFixed(2)}<span className="text-earth-500 font-normal text-sm">/month</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-earth-500 mb-4">No active subscription.</p>
                                    <Link href="/subscriptions" className="inline-block px-6 py-3 bg-secondary-600 hover:bg-secondary-500 text-earth-950 font-black uppercase tracking-widest text-xs rounded-xl transition-colors">
                                        Join a Plan
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Account */}
                        <div className="card border border-earth-800 bg-earth-900/40 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-900/40 to-secondary-900/40 border border-earth-700 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🌿</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{session.user.name || 'Herbalist'}</h3>
                                    <p className="text-earth-500 text-sm">{session.user.email}</p>
                                </div>
                            </div>
                            <Link href="/dashboard/settings">
                                <button className="w-full flex items-center justify-center gap-2 py-3 border border-earth-700 hover:border-earth-600 text-earth-300 hover:text-white text-sm font-bold uppercase tracking-widest rounded-xl transition-colors">
                                    <Settings className="w-4 h-4" /> Account Settings
                                </button>
                            </Link>
                        </div>

                        {/* Upcoming Consultations */}
                        <div className="card border border-earth-800 bg-earth-900/40 p-6">
                            <h3 className="font-serif text-xl font-bold text-white mb-4">Consultations</h3>
                            {consultations.length > 0 ? (
                                <div className="space-y-3">
                                    {consultations.map((c) => (
                                        <div key={c.id} className="p-4 bg-earth-950/50 border border-earth-800/50 rounded-xl">
                                            <div className="font-bold text-white text-sm capitalize">{c.type.replace('_', ' ').toLowerCase()}</div>
                                            <div className="text-earth-500 text-xs mt-1 uppercase tracking-widest font-bold">{c.status}</div>
                                            {c.date && (
                                                <div className="text-secondary-400 text-xs mt-1">
                                                    {new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-earth-500 text-sm mb-4">No upcoming consultations.</p>
                            )}
                            <Link href="/consultations">
                                <button className="w-full mt-4 py-3 border border-earth-700 hover:border-secondary-500/50 text-earth-300 hover:text-secondary-400 text-xs font-black uppercase tracking-widest rounded-xl transition-colors">
                                    Book a Session
                                </button>
                            </Link>
                        </div>

                        {/* Loyalty */}
                        <div className="card border border-secondary-500/20 bg-secondary-950/20 p-8 relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 w-24 h-24 bg-secondary-500/10 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="font-serif text-xl font-bold text-white mb-2">Botanical Credits</h3>
                            <div className="text-5xl font-black text-secondary-400 mb-3">
                                {Math.floor(recentOrders.reduce((sum, o) => sum + o.total, 0) * 10)}
                            </div>
                            <p className="text-earth-400 text-xs mb-6 leading-relaxed">Points earned from your purchases. Redeem for discounts on any formula.</p>
                            <Link href="/shop">
                                <button className="w-full bg-secondary-600 hover:bg-secondary-500 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all text-xs">
                                    Shop &amp; Earn More
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
