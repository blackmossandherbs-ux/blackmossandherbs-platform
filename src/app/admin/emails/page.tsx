/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Email Archive
 */
"use client";

import { useState, useEffect } from 'react';
import { Mail, RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type EmailLog = {
    id: string;
    to: string;
    subject: string;
    type: string;
    status: 'SENT' | 'FAILED';
    error: string | null;
    createdAt: string;
};

export default function EmailArchive() {
    const [emails, setEmails] = useState<EmailLog[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEmails = async () => {
        try {
            const res = await fetch('/api/admin/emails');
            const data = await res.json();
            if (Array.isArray(data)) setEmails(data);
        } catch (error) {
            console.error('[Email Archive] Failed to load emails:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    return (
        <div className="py-12 bg-earth-950 min-h-screen relative overflow-hidden text-earth-200 uppercase font-bold text-xs">
            <div className="container relative z-10">
                <div className="mb-12 flex items-start justify-between gap-6">
                    <div>
                        <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2 normal-case">
                            Email Archive
                        </h1>
                        <p className="text-earth-400 text-lg normal-case font-medium">Audit the transactional communication stream.</p>
                    </div>
                    <button
                        onClick={() => { setLoading(true); fetchEmails(); }}
                        className="h-12 px-6 bg-earth-900/50 border border-blue-500/30 rounded-xl text-blue-400 flex items-center gap-2 hover:bg-blue-900/20 transition-all shrink-0"
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24 text-earth-500">
                        <Loader2 size={24} className="animate-spin" />
                    </div>
                ) : emails.length === 0 ? (
                    <div className="p-12 border border-earth-800 bg-earth-900/20 rounded-[2rem] text-center">
                        <Mail size={32} className="mx-auto mb-4 text-earth-600" />
                        <p className="text-earth-400 normal-case font-medium">No emails have been sent yet.</p>
                        <p className="text-earth-600 text-[10px] tracking-widest mt-2">Transactional, booking, and newsletter emails will appear here as they're sent.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {emails.map((email) => (
                            <div key={email.id} className="card p-6 border border-earth-800 bg-earth-900/40 backdrop-blur-md rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-500/40 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${email.status === 'SENT' ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' : 'bg-red-900/20 border-red-500/30 text-red-400'
                                        }`}>
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-earth-500 tracking-[0.2em] mb-1">{email.type}</div>
                                        <div className="text-white text-sm normal-case">{email.subject}</div>
                                        <div className="text-earth-400 text-[10px] mt-1 tracking-widest">{email.to}</div>
                                        {email.error && (
                                            <div className="text-red-400 text-[10px] mt-1 normal-case">{email.error}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-10 shrink-0">
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 justify-end mb-1">
                                            {email.status === 'SENT' && <CheckCircle size={12} className="text-emerald-500" />}
                                            {email.status === 'FAILED' && <AlertCircle size={12} className="text-red-500" />}
                                            <span className={email.status === 'SENT' ? 'text-emerald-400' : 'text-red-400'}>
                                                {email.status === 'SENT' ? 'Delivered' : 'Failed'}
                                            </span>
                                        </div>
                                        <div className="text-earth-600 text-[8px] tracking-widest">
                                            {formatDistanceToNow(new Date(email.createdAt), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
