/**
 * Black Moss & Herbs Platform - Analytics Intelligence Dashboard
 * Live figures from /api/admin/stats.
 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, DollarSign, Users, ShoppingBag, Activity } from 'lucide-react'

interface Stats {
    totalRevenue: number
    activeOrders: number
    totalCustomers: number
    mrr: number
    totalOrders: number
}
interface TopProduct {
    name: string
    sales: number
    revenue: number
}

const gbp = (n: number) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function AnalyticsPage() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [topProducts, setTopProducts] = useState<TopProduct[]>([])
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(async (r) => {
                if (!r.ok) throw new Error((await r.json()).error || 'Failed to load analytics')
                return r.json()
            })
            .then((d) => {
                setStats(d.stats)
                setTopProducts(d.topProducts || [])
            })
            .catch((e) => setError(e.message))
    }, [])

    const aov = stats && stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0
    const ltv = stats && stats.totalCustomers > 0 ? stats.totalRevenue / stats.totalCustomers : 0

    const cards = stats
        ? [
              { label: 'Total Revenue', value: gbp(stats.totalRevenue), icon: DollarSign, color: 'text-primary-400' },
              { label: 'Monthly Recurring Revenue', value: gbp(stats.mrr), icon: TrendingUp, color: 'text-secondary-400' },
              { label: 'Active Orders', value: String(stats.activeOrders), icon: ShoppingBag, color: 'text-primary-400' },
              { label: 'Total Customers', value: String(stats.totalCustomers), icon: Users, color: 'text-secondary-400' },
          ]
        : []

    return (
        <div className="py-12 bg-earth-950 min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/patterns/sea-moss-pattern.svg')] bg-repeat opacity-5 pointer-events-none" />
            <div className="container relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent mb-2">
                            Analytics
                        </h1>
                        <p className="text-earth-400 text-lg">Live financial &amp; product performance</p>
                    </div>
                    <Link href="/admin" className="text-earth-400 hover:text-amber-500 text-sm font-bold uppercase tracking-widest">
                        ← Dashboard
                    </Link>
                </div>

                {error && <div className="card p-6 mb-8 text-red-600">{error}</div>}
                {!stats && !error && <div className="text-earth-500 uppercase tracking-widest text-sm animate-pulse">Loading telemetry…</div>}

                {stats && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {cards.map((c, idx) => (
                                <div key={idx} className="card p-8 border border-earth-800 bg-earth-900/40 backdrop-blur-xl">
                                    <div className="w-12 h-12 bg-earth-950/50 border border-earth-800 rounded-2xl flex items-center justify-center mb-6">
                                        <c.icon className={`w-6 h-6 ${c.color}`} />
                                    </div>
                                    <h3 className="text-earth-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{c.label}</h3>
                                    <div className="text-3xl font-serif font-bold text-white tracking-tight">{c.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 card border border-earth-800 bg-earth-900/60 backdrop-blur-xl p-10 rounded-[2.5rem]">
                                <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3 mb-10">
                                    <Activity className="text-secondary-400" /> Key Ratios
                                </h2>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-[10px] text-earth-500 font-black uppercase mb-1">Average Order</div>
                                        <div className="text-2xl font-bold text-white">{gbp(aov)}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] text-earth-500 font-black uppercase mb-1">Revenue / Customer</div>
                                        <div className="text-2xl font-bold text-white">{gbp(ltv)}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] text-earth-500 font-black uppercase mb-1">Total Orders</div>
                                        <div className="text-2xl font-bold text-secondary-400">{stats.totalOrders}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1 card border border-earth-800 bg-earth-900/40 backdrop-blur-xl p-8 rounded-[2rem]">
                                <h2 className="text-xl font-serif font-bold text-white mb-8">Top Products</h2>
                                <div className="space-y-4">
                                    {topProducts.length === 0 && <p className="text-earth-500 text-sm">No sales yet.</p>}
                                    {topProducts.map((p, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-earth-950/50 rounded-2xl border border-earth-800">
                                            <div className="font-bold text-sm text-white truncate pr-3">{p.name}</div>
                                            <div className="text-right shrink-0">
                                                <div className="font-bold text-white">{gbp(p.revenue)}</div>
                                                <div className="text-[10px] font-black text-earth-500 uppercase">{p.sales} sold</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
