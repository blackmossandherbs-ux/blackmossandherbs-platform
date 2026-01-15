'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    User, Mail, Phone, Calendar, Heart, Shield, Activity,
    FileText, Save, Syringe, AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import Button from '@/components/Button';

export default function CustomerDetailPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Mock initial data (Replace with API fetch)
    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            setCustomer({
                id: params.id,
                name: 'Sarah Jenkins',
                email: 'sarah.j@example.com',
                joinDate: 'Dec 12, 2024',
                spent: 450.00,
                status: 'VIP Authority',
                bioProfile: {
                    healthGoals: ['Hormonal Balance', 'Gut Reset'],
                    dietType: 'Alkaline',
                    allergies: ['Shellfish'],
                    activeCondition: 'Hypothyroidism',
                    clinicalNotes: 'User reports low energy in mornings. Recommended Iron Fluorine protocol. Monitoring thyroid levels.'
                },
                orders: [
                    { id: 'ORD-001', date: 'Jan 10, 2025', items: 'Sea Moss Gold', total: 45.00, status: 'Shipped' },
                    { id: 'ORD-002', date: 'Dec 20, 2024', items: 'Bio-Ferro Capsules', total: 65.00, status: 'Delivered' }
                ]
            });
            setLoading(false);
        }, 1000);
    }, [params.id]);

    const handleSaveNotes = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSaving(false);
        alert('Clinical records updated.');
    };

    if (loading) return (
        <div className="min-h-screen bg-earth-950 flex items-center justify-center">
            <div className="text-secondary-500 animate-pulse font-bold tracking-widest uppercase">Accessing Secure Records...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-earth-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-900 to-earth-900 rounded-3xl border border-primary-700/50 flex items-center justify-center text-4xl font-bold text-primary-400">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-serif font-bold">{customer.name}</h1>
                                <span className="badge-secondary text-xs">{customer.status}</span>
                            </div>
                            <div className="flex items-center gap-6 text-earth-400 text-sm">
                                <span className="flex items-center gap-2"><Mail size={14} /> {customer.email}</span>
                                <span className="flex items-center gap-2"><Calendar size={14} /> Member since {customer.joinDate}</span>
                                <span className="flex items-center gap-2 text-secondary-400 font-bold"><Shield size={14} /> ID: {customer.id}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-red-900/50 text-red-400 hover:bg-red-900/20">Block Entity</Button>
                        <Button className="bg-secondary-600 hover:bg-secondary-500 text-black font-bold">Message</Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-earth-900/50 p-1 rounded-xl w-fit border border-earth-800">
                    {['overview', 'clinical', 'orders'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab
                                    ? 'bg-earth-800 text-white shadow-lg'
                                    : 'text-earth-500 hover:text-earth-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Clinical Records (The Core Feature) */}
                        {activeTab === 'clinical' && (
                            <div className="card p-8 bg-earth-900/40 border-earth-800 backdrop-blur-xl animate-in fade-in duration-300">
                                <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-3 text-secondary-400">
                                    <Activity /> Clinical Biological Profile
                                </h2>

                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="bg-earth-950/50 p-4 rounded-xl border border-earth-800">
                                        <label className="text-xs font-black text-earth-500 uppercase tracking-widest mb-2 block">Active Goals</label>
                                        <div className="flex flex-wrap gap-2">
                                            {customer.bioProfile.healthGoals.map((g: string) => (
                                                <span key={g} className="px-3 py-1 bg-primary-900/30 text-primary-400 rounded-lg text-xs font-bold border border-primary-800/50">{g}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-earth-950/50 p-4 rounded-xl border border-earth-800">
                                        <label className="text-xs font-black text-earth-500 uppercase tracking-widest mb-2 block">Dietary Matrix</label>
                                        <div className="text-white font-medium">{customer.bioProfile.dietType}</div>
                                    </div>
                                    <div className="bg-earth-950/50 p-4 rounded-xl border border-earth-800">
                                        <label className="text-xs font-black text-earth-500 uppercase tracking-widest mb-2 block">Known Sensitivities</label>
                                        <div className="flex flex-wrap gap-2">
                                            {customer.bioProfile.allergies.map((a: string) => (
                                                <span key={a} className="px-3 py-1 bg-red-900/20 text-red-400 rounded-lg text-xs font-bold border border-red-800/50 flex items-center gap-1">
                                                    <AlertCircle size={10} /> {a}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-earth-950/50 p-4 rounded-xl border border-earth-800">
                                        <label className="text-xs font-black text-earth-500 uppercase tracking-widest mb-2 block">Primary Condition</label>
                                        <div className="text-secondary-400 font-bold flex items-center gap-2">
                                            <Syringe size={14} /> {customer.bioProfile.activeCondition}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-white flex items-center justify-between">
                                        <span>Clinical Notes (Private Authority Record)</span>
                                        <span className="text-xs text-earth-500 font-normal">Last updated: Just now</span>
                                    </label>
                                    <textarea
                                        className="w-full h-64 bg-earth-950/80 border border-earth-700 rounded-xl p-6 text-earth-300 focus:outline-none focus:border-secondary-500 transition-all font-mono text-sm leading-relaxed"
                                        defaultValue={customer.bioProfile.clinicalNotes}
                                    />
                                    <div className="flex justify-end">
                                        <Button onClick={handleSaveNotes} disabled={saving} className="bg-primary-600 hover:bg-primary-500 text-white w-full md:w-auto">
                                            {saving ? 'Encrypting...' : <><Save size={16} className="mr-2" /> Save Clinical Record</>}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="card p-6 border-earth-800 bg-earth-900/40">
                                        <div className="text-xs text-earth-500 font-black uppercase tracking-widest mb-2">Total Spent</div>
                                        <div className="text-2xl font-bold text-white">£{customer.spent.toFixed(2)}</div>
                                    </div>
                                    <div className="card p-6 border-earth-800 bg-earth-900/40">
                                        <div className="text-xs text-earth-500 font-black uppercase tracking-widest mb-2">Orders</div>
                                        <div className="text-2xl font-bold text-white">12</div>
                                    </div>
                                    <div className="card p-6 border-earth-800 bg-earth-900/40">
                                        <div className="text-xs text-earth-500 font-black uppercase tracking-widest mb-2">Risk Score</div>
                                        <div className="text-2xl font-bold text-emerald-400">Low</div>
                                    </div>
                                </div>

                                <div className="card p-8 border-earth-800 bg-earth-900/40">
                                    <h3 className="font-bold text-white mb-4">Recent Activity Stream</h3>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-4 p-4 bg-earth-950/50 rounded-xl border border-earth-800">
                                                <div className="mt-1"><Clock size={16} className="text-earth-500" /></div>
                                                <div>
                                                    <p className="text-sm text-earth-300">User logged in from <span className="text-white font-bold">London, UK</span></p>
                                                    <p className="text-xs text-earth-600">2 hours ago</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="card p-0 border-earth-800 bg-earth-900/40 overflow-hidden animate-in fade-in duration-300">
                                <table className="w-full text-left">
                                    <thead className="bg-earth-950 text-xs uppercase font-black text-earth-500">
                                        <tr>
                                            <th className="px-6 py-4">Order ID</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Items</th>
                                            <th className="px-6 py-4">Total</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-earth-800">
                                        {customer.orders.map((o: any) => (
                                            <tr key={o.id} className="text-sm text-earth-300 hover:bg-earth-800/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-white">{o.id}</td>
                                                <td className="px-6 py-4">{o.date}</td>
                                                <td className="px-6 py-4">{o.items}</td>
                                                <td className="px-6 py-4">£{o.total.toFixed(2)}</td>
                                                <td className="px-6 py-4"><span className="badge-primary text-xs">{o.status}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <div className="card p-6 border-earth-800 bg-earth-900/40">
                            <h3 className="font-bold text-white mb-4 uppercase text-xs tracking-widest text-earth-500">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start text-left bg-earth-950 border-earth-700 hover:bg-earth-800"><Syringe size={16} className="mr-3 text-secondary-500" /> Assign Protocol</Button>
                                <Button variant="outline" className="w-full justify-start text-left bg-earth-950 border-earth-700 hover:bg-earth-800"><FileText size={16} className="mr-3 text-primary-500" /> Create Invoice</Button>
                                <Button variant="outline" className="w-full justify-start text-left bg-earth-950 border-earth-700 hover:bg-earth-800"><Mail size={16} className="mr-3 text-earth-500" /> Send Reset Link</Button>
                            </div>
                        </div>

                        <div className="card p-6 border-secondary-500/20 bg-secondary-900/10">
                            <h3 className="font-bold text-secondary-400 mb-2">Membership Status</h3>
                            <div className="text-3xl font-black text-white mb-1">VIP</div>
                            <p className="text-xs text-earth-400 mb-4">Expires: Dec 2025</p>
                            <div className="h-2 bg-earth-950 rounded-full overflow-hidden">
                                <div className="h-full w-[75%] bg-secondary-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
