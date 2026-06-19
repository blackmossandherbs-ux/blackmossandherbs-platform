'use client'

import { useState } from 'react'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setSent(true)
            } else {
                const data = await res.json()
                setError(data.error || 'Something went wrong.')
            }
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-earth-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <span className="font-serif text-2xl font-bold text-white">Black Moss &amp; Herbs</span>
                    </Link>
                    <h1 className="font-serif text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                    <p className="text-earth-400">Enter your email and we&apos;ll send you a reset link.</p>
                </div>

                <div className="border border-earth-800 bg-earth-900/80 backdrop-blur-xl rounded-2xl p-8">
                    {sent ? (
                        <div className="text-center py-4">
                            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
                            <p className="text-earth-400 text-sm leading-relaxed mb-6">
                                If an account exists for <strong className="text-white">{email}</strong>, you&apos;ll receive a password reset link within a few minutes.
                            </p>
                            <Link href="/login" className="text-primary-400 hover:text-primary-300 font-semibold text-sm">
                                ← Back to sign in
                            </Link>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/40 rounded-xl text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-earth-300 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500 w-4 h-4" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full bg-earth-800 border border-earth-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-earth-600 focus:outline-none focus:border-primary-500 transition-colors"
                                            placeholder="your@email.com"
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send Reset Link'}
                                </button>
                            </form>
                            <p className="text-center text-earth-500 text-sm mt-6">
                                <Link href="/login" className="text-primary-400 hover:text-primary-300">
                                    ← Back to sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
