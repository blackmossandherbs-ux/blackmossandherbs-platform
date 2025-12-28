import { Metadata } from 'next'
import { BarChart3, Package, Users, DollarSign, TrendingUp, ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Admin Dashboard - Black Moss & Herbs',
    description: 'Manage your store, orders, and customers.',
}

export default function AdminPage() {
    return (
        <div className="py-12 bg-earth-50 min-h-screen">
            <div className="container">
                <div className="mb-8">
                    <h1 className="section-title">Admin Dashboard</h1>
                    <p className="text-earth-600">Manage your store and track performance</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        {
                            label: 'Total Revenue',
                            value: '$45,231',
                            change: '+12.5%',
                            icon: DollarSign,
                            color: 'primary',
                        },
                        {
                            label: 'Orders',
                            value: '342',
                            change: '+8.2%',
                            icon: ShoppingBag,
                            color: 'secondary',
                        },
                        {
                            label: 'Customers',
                            value: '1,234',
                            change: '+15.3%',
                            icon: Users,
                            color: 'earth',
                        },
                        {
                            label: 'Products',
                            value: '87',
                            change: '+3',
                            icon: Package,
                            color: 'primary',
                        },
                    ].map((stat, index) => (
                        <div key={index} className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                                <div className="flex items-center gap-1 text-primary-600 text-sm font-medium">
                                    <TrendingUp className="w-4 h-4" />
                                    {stat.change}
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-earth-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-earth-600">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Orders */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-serif font-bold text-earth-900 mb-6">Recent Orders</h2>
                        <div className="space-y-4">
                            {[
                                { id: 'ORD-001', customer: 'John Doe', amount: 89.97, status: 'Processing' },
                                { id: 'ORD-002', customer: 'Jane Smith', amount: 54.99, status: 'Shipped' },
                                { id: 'ORD-003', customer: 'Bob Johnson', amount: 124.50, status: 'Delivered' },
                                { id: 'ORD-004', customer: 'Alice Brown', amount: 34.99, status: 'Pending' },
                            ].map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-earth-50 rounded-lg">
                                    <div>
                                        <div className="font-semibold text-earth-900">{order.id}</div>
                                        <div className="text-sm text-earth-600">{order.customer}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-earth-900">${order.amount}</div>
                                        <div className="text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${order.status === 'Delivered' ? 'bg-primary-100 text-primary-700' :
                                                    order.status === 'Shipped' ? 'bg-secondary-100 text-secondary-700' :
                                                        'bg-earth-200 text-earth-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="card p-6">
                        <h2 className="text-2xl font-serif font-bold text-earth-900 mb-6">Top Products</h2>
                        <div className="space-y-4">
                            {[
                                { name: 'Sea Moss Gold Gel', sales: 145, revenue: 5073.55 },
                                { name: 'Elderberry Syrup', sales: 98, revenue: 2449.02 },
                                { name: 'Turmeric Capsules', sales: 87, revenue: 2606.13 },
                                { name: 'Herbal Tea Blend', sales: 76, revenue: 1443.24 },
                            ].map((product, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-earth-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">🌿</span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-earth-900">{product.name}</div>
                                            <div className="text-sm text-earth-600">{product.sales} sales</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-primary-600">
                                        ${product.revenue.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Manage Products', href: '/admin/products', icon: Package },
                        { label: 'View Orders', href: '/admin/orders', icon: ShoppingBag },
                        { label: 'Customers', href: '/admin/customers', icon: Users },
                        { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
                    ].map((action, index) => (
                        <button
                            key={index}
                            className="card p-6 hover:scale-105 transition-transform text-center group"
                        >
                            <action.icon className="w-8 h-8 text-primary-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                            <div className="font-medium text-earth-900">{action.label}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
