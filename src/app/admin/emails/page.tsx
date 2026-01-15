/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Email Archive
 */
"use client";

import { Mail, Send, Eye, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function EmailArchive() {
    const historicalEmails = [
        { id: 'EML-102', recipient: 'marcus@example.com', subject: 'Your Biological Gold is Dispatched', status: 'Delivered', time: '10 mins ago', type: 'Transactional' },
        { id: 'EML-101', recipient: 'sarah.j@example.com', subject: 'Welcome to the Alchemist Circle', status: 'Sent', time: '2 hours ago', type: 'Onboarding' },
        { id: 'EML-100', recipient: 'd.thorne@example.com', subject: 'Consultation Scheduled: Phase 1', status: 'Delayed', time: '5 hours ago', type: 'Booking' },
        { id: 'EML-099', recipient: 'elena@example.com', subject: 'Reset Your Authority Credentials', status: 'Failed', time: '1 day ago', type: 'Security' },
    ];

    return (
        <div className="py-12 bg-earth-950 min-h-screen relative overflow-hidden text-earth-200 uppercase font-bold text-xs">
            <div className="container relative z-10">
                <div className="mb-12">
                    <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2 normal-case">
                        Email Archive
                    </h1>
                    <p className="text-earth-400 text-lg normal-case font-medium">Audit the transactional communication stream.</p>
                </div>

                {/* Stream Controls */}
                <div className="flex gap-4 mb-8">
                    <button className="h-12 px-6 bg-earth-900/50 border border-blue-500/30 rounded-xl text-blue-400 flex items-center gap-2 hover:bg-blue-900/20 transition-all">
                        <RefreshCw size={14} className="animate-spin-slow" />
                        Live Sync: Active
                    </button>
                    <button className="h-12 px-6 bg-earth-900/50 border border-earth-800 rounded-xl text-earth-400 flex items-center gap-2 hover:text-white transition-all">
                        <Send size={14} />
                        Test Transmission
                    </button>
                </div>

                {/* Email List */}
                <div className="space-y-4">
                    {historicalEmails.map((email) => (
                        <div key={email.id} className="card p-6 border border-earth-800 bg-earth-900/40 backdrop-blur-md rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-500/40 transition-all cursor-pointer group">
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${email.status === 'Delivered' ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' :
                                        email.status === 'Failed' ? 'bg-red-900/20 border-red-500/30 text-red-400' :
                                            'bg-blue-900/20 border-blue-500/30 text-blue-400'
                                    }`}>
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-earth-500 tracking-[0.2em] mb-1">{email.id} • {email.type}</div>
                                    <div className="text-white text-sm normal-case group-hover:text-blue-400 transition-colors">{email.subject}</div>
                                    <div className="text-earth-400 text-[10px] mt-1 tracking-widest">{email.recipient}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-10">
                                <div className="text-right">
                                    <div className="flex items-center gap-2 justify-end mb-1">
                                        {email.status === 'Delivered' && <CheckCircle size={12} className="text-emerald-500" />}
                                        {email.status === 'Failed' && <AlertCircle size={12} className="text-red-500" />}
                                        {email.status === 'Delayed' && <Clock size={12} className="text-amber-500" />}
                                        <span className={
                                            email.status === 'Delivered' ? 'text-emerald-400' :
                                                email.status === 'Failed' ? 'text-red-400' :
                                                    email.status === 'Delayed' ? 'text-amber-400' :
                                                        'text-blue-400'
                                        }>{email.status}</span>
                                    </div>
                                    <div className="text-earth-600 text-[8px] tracking-widest">{email.time}</div>
                                </div>
                                <button className="p-3 rounded-lg bg-earth-950/80 border border-earth-800 text-earth-500 hover:text-white transition-all">
                                    <Eye size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-8 border border-earth-800 bg-earth-900/20 rounded-[2rem] text-center">
                    <p className="text-earth-500 text-[10px] tracking-[0.3em]">Encrypted Log Partition: 0x842-TRANS-ARCHIVE</p>
                </div>
            </div>
        </div>
    );
}
