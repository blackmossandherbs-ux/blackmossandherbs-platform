/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - The Herbal Matrix
 */
"use client";

import { useState } from 'react';
import { Search, Filter, FlaskConical, Beaker, Zap, Activity, Info } from 'lucide-react';

const herbs = [
    { name: 'Sea Moss', alias: 'Chondrus crispus', minerals: '92 Minerals', ph: '9.0', origin: 'Irish/Caribbean', benefits: 'Thyroid, Digestion, Skin', affinity: 'Cellular' },
    { name: 'Bladderwrack', alias: 'Fucus vesiculosus', minerals: 'Iodine, Beta-carotene', ph: '8.5', origin: 'North Sea', benefits: 'Endocrine Support, Weight', affinity: 'Hormonal' },
    { name: 'Burdock Root', alias: 'Arctium', minerals: 'Iron, Inulin', ph: '7.5', origin: 'Europa/Asia', benefits: 'Blood Purifier, Lymph', affinity: 'Circulatory' },
    { name: 'Sarsaparilla', alias: 'Smilax', minerals: 'Iron, Magnesium', ph: '8.0', origin: 'Central America', benefits: 'Skin, Nervous System', affinity: 'Nervous' },
    { name: 'Elderberry', alias: 'Sambucus', minerals: 'Vitamin C, Zinc', ph: '7.0', origin: 'Global', benefits: 'Immune, Anti-viral', affinity: 'Immune' },
];

export default function HerbalMatrix() {
    const [search, setSearch] = useState('');

    const filteredHerbs = herbs.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.alias.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="py-20 bg-earth-950 min-h-screen relative overflow-hidden">
            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto mb-20 text-center">
                    <div className="inline-flex items-center gap-2 text-secondary-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                        <FlaskConical size={14} />
                        Molecular Herbology
                    </div>
                    <h1 className="text-6xl font-serif font-bold text-white mb-6">The Herbal Matrix</h1>
                    <p className="text-earth-400 text-xl font-medium max-w-2xl mx-auto">Access clinical data, mineral profiles, and biological affinities for the world's most powerful organic compounds.</p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-16 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-earth-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search for an herb, mineral, or affinity..."
                        className="w-full h-16 bg-earth-900/50 border border-earth-800 rounded-3xl pl-16 pr-8 text-white focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Matrix Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredHerbs.map((herb, idx) => (
                        <div key={idx} className="group card p-8 border border-earth-800 bg-earth-900/30 backdrop-blur-xl hover:border-secondary-500/30 transition-all duration-500 rounded-[2.5rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                                <Beaker size={80} className="text-secondary-400" />
                            </div>

                            <div className="mb-8">
                                <h3 className="text-3xl font-serif font-bold text-white mb-1 group-hover:text-secondary-400 transition-colors">{herb.name}</h3>
                                <p className="text-earth-500 text-sm font-mono italic">{herb.alias}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-earth-950/50 rounded-2xl border border-earth-800">
                                        <div className="text-[9px] font-black uppercase text-earth-600 tracking-widest mb-1 flex items-center gap-1">
                                            <Zap size={10} className="text-primary-400" />
                                            Minerals
                                        </div>
                                        <div className="text-xs font-bold text-white leading-tight">{herb.minerals}</div>
                                    </div>
                                    <div className="p-4 bg-earth-950/50 rounded-2xl border border-earth-800">
                                        <div className="text-[9px] font-black uppercase text-earth-600 tracking-widest mb-1 flex items-center gap-1">
                                            <Activity size={10} className="text-emerald-400" />
                                            Alkalinity
                                        </div>
                                        <div className="text-xs font-bold text-emerald-400">{herb.ph} pH</div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[9px] font-black uppercase text-earth-600 tracking-widest mb-2 flex items-center gap-1">
                                        <Info size={10} className="text-secondary-400" />
                                        Primary Affinities
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {herb.benefits.split(', ').map(b => (
                                            <span key={b} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white font-medium">{b}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-earth-800 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-earth-500">Affinity: {herb.affinity}</span>
                                <a href={`/shop?q=${encodeURIComponent(herb.name)}`} className="text-secondary-400 text-xs font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                                    Shop {herb.name}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-20 text-center text-xs text-earth-700 italic">For educational purposes only. Not intended to diagnose, treat, cure, or prevent any disease.</p>
            </div>
        </div>
    );
}
