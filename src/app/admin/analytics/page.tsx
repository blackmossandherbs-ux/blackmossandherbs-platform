/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Analytics Intelligence Dashboard
 */

'use client';

import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Eye,
  ShoppingBag,
  ArrowUpRight,
  Activity,
  Calendar,
  Filter,
} from 'lucide-react';
import Button from '@/components/Button';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30D');

  // Mock data for HECTIC intelligence
  const stats = [
    {
      label: 'Monthly Recurring Revenue',
      value: '£42,850',
      sub: '+12.5%',
      icon: DollarSign,
      color: 'text-primary-400',
    },
    {
      label: 'Community Growth',
      value: '8,420',
      sub: '+3.2%',
      icon: Users,
      color: 'text-secondary-400',
    },
    {
      label: 'Interaction Volume',
      value: '142.5K',
      sub: '+18.4%',
      icon: Activity,
      color: 'text-primary-400',
    },
    {
      label: 'Conversion Delta',
      value: '4.8%',
      sub: '-0.2%',
      icon: TrendingUp,
      color: 'text-secondary-400',
    },
  ];

  const topEntities = [
    { name: 'Alchemist Bio-Chemistry Blog', traffic: '12.4K', growth: '+25%', status: 'Dominant' },
    { name: 'Sea Moss Capsules (Gold)', traffic: '8.2K', growth: '+12%', status: 'Scaling' },
    { name: 'Private Protocol Consultation', traffic: '2.1K', growth: '+45%', status: 'Explosive' },
    { name: 'Clinical Lens Research Paper', traffic: '1.8K', growth: '-5%', status: 'Stable' },
  ];

  return (
    <div className="py-12 bg-earth-950 min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/sea-moss-pattern.svg')] bg-repeat opacity-5 pointer-events-none" />

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent mb-2">
              Industrial Analytics
            </h1>
            <p className="text-earth-400 text-lg">
              Financial Intelligence & Entity Performance Metrics
            </p>
          </div>
          <div className="flex bg-earth-900/50 p-1.5 rounded-2xl border border-earth-800 backdrop-blur-md">
            {['7D', '30D', '90D', '1Y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${period === p ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-earth-500 hover:text-earth-300'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="card p-8 border border-earth-800 bg-earth-900/40 backdrop-blur-xl group hover:border-primary-500/50 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-earth-950/50 border border-earth-800 rounded-2xl flex items-center justify-center group-hover:bg-primary-900/20 group-hover:border-primary-700/30 transition-all">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span
                  className={`text-xs font-black ${stat.sub.startsWith('+') ? 'text-secondary-400' : 'text-red-400'}`}
                >
                  {stat.sub}
                </span>
              </div>
              <h3 className="text-earth-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                {stat.label}
              </h3>
              <div className="text-3xl font-serif font-bold text-white tracking-tight">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Delta Chart (Placeholder for real chart library) */}
          <div className="lg:col-span-2 card border border-earth-800 bg-earth-900/60 backdrop-blur-xl p-10 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
                <TrendingUp className="text-secondary-400" />
                Capital Velocity
              </h2>
              <button className="text- earth-500 hover:text-white transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>

            <div className="h-80 w-full bg-earth-950/50 rounded-3xl border border-earth-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                {/* Simulated chart path */}
                <svg className="w-full h-full" preserveAspectRatio="none">
                  <path
                    d="M0 200 Q 100 150 200 180 T 400 100 T 600 120 T 800 50 L 800 400 L 0 400 Z"
                    fill="url(#gradient)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="text-earth-600 font-black text-xs uppercase tracking-[0.4em] relative z-10">
                Chart Synchronization Active
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-[10px] text-earth-500 font-black uppercase mb-1">
                  Average Order
                </div>
                <div className="text-xl font-bold text-white">£124.50</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-earth-500 font-black uppercase mb-1">
                  Lifetime Value
                </div>
                <div className="text-xl font-bold text-white">£842.00</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-earth-500 font-black uppercase mb-1">
                  Churn Percent
                </div>
                <div className="text-xl font-bold text-secondary-400">1.2%</div>
              </div>
            </div>
          </div>

          {/* Entity Performance */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card border border-earth-800 bg-earth-900/40 backdrop-blur-xl p-8 rounded-[2rem]">
              <h2 className="text-xl font-serif font-bold text-white mb-8">Entity Rankings</h2>
              <div className="space-y-6">
                {topEntities.map((entity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-earth-950/50 rounded-2xl border border-earth-800 hover:border-secondary-500/30 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-secondary-400 transition-colors">
                        {entity.name}
                      </div>
                      <div className="text-[10px] font-black text-earth-500 uppercase tracking-widest mt-1">
                        {entity.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{entity.traffic}</div>
                      <div
                        className={`text-[10px] font-black ${entity.growth.startsWith('+') ? 'text-secondary-400' : 'text-red-400'}`}
                      >
                        {entity.growth}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="w-full mt-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]"
                variant="outline"
              >
                Full Intelligence Report
              </Button>
            </div>

            <div className="card border border-earth-800 bg-primary-900/5 backdrop-blur-xl p-8 rounded-[2rem] relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full" />
              <h3 className="text-white font-bold mb-2">Predictive Growth</h3>
              <p className="text-earth-400 text-sm mb-6 leading-relaxed">
                Based on current velocity, MRR is projected to reach{' '}
                <span className="text-primary-400 font-bold">£50K</span> within the next 45 diurnal
                cycles.
              </p>
              <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-widest">
                <TrendingUp size={14} />
                High Accuracy Model
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
