
/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Login Portal
 */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials. Fact-check your login.");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong. Science is debugging...");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-earth-950 flex items-center justify-center p-6 bg-[url('/patterns/sea-moss-pattern.svg')] bg-repeat">
            <div className="card max-w-md w-full p-8 border border-earth-800 bg-earth-900/80 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-700/50">
                        <Lock className="text-secondary-400 w-8 h-8" />
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-earth-400">Black Moss & Herbs Management</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-earth-300 mb-2">Scientific/Auth Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-earth-800 border border-earth-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-secondary-500 transition-colors"
                                placeholder="name@blackmoss.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-earth-300 mb-2">Secure Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-earth-800 border border-earth-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-secondary-500 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-secondary-500 hover:bg-secondary-400 text-black font-bold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            "Verify Access"
                        )}
                    </button>

                    <p className="text-center text-earth-500 text-xs mt-6">
                        Authorized Personnel Only. Organic Access Control Active.
                    </p>
                </form>
            </div>
        </div>
    );
}
