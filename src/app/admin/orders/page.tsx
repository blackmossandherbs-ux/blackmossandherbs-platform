"use client";

import { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CheckCircle, Clock, Search, Filter, MoreVertical, ExternalLink, Loader2 } from 'lucide-react';

interface Order {
    id: string;
    orderNumber: string;
    total: number;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    createdAt: string;
    user: {
        name: string | null;
        email: string;
    };
    shippingAddress: any;
}

export default function OrderCommandCenter() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('Logistics sync failure:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) fetchOrders();
        } catch (error) {
            console.error('Status update failure:', error);
        }
    };

    const filteredOrders = orders.filter(o =>
        (o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'All Statuses' || o.status === statusFilter)
    );

    const stats = [
        { label: 'Active Dispatches', value: orders.filter(o => o.status === 'SHIPPED').length, icon: Truck, color: 'text-primary-400' },
        { label: 'Pending Processing', value: orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length, icon: Clock, color: 'text-secondary-400' },
        { label: 'Delivered (MTD)', value: orders.filter(o => o.status === 'DELIVERED').length, icon: CheckCircle, color: 'text-emerald-400' },
        { label: 'Total Volume', value: `£${orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, icon: ShoppingBag, color: 'text-earth-400' },
    ];

    return (
        <div className="py-12 bg-earth-950 min-h-screen relative overflow-hidden text-earth-200">
            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent mb-2">
                            Order Authority
                        </h1>
                        <p className="text-earth-400 text-lg">Manage dispatch flows and fulfillment logistics.</p>
                    </div>
                </div>

                {/* Logistics Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="card p-6 border border-earth-800 bg-earth-900/40 backdrop-blur-md rounded-2xl">
                            <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-earth-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-earth-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search orders, customers, IDs..."
                            className="w-full h-14 bg-earth-900/50 border border-earth-800 rounded-xl pl-14 pr-6 text-sm text-white focus:outline-none focus:border-secondary-500/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="h-14 px-6 bg-earth-900/50 border border-earth-800 rounded-xl text-xs font-black uppercase tracking-widest text-earth-400 outline-none focus:border-primary-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option>All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <button className="h-14 px-6 bg-secondary-600 hover:bg-secondary-500 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-secondary-900/20">
                            Bulk Manifest
                        </button>
                    </div>
                </div>

                {/* Order Table */}
                <div className="card border border-earth-800 bg-earth-900/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-earth-950/80 border-b border-earth-800">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500">Order ID</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500">Customer</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500">Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500">Amount</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-earth-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-earth-800/30">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
                                                <div className="text-earth-500 font-bold uppercase text-[10px] tracking-widest text-center">Synchronizing Logistics...</div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-all group">
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-white group-hover:text-secondary-400 transition-colors">{order.orderNumber}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-medium text-white">{order.user.name || order.user.email}</div>
                                            {order.user.name && <div className="text-[9px] text-earth-500 uppercase tracking-tighter mt-1">{order.user.email}</div>}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs text-earth-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-white">£{order.total.toFixed(2)}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-earth-800/50 border outline-none cursor-pointer ${order.status === 'DELIVERED' ? 'text-emerald-400 border-emerald-800/50' :
                                                        order.status === 'SHIPPED' ? 'text-blue-400 border-blue-800/50' :
                                                            order.status === 'PROCESSING' ? 'text-amber-400 border-amber-800/50' :
                                                                order.status === 'CANCELLED' ? 'text-red-400 border-red-800/50' :
                                                                    'text-earth-400 border-earth-700/50'
                                                    }`}
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="PROCESSING">Processing</option>
                                                <option value="SHIPPED">Shipped</option>
                                                <option value="DELIVERED">Delivered</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2.5 rounded-lg bg-earth-800/50 text-earth-400 hover:text-white transition-all border border-earth-700/50">
                                                    <ExternalLink size={14} />
                                                </button>
                                                <button className="p-2.5 rounded-lg bg-earth-800/50 text-earth-400 hover:text-white transition-all border border-earth-700/50">
                                                    <MoreVertical size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
