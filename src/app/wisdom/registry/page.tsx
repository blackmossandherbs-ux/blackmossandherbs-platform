/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - The Nutritional Registry (Alkaline List)
 */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, XCircle, Search, Apple, Coffee, Waves, Soup, Info } from 'lucide-react';

const foodCategories = [
    {
        name: 'Vegetables',
        icon: Leaf,
        items: [
            { name: 'Amaranth', status: 'Approved', note: 'Rich in fiber and protein.' },
            { name: 'Bell Peppers', status: 'Approved', note: 'Preferably baby bells.' },
            { name: 'Cucumber', status: 'Approved', note: 'Excellent for intracellular hydration.' },
            { name: 'Kale', status: 'Approved' },
            { name: 'Mushrooms', status: 'Approved', note: 'Except Shiitake.' },
            { name: 'Potatoes', status: 'Avoid', note: 'High starch, acidic residue.' },
            { name: 'Carrots', status: 'Avoid', note: 'High sugar, hybrid nature.' },
        ]
    },
    {
        name: 'Fruits',
        icon: Apple,
        items: [
            { name: 'Apples', status: 'Approved' },
            { name: 'Bananas', status: 'Approved', note: 'The smallest ones (burro).' },
            { name: 'Berries', status: 'Approved', note: 'No cranberries.' },
            { name: 'Dates', status: 'Approved' },
            { name: 'Grapes', status: 'Approved', note: 'Seeded only.' },
            { name: 'Mangoes', status: 'Approved' },
            { name: 'Melons', status: 'Approved', note: 'Seeded only.' },
        ]
    },
    {
        name: 'Grains & Nuts',
        icon: Soup,
        items: [
            { name: 'Amaranth Grain', status: 'Approved' },
            { name: 'Quinoa', status: 'Approved' },
            { name: 'Wild Rice', status: 'Approved' },
            { name: 'Walnuts', status: 'Approved' },
            { name: 'Brazil Nuts', status: 'Approved' },
            { name: 'Wheat', status: 'Avoid', note: 'Gluten, mucous forming.' },
            { name: 'Corn', status: 'Avoid', note: 'GMO risk, acidic.' },
        ]
    },
    {
        name: 'Beverages',
        icon: Coffee,
        items: [
            { name: 'Distilled Water', status: 'Approved' },
            { name: 'Natural Spring Water', status: 'Approved', note: 'Optimal source.' },
            { name: 'Soft Drinks', status: 'Avoid', note: 'High acidity, refined sugar.' },
            { name: 'Coffee', status: 'Avoid', note: 'Nervous system stimulant.' },
        ]
    }
];

export default function NutritionalRegistry() {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredCategories = foodCategories.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) &&
            (activeFilter === 'All' || item.status === activeFilter)
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <div className="py-20 bg-earth-950 min-h-screen relative overflow-hidden">
            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto mb-20 text-center">
                    <div className="inline-flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                        <Waves size={14} />
                        Biometric Compatibility
                    </div>
                    <h1 className="text-6xl font-serif font-bold text-white mb-6">The Nutritional Registry</h1>
                    <p className="text-earth-400 text-xl font-medium max-w-2xl mx-auto">A clinical directory of organic compounds designed to maintain the body's alkaline environment.</p>
                </div>

                {/* Controls */}
                <div className="max-w-4xl mx-auto mb-16 space-y-8">
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-earth-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search for a food..."
                            className="w-full h-20 bg-earth-900/50 border border-earth-800 rounded-3xl pl-16 pr-8 text-white text-xl focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {['All', 'Approved', 'Avoid'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeFilter === filter
                                        ? (filter === 'Avoid' ? 'bg-red-900/40 text-red-400 border border-red-500/50' : 'bg-primary-900/40 text-primary-400 border border-primary-500/50')
                                        : 'bg-earth-900/30 text-earth-500 border border-earth-800 hover:text-white'
                                    }`}
                            >
                                {filter === 'Approved' ? 'High Affinity' : filter === 'Avoid' ? 'Low Affinity' : 'Full Spectrum'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Registry Grid */}
                <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
                    {filteredCategories.map((category, idx) => (
                        <div key={idx} className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-earth-800 pb-4">
                                <category.icon className="text-secondary-400" size={24} />
                                <h2 className="text-2xl font-serif font-bold text-white">{category.name}</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.items.map((item, iidx) => (
                                    <div key={iidx} className={`p-6 rounded-2xl border ${item.status === 'Approved'
                                            ? 'bg-earth-900/20 border-earth-800 hover:border-primary-500/30'
                                            : 'bg-red-950/5 border-red-900/20 opacity-60'
                                        } transition-all group`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-bold text-white text-lg">{item.name}</span>
                                            {item.status === 'Approved' ? (
                                                <Leaf size={16} className="text-primary-500" />
                                            ) : (
                                                <XCircle size={16} className="text-red-500" />
                                            )}
                                        </div>
                                        {item.note && (
                                            <div className="flex gap-2 items-start mt-2">
                                                <Info size={12} className="text-earth-600 mt-1 shrink-0" />
                                                <p className="text-[11px] text-earth-500 font-medium italic">{item.note}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-32 p-12 card border border-primary-500/20 bg-primary-950/10 rounded-[3rem] text-center max-w-3xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">About the Alkaline Approach</h2>
                    <p className="text-earth-400 leading-relaxed mb-8">
                        The alkaline eating approach emphasises whole, plant-based, naturally non-hybrid foods. It&apos;s a dietary framework many people follow as part of a balanced lifestyle — not a medical treatment.
                    </p>
                    <Link href="/blog" className="text-primary-400 font-black text-xs uppercase tracking-widest hover:text-white transition-colors">
                        Read More on the Blog
                    </Link>
                </div>
            </div>
        </div>
    );
}
