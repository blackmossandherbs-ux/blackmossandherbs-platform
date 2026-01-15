/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - User Dashboard
 */
import { Metadata } from 'next'
import Link from 'next/link'
import { Package, CreditCard, Download, Calendar, Crown, Settings } from 'lucide-react'
import Button from '@/components/Button'

export const metadata: Metadata = {
    title: 'Dashboard - Black Moss & Herbs',
    description: 'Manage your orders, subscriptions, and account settings.',
}

export default function DashboardPage() {
    return (
        <div className="py-12">
            <div className="container">
                <div className="mb-8">
                    <h1 className="section-title">My Dashboard</h1>
                    <p className="text-earth-600">Welcome back! Manage your wellness journey here.</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Active Orders', value: '2', icon: Package, color: 'primary' },
                        { label: 'Subscriptions', value: '1', icon: CreditCard, color: 'secondary' },
                        { label: 'Downloads', value: '5', icon: Download, color: 'earth' },
                        { label: 'Consultations', value: '3', icon: Calendar, color: 'primary' },
                    ].map((stat, index) => (
                        <div key={index} className="card p-6">
                            <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                            <div className="text-3xl font-bold text-earth-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-earth-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Recent Orders */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-serif font-bold text-earth-900">Recent Orders</h2>
                                <Link href="/dashboard/orders">
                                    <Button variant="outline" size="sm">View All</Button>
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { id: 'ORD-2024-001', date: 'Dec 25, 2024', status: 'Shipped', total: 89.97 },
                                    { id: 'ORD-2024-002', date: 'Dec 20, 2024', status: 'Delivered', total: 54.99 },
                                ].map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-earth-50 rounded-lg">
                                        <div>
                                            <div className="font-semibold text-earth-900">{order.id}</div>
                                            <div className="text-sm text-earth-600">{order.date}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-earth-900">${order.total}</div>
                                            <div className={`text-sm ${order.status === 'Delivered' ? 'text-primary-600' : 'text-secondary-600'
                                                }`}>
                                                {order.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active Subscription */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-serif font-bold text-earth-900">Active Subscription</h2>
                                <Link href="/subscriptions">
                                    <Button variant="outline" size="sm">Manage</Button>
                                </Link>
                            </div>
                            <div className="bg-gradient-primary text-white rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Crown className="w-8 h-8" />
                                    <div>
                                        <h3 className="text-2xl font-bold">Wellness Plus</h3>
                                        <p className="text-primary-100">Monthly Subscription</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-primary-100 text-sm">Next Billing</div>
                                        <div className="font-semibold">Jan 15, 2025</div>
                                    </div>
                                    <div>
                                        <div className="text-primary-100 text-sm">Amount</div>
                                        <div className="font-semibold">$54.99/month</div>
                                    </div>
                                </div>
                                <div className="text-sm text-primary-100">
                                    ✓ 20% off all purchases • ✓ Free shipping • ✓ Priority support
                                </div>
                            </div>
                        </div>

                        {/* Digital Library */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-serif font-bold text-earth-900">Digital Library</h2>
                                <Link href="/library">
                                    <Button variant="outline" size="sm">View All</Button>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    'Herbal Remedies Guide',
                                    'Sea Moss Recipe Book',
                                    'Wellness Journal Template',
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-4 bg-earth-50 rounded-lg">
                                        <Download className="w-5 h-5 text-primary-600" />
                                        <span className="text-earth-900 text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Account Info */}
                        <div className="card p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                                    <span className="text-2xl text-white">👤</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-earth-900">John Doe</h3>
                                    <p className="text-sm text-earth-600">john@example.com</p>
                                </div>
                            </div>
                            <Link href="/dashboard/settings">
                                <Button variant="outline" className="w-full">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Account Settings
                                </Button>
                            </Link>
                        </div>

                        {/* Upcoming Consultations */}
                        <div className="card p-6">
                            <h3 className="font-serif text-xl font-bold text-earth-900 mb-4">
                                Upcoming Consultations
                            </h3>
                            <div className="space-y-3">
                                <div className="p-4 bg-earth-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-primary-600" />
                                        <span className="font-semibold text-earth-900">Jan 5, 2025</span>
                                    </div>
                                    <div className="text-sm text-earth-600">Initial Wellness Consultation</div>
                                    <div className="text-sm text-earth-500">2:00 PM - 3:00 PM</div>
                                </div>
                            </div>
                            <Link href="/consultations">
                                <Button variant="outline" size="sm" className="w-full mt-4">
                                    Book New
                                </Button>
                            </Link>
                        </div>

                        {/* Botanical Credits */}
                        <div className="card p-8 border border-secondary-500/20 bg-secondary-950/20 backdrop-blur-xl relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 w-24 h-24 bg-secondary-500/10 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="font-serif text-2xl font-bold text-white mb-2">Botanical Credits</h3>
                            <div className="text-5xl font-black text-secondary-400 mb-2">1,250</div>
                            <p className="text-earth-400 text-sm mb-6 leading-relaxed">
                                You have high-affinity credits available for redemption on any organic compound.
                            </p>
                            <button className="w-full bg-secondary-600 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-secondary-500 transition-all shadow-lg shadow-secondary-900/20">
                                Reclaim Rewards
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
