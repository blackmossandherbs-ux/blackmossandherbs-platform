'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token') || ''

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    if (!token) {
        return (
            <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h2>
                <p className="text-earth-400 mb-6">This password reset link is missing or invalid.</p>
                <Link href="/forgot-password" className="text-secondary-400 hover:text-secondary-300 font-semibold">
                    Request a new link →
                </Link>
            </div>
        )
    }

    if (success) {
        return (
            <div className="text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Password Updated</h2>
                <p className="text-earth-400 mb-6">Your password has been reset successfully.</p>
                <Link href="/login" className="inline-block px-8 py-3 bg-secondary-500 hover:bg-secondary-400 text-stone-950 font-bold rounded-xl transition-colors">
                    Sign In
                </Link>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }
        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Something went wrong. Please try again.')
            } else {
                setSuccess(true)
            }
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-earth-300 mb-2">New Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        required
                        className="w-full bg-earth-900 border border-earth-700 rounded-xl px-4 py-3 text-white pr-12 focus:outline-none focus:border-secondary-500 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-500 hover:text-earth-300"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-earth-300 mb-2">Confirm Password</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    className="w-full bg-earth-900 border border-earth-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition-colors"
                />
            </div>

            {error && (
                <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-800 rounded-xl text-red-300 text-sm">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-secondary-500 hover:bg-secondary-400 disabled:opacity-50 text-stone-950 font-bold rounded-xl transition-colors"
            >
                {loading ? 'Updating...' : 'Set New Password'}
            </button>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-earth-950 flex items-center justify-center py-24 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-earth-400">Choose a strong new password for your account.</p>
                </div>
                <div className="bg-earth-900 border border-earth-800 rounded-2xl p-8">
                    <Suspense fallback={<div className="text-earth-400 text-center py-8">Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
                <p className="text-center text-earth-500 text-sm mt-6">
                    Remember your password?{' '}
                    <Link href="/login" className="text-secondary-400 hover:text-secondary-300 font-semibold">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
