'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [agreed, setAgreed] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        if (!agreed) {
            setError('Please accept the Terms of Service and Privacy Policy to continue.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, acceptedTerms: agreed }),
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Registration failed. Please try again.')
                return
            }

            // Auto sign in after registration
            const signInResult = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (signInResult?.ok) {
                router.push('/dashboard')
            } else {
                router.push('/login?registered=1')
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
                    <h1 className="font-serif text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-earth-400">Join thousands supporting their wellness with nature.</p>
                </div>

                <div className="border border-earth-800 bg-earth-900/80 backdrop-blur-xl rounded-2xl p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/40 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-earth-300 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500 w-4 h-4" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-earth-800 border border-earth-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-earth-600 focus:outline-none focus:border-primary-500 transition-colors"
                                    placeholder="Your name"
                                    required
                                    autoComplete="name"
                                />
                            </div>
                        </div>

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

                        <div>
                            <label className="block text-sm font-medium text-earth-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-500 w-4 h-4" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-earth-800 border border-earth-700 rounded-xl py-3 pl-11 pr-11 text-white placeholder-earth-600 focus:outline-none focus:border-primary-500 transition-colors"
                                    placeholder="Min. 8 characters"
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-earth-500 hover:text-earth-300"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-earth-600 mt-1.5">At least 8 characters</p>
                        </div>

                        <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded accent-primary-500 shrink-0"
                            />
                            <span className="text-xs text-earth-500 leading-relaxed">
                                I agree to the{' '}
                                <Link href="/legal/terms" className="text-primary-400 hover:underline">Terms of Service</Link>
                                {' '}and{' '}
                                <Link href="/legal/privacy" className="text-primary-400 hover:underline">Privacy Policy</Link>.
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-earth-500 text-sm mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary-400 hover:text-primary-300 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
