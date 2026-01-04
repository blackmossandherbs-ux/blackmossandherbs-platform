
/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Customer Management
 */
import { Metadata } from 'next'
import { Users, Search, Mail, Phone, Calendar, ArrowUpRight, MoreVertical } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Customer Management - Black Moss & Herbs',
    description: 'Manage your customer database and interaction history.',
}

export default function CustomersPage() {
    // Mock data for initial view
    const customers = [
        { id: '1', name: 'John Doe', email: 'john@example.com', orders: 5, spent: 450.00, lastActive: '2 hours ago', status: 'Active' },
        { id: '2', name: 'Jane Smith', email: 'jane@smith.org', orders: 12, spent: 1250.50, lastActive: '1 day ago', status: 'VIP' },
        { id: '3', name: 'Robert Williams', email: 'bobw@gmail.com', orders: 2, spent: 89.98, lastActive: '3 days ago', status: 'Active' },
        { id: '4', name: 'Alice Green', email: 'alice@nature.com', orders: 8, spent: 670.30, lastActive: 'Just now', status: 'Active' },
    ];

    return (
        <div className="py-12 bg-earth-950 min-h-screen relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/patterns/sea-moss-pattern.svg')] bg-repeat opacity-5 pointer-events-none" />

            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent mb-2">
                            Organic Community
                        </h1>
                        <p className="text-earth-400 text-lg">Verified Customer Database & interaction history</p>
                    </div>
                    <div className="flex bg-earth-900/50 p-1.5 rounded-2xl border border-earth-800 backdrop-blur-md">
                        <button className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary-900/20">All Members</button>
                        <button className="px-6 py-2.5 rounded-xl text-earth-500 font-bold text-xs uppercase tracking-widest hover:text-earth-300 transition-all">VIP Authority</button>
                        <button className="px-6 py-2.5 rounded-xl text-earth-500 font-bold text-xs uppercase tracking-widest hover:text-earth-300 transition-all">Trialists</button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="card p-6 border border-earth-800 bg-earth-900/40 backdrop-blur-xl mb-12 flex flex-col md:flex-row gap-4 items-center rounded-3xl">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-earth-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or biometric ID..."
                            className="w-full bg-earth-950/50 border border-earth-800 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-secondary-500 transition-all placeholder:text-earth-700"
                        />
                    </div>
                    <button className="w-full md:w-auto px-10 py-4 bg-secondary-500 text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-secondary-400 transition-all shadow-xl shadow-secondary-900/20">
                        Sanitize View
                    </button>
                </div>

                {/* Customers Table */}
                <div className="card border border-earth-800 bg-earth-900/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-earth-950/80 border-b border-earth-800">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]">Authentic Entity</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]">Rank</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]">Volume</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]">Capital Flow</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]">Last Sync</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-earth-800/50">
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-earth-800/20 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-earth-800 to-earth-900 border border-earth-700 rounded-2xl flex items-center justify-center text-primary-400 font-bold shadow-lg">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-secondary-400 transition-colors">{customer.name}</div>
                                                    <div className="text-xs text-earth-500 font-medium">{customer.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${customer.status === 'VIP'
                                                ? 'bg-secondary-900/30 text-secondary-400 border border-secondary-800/50'
                                                : 'bg-primary-900/30 text-primary-400 border border-primary-800/50'
                                                }`}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-white">{customer.orders} orders</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-secondary-400">£{customer.spent.toFixed(2)}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm text-earth-400 font-medium">{customer.lastActive}</div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-3 hover:bg-earth-800 rounded-xl transition-colors text-earth-500 hover:text-white border border-transparent hover:border-earth-700">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-10 flex items-center justify-between">
                    <p className="text-sm text-earth-500 font-medium tracking-wide">
                        Synchronized <span className="text-white font-bold">1-4</span> of <span className="text-secondary-400 font-bold">1,234</span> organic entities
                    </p>
                    <div className="flex gap-4">
                        <button className="px-6 py-2.5 bg-earth-900/50 border border-earth-800 rounded-xl text-earth-500 font-bold text-xs uppercase tracking-widest hover:bg-earth-800 transition-all disabled:opacity-20" disabled>Previous</button>
                        <button className="px-8 py-2.5 bg-earth-900 border border-earth-700 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-earth-800 transition-all">Next Pulse</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
