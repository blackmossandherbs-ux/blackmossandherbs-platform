"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Loader2 } from "lucide-react";
import Link from "next/link";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

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
                setError("Incorrect email or password. Please try again.");
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-earth-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Logo / brand */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <span className="font-serif text-2xl font-bold text-white">Black Moss &amp; Herbs</span>
                    </Link>
                    <h1 className="font-serif text-3xl font-bold text-white mb-2">Sign In</h1>
                    <p className="text-earth-400">Access your account, orders and subscription.</p>
                </div>

                <div className="border border-earth-800 bg-earth-900/80 backdrop-blur-xl rounded-2xl p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-earth-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500 w-4 h-4" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-earth-800 border border-earth-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-earth-600 focus:outline-none focus:border-primary-500 transition-colors"
                                    placeholder="your@email.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-earth-300">Password</label>
                                <Link href="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500 w-4 h-4" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-earth-800 border border-earth-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-earth-600 focus:outline-none focus:border-primary-500 transition-colors"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-earth-500 text-sm mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                            Create one free
                        </Link>
                    </p>
                </div>

                <p className="text-center text-earth-600 text-xs mt-6">
                    Admin?{" "}
                    <Link href="/admin" className="text-earth-500 hover:text-earth-400 underline">
                        Go to admin panel
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
