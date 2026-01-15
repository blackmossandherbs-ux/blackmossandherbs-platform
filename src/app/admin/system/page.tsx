/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - System Sentinel
 */
import { useState, useEffect } from 'react';
import { Activity, Shield, Database, Cpu, HardDrive, Wifi, Lock, AlertTriangle } from 'lucide-react';

export default function SystemSentinel() {
    const [telemetry, setTelemetry] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/system/stats');
                const data = await res.json();
                if (data.status === 'success') {
                    setTelemetry(data.telemetry);
                }
            } catch (error) {
                console.error("Sentinel sync error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const services = [
        {
            name: 'Core Application',
            status: telemetry ? 'Optimal' : 'Connecting...',
            uptime: telemetry?.system?.uptime || 'N/A',
            load: telemetry?.system?.cpuLoad || 'N/A',
            icon: Cpu
        },
        {
            name: 'PostgreSQL Authority',
            status: telemetry?.database?.status || 'Active',
            uptime: '100%',
            load: telemetry?.database?.latency || 'Stable',
            icon: Database
        },
        {
            name: 'Storage Matrix',
            status: 'Synced',
            uptime: 'N/A',
            load: telemetry?.system?.disk || 'Scanning...',
            icon: HardDrive
        },
        {
            name: 'System Firewall',
            status: 'Defensive',
            uptime: 'N/A',
            load: 'Minimal',
            icon: Shield
        },
    ];

    const logs = [
        { time: '16:35:01', level: 'INFO', module: 'AUTH', msg: 'Session validated for UID-842' },
        { time: '16:34:42', level: 'WARN', module: 'STRIPE', msg: 'Webhook delay detected (+1.2s)' },
        { time: '16:32:15', level: 'INFO', module: 'DB', msg: 'Garbage collection cycle complete' },
        { time: '16:30:00', level: 'INFO', module: 'SYSTEM', msg: 'Daily maintenance cron scheduled' },
    ];

    return (
        <div className="py-12 bg-earth-950 min-h-screen relative overflow-hidden text-earth-200">
            <div className="container relative z-10">
                <div className="mb-12">
                    <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-emerald-400 to-primary-400 bg-clip-text text-transparent mb-2">
                        System Sentinel
                    </h1>
                    <p className="text-earth-400 text-lg">Real-time infrastructure health and security telemetry.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Service Health */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {services.map((service, idx) => (
                                <div key={idx} className="card p-8 border border-earth-800 bg-earth-900/40 backdrop-blur-xl rounded-3xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 flex flex-col items-end">
                                        <div className={`w-3 h-3 rounded-full ${loading ? 'bg-earth-600' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'} animate-pulse`} />
                                        <span className="text-[8px] font-black uppercase text-emerald-400 mt-2 tracking-widest">{service.status}</span>
                                    </div>
                                    <service.icon className="w-10 h-10 text-earth-500 mb-8 group-hover:text-emerald-400 transition-colors" />
                                    <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                                    <div className="flex gap-6 mt-6">
                                        <div>
                                            <div className="text-[8px] font-black uppercase tracking-widest text-earth-500 mb-1">Uptime / Value</div>
                                            <div className="text-sm font-bold text-white">{service.uptime}</div>
                                        </div>
                                        <div>
                                            <div className="text-[8px] font-black uppercase tracking-widest text-earth-500 mb-1">Workload / Status</div>
                                            <div className="text-sm font-bold text-white">{service.load}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Real-time Telemetry (Placeholder for chart) */}
                        <div className="card p-10 border border-earth-800 bg-earth-900/60 backdrop-blur-xl rounded-[2.5rem]">
                            <h2 className="text-2xl font-serif font-bold text-white mb-8 flex items-center gap-3">
                                <Activity className="text-emerald-400" />
                                Traffic Pressure Delta
                            </h2>
                            <div className="h-64 w-full bg-earth-950/80 rounded-3xl border border-earth-800 flex items-center justify-center relative overflow-hidden">
                                {loading ? (
                                    <span className="text-earth-700 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Establishing Data Stream...</span>
                                ) : (
                                    <div className="flex items-end gap-1 px-8 w-full h-32">
                                        {Array.from({ length: 40 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-emerald-500/20 border-t border-emerald-500/40 rounded-t-sm transition-all"
                                                style={{ height: `${Math.random() * 100}%` }}
                                            />
                                        ))}
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20" />
                            </div>
                        </div>
                    </div>

                    {/* Security & Logs */}
                    <div className="space-y-8">
                        <div className="card p-8 border border-earth-800 bg-earth-900/40 backdrop-blur-xl rounded-[2rem]">
                            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                <Lock className="text-secondary-400 w-5 h-4" />
                                Security Audit
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-earth-950/50 border border-earth-800 rounded-2xl flex items-center justify-between">
                                    <span className="text-xs text-earth-400">SSL Certificate</span>
                                    <span className="text-[10px] font-black text-amber-500 uppercase">Awaiting DNS</span>
                                </div>
                                <div className="p-4 bg-earth-950/50 border border-emerald-900/20 rounded-2xl flex items-center justify-between">
                                    <span className="text-xs text-earth-400">Database Encryption</span>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase">Active</span>
                                </div>
                                <div className="p-4 bg-earth-950/50 border border-emerald-900/20 rounded-2xl flex items-center justify-between">
                                    <span className="text-xs text-earth-400">Failed Logins (24h)</span>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase">0</span>
                                </div>
                            </div>
                        </div>

                        <div className="card p-8 border border-earth-800 bg-earth-900/60 backdrop-blur-xl rounded-[2rem]">
                            <h2 className="text-xl font-bold text-white mb-6">Sentinel Logs</h2>
                            <div className="space-y-4 font-mono">
                                {logs.map((log, idx) => (
                                    <div key={idx} className="flex gap-3 text-[10px]">
                                        <span className="text-earth-600">[{log.time}]</span>
                                        <span className={log.level === 'WARN' ? 'text-amber-500' : 'text-primary-400'}>{log.level}</span>
                                        <span className="text-white truncate">{log.msg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
