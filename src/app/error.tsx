"use client";

import { useEffect } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[GLOBAL_SYSTEM_FAILURE]:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-earth-950 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/patterns/sea-moss-pattern.svg')] bg-repeat opacity-5" />
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-900/10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary-900/10 blur-[120px] rounded-full" />

            <div className="max-w-xl w-full relative z-10">
                <div className="card p-12 border border-earth-800 bg-earth-900/40 backdrop-blur-2xl rounded-[3rem] text-center shadow-2xl">
                    <div className="w-24 h-24 bg-red-900/20 border border-red-800/30 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg shadow-red-900/10">
                        <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
                    </div>

                    <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-red-400 to-primary-400 bg-clip-text text-transparent mb-4">
                        System Interruption
                    </h1>

                    <p className="text-earth-400 text-lg mb-10 font-medium">
                        The Council has detected an architectural anomaly. Automated recovery protocols are initiated.
                    </p>

                    <div className="bg-earth-950/50 border border-earth-800 p-6 rounded-2xl mb-10 text-left overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                            <span className="text-[10px] font-black text-earth-500 uppercase tracking-widest">Error Analysis</span>
                        </div>
                        <code className="text-xs text-red-400/80 font-mono break-all line-clamp-2">
                            {error.message || 'HECTIC_UNSPECIFIED_EXCEPTION'}
                        </code>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={reset}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/20">
                            <RefreshCw size={18} />
                            Retry Sync
                        </button>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-earth-800 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-earth-700 transition-all border border-earth-700">
                            <Home size={18} />
                            Exit Hub
                        </Link>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] font-black text-earth-600 uppercase tracking-[0.4em]">
                    HECTIC Architectural Security • Fault-Tolerant System
                </div>
            </div>
        </div>
    );
}
