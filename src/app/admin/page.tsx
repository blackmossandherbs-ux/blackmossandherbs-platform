/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Dashboard
 */
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Metadata } from 'next'
import {
    DollarSign,
    ShoppingBag,
    Users,
    BarChart3,
    TrendingUp,
    Package,
    Search,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Admin Dashboard - Black Moss & Herbs',
    description: 'Manage your store, orders, and customers.',
}

async function getAdminData() {
    // 1. Stats
    const totalRevenue = await prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } }
    });

    const activeOrdersCount = await prisma.order.count({
        where: { status: { in: ['PENDING', 'PROCESSING', 'SHIPPED'] } }
    });

    const totalCustomers = await prisma.user.count({
        where: { role: 'CUSTOMER' }
    });

    const activeSubscriptions = await prisma.subscription.findMany({
        where: { status: 'ACTIVE' },
        include: { plan: true }
    });
    const mrr = activeSubscriptions.reduce((acc, sub) => acc + sub.plan.price, 0);

    // 2. Recent Transactions
    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
    });

    // 3. Top Products
    const topProductsRaw = await prisma.orderItem.groupBy({
        by: ['productId'],
        _count: { id: true },
        _sum: { price: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5
    });

    const topProducts = await Promise.all(topProductsRaw.map(async (tp) => {
        const product = await prisma.product.findUnique({
            where: { id: tp.productId },
            select: { name: true }
        });
        return {
            name: product?.name || 'Unknown Compound',
            sales: tp._count.id,
            revenue: tp._sum.price || 0,
            trending: true // Placeholder for now
        };
    }));

    return {
        stats: [
            { label: 'Total Revenue', value: `£${(totalRevenue._sum.total || 0).toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'secondary' },
            { label: 'Active Orders', value: activeOrdersCount.toString(), change: '+8.2%', icon: ShoppingBag, color: 'primary' },
            { label: 'Total Customers', value: totalCustomers.toLocaleString(), change: '+15.3%', icon: Users, color: 'earth' },
            { label: 'Consultation MRR', value: `£${mrr.toLocaleString()}`, change: '+22.1%', icon: BarChart3, color: 'secondary' },
        ],
        recentOrders: recentOrders.map(o => ({
            id: o.orderNumber,
            customer: o.user.name || o.user.email,
            amount: o.total,
            status: o.status
        })),
        topProducts
    };
}

export default async function AdminPage() {
    const data = await getAdminData();

    return (
        <div className="py-12 bg-earth-950 min-h-screen relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/patterns/sea-moss-pattern.svg')] bg-repeat opacity-5 pointer-events-none" />

            <div className="container relative z-10">
                <div className="mb-12">
                    <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent mb-2">
                        Industrial Dashboard
                    </h1>
                    <p className="text-earth-400 text-lg">HECTIC Authority Control Panel</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {data.stats.map((stat, index) => (
                        <div key={index} className="card p-8 border border-earth-800 bg-earth-900/40 backdrop-blur-xl relative group hover:border-secondary-500/50 transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-14 h-14 bg-${stat.color}-900/20 rounded-2xl flex items-center justify-center border border-${stat.color}-700/30 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className={`w-7 h-7 text-${stat.color}-400`} />
                                </div>
                                <div className="flex items-center gap-1 text-primary-400 text-sm font-bold bg-primary-950/30 px-3 py-1 rounded-full border border-primary-800/50">
                                    <TrendingUp className="w-4 h-4" />
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-4xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                            <div className="text-sm font-medium text-earth-400 uppercase tracking-widest">{stat.label}</div>

                            {/* Subtle Glow */}
                            <div className={`absolute -bottom-2 -left-2 w-24 h-24 bg-${stat.color}-500/5 blur-3xl rounded-full`} />
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <div className="card border border-earth-800 bg-earth-900/60 backdrop-blur-xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-serif font-bold text-white">Recent Transactions</h2>
                            <Link href="/admin/orders" className="text-secondary-400 text-sm font-bold hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {data.recentOrders.length > 0 ? data.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-5 bg-earth-950/50 border border-earth-800/50 rounded-2xl hover:border-earth-700 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-earth-800/50 rounded-xl flex items-center justify-center text-earth-400">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{order.id}</div>
                                            <div className="text-sm text-earth-500">{order.customer}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-secondary-400">£{order.amount.toFixed(2)}</div>
                                        <div className="mt-1">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${order.status === 'DELIVERED' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' :
                                                order.status === 'SHIPPED' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' :
                                                    'bg-earth-800/30 text-earth-400 border border-earth-700/50'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-earth-500 text-center py-8">No recent activity detected.</div>
                            )}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="card border border-earth-800 bg-earth-900/60 backdrop-blur-xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-serif font-bold text-white">Top Performing Formulas</h2>
                        </div>
                        <div className="space-y-4">
                            {data.topProducts.length > 0 ? data.topProducts.map((product, index) => (
                                <div key={index} className="flex items-center justify-between p-5 bg-earth-950/50 border border-earth-800/50 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-900/40 to-secondary-900/40 border border-primary-700/30 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                                            🌿
                                        </div>
                                        <div>
                                            <div className="font-bold text-white flex items-center gap-2">
                                                {product.name}
                                                {product.trending && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                                            </div>
                                            <div className="text-sm text-earth-500">{product.sales} batches sold</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-primary-400">
                                        £{product.revenue.toFixed(2)}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-earth-500 text-center py-8">Awaiting alchemical performance data.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Action Dock */}
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Inventory', href: '/admin/products', icon: Package },
                        { label: 'Dispatch', href: '/admin/orders', icon: ShoppingBag },
                        { label: 'System', href: '/admin/system', icon: DollarSign },
                        { label: 'Intelligence', href: '/admin/analytics', icon: BarChart3 },
                    ].map((action, index) => (
                        <Link key={index} href={action.href}>
                            <button className="w-full card p-8 border border-earth-800 bg-earth-900/20 backdrop-blur-md hover:bg-earth-800/40 transition-all text-center group rounded-3xl">
                                <div className="w-16 h-16 bg-earth-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary-900/30 transition-all border border-earth-700/50">
                                    <action.icon className="w-8 h-8 text-secondary-500" />
                                </div>
                                <div className="font-bold text-white tracking-wide uppercase text-xs">{action.label}</div>
                            </button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
