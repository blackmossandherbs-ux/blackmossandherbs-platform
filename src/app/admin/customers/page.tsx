"use client";

import { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Calendar, ArrowUpRight, MoreVertical, Loader2 } from 'lucide-react';

interface Customer {
    id: string;
    name: string;
    email: string;
    ordersCount: number;
    spent: number;
    loyaltyPoints: number;
    status: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [vipFilter, setVipFilter] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, [vipFilter]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/customers?vip=${vipFilter}`);
            const data = await res.json();
            setCustomers(data);
        } catch (error) {
            console.error('Entity matrix sync failure:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <button
                            onClick={() => setVipFilter(false)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${!vipFilter ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-earth-500 hover:text-earth-300'}`}
                        >
                            All Members
                        </button>
                        <button
                            onClick={() => setVipFilter(true)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${vipFilter ? 'bg-secondary-600 text-white shadow-lg shadow-secondary-900/20' : 'text-earth-500 hover:text-earth-300'}`}
                        >
                            VIP Authority
                        </button>
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Customers Table */}
                <div className="card border border-earth-800 bg-earth-900/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-earth-950/80 border-b border-earth-800">
                                <tr>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]">Authentic Entity</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]">Rank</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]">Frequency</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]">Capital Flow</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]">Botanical Credits</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-earth-500 uppercase tracking-[0.2em]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-earth-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="w-10 h-10 text-secondary-500 animate-spin" />
                                                <div className="text-earth-500 font-bold uppercase text-[10px] tracking-widest">Synchronizing Matrix...</div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
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
                                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${customer.status === 'VIP Authority'
                                                ? 'bg-secondary-900/30 text-secondary-400 border border-secondary-800/50'
                                                : 'bg-primary-900/30 text-primary-400 border border-primary-800/50'
                                                }`}>
                                                {customer.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-bold text-white">{customer.ordersCount} orders</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm font-black text-secondary-400">£{customer.spent.toFixed(2)}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-sm text-emerald-400 font-black">{customer.loyaltyPoints.toLocaleString()} Credits</div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-3 hover:bg-earth-800 rounded-xl transition-colors text-earth-500 hover:text-white border border-transparent hover:border-earth-700">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-earth-500 font-bold uppercase text-[10px] tracking-widest">
                                            No organic entities match your query.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                <div className="mt-10 flex items-center justify-between">
                    <p className="text-sm text-earth-500 font-medium tracking-wide">
                        Synchronized <span className="text-white font-bold">{filteredCustomers.length}</span> organic entities in view
                    </p>
                </div>
            </div>
        </div>
    )
}
