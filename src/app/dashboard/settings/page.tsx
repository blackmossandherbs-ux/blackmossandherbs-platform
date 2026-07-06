'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, User, Lock, Check } from 'lucide-react'

export default function DashboardSettingsPage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [profileSaved, setProfileSaved] = useState(false)
    const [passwordSaved, setPasswordSaved] = useState(false)
    const [profileError, setProfileError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login')
        if (session?.user) {
            setName(session.user.name || '')
            setEmail(session.user.email || '')
        }
    }, [session, status, router])

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setProfileError('')
        setLoading(true)
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            })
            if (!res.ok) {
                const d = await res.json()
                throw new Error(d.error || 'Failed to update profile')
            }
            await update({ name })
            setProfileSaved(true)
            setTimeout(() => setProfileSaved(false), 3000)
        } catch (err: any) {
            setProfileError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError('')
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.')
            return
        }
        if (newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters.')
            return
        }
        setLoading(true)
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            })
            if (!res.ok) {
                const d = await res.json()
                throw new Error(d.error || 'Failed to update password')
            }
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setPasswordSaved(true)
            setTimeout(() => setPasswordSaved(false), 3000)
        } catch (err: any) {
            setPasswordError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="py-12 bg-earth-950 min-h-screen flex items-center justify-center">
                <div className="text-earth-500 uppercase tracking-widest text-sm animate-pulse">Loading…</div>
            </div>
        )
    }

    return (
        <div className="py-12 bg-earth-950 min-h-screen">
            <div className="container max-w-2xl">
                <div className="flex items-center gap-4 mb-10">
                    <Link href="/dashboard" className="text-earth-400 hover:text-amber-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-serif text-4xl font-bold text-white">Account Settings</h1>
                </div>

                {/* Profile */}
                <div className="card border border-earth-800 bg-earth-900/40 p-8 mb-6">
                    <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-3 mb-8">
                        <User className="text-secondary-400 w-6 h-6" /> Profile
                    </h2>
                    <form onSubmit={handleProfileSave} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-earth-500 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-14 bg-earth-950/50 border border-earth-700 rounded-xl px-5 text-white focus:border-secondary-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-earth-500 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full h-14 bg-earth-950/30 border border-earth-800 rounded-xl px-5 text-earth-500 cursor-not-allowed"
                            />
                            <p className="text-earth-600 text-xs mt-1.5 ml-1">Email cannot be changed. Contact support if needed.</p>
                        </div>
                        {profileError && <p className="text-red-400 text-sm">{profileError}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-secondary-600 hover:bg-secondary-500 text-earth-950 font-black uppercase tracking-widest text-sm rounded-xl transition-colors disabled:opacity-60"
                        >
                            {profileSaved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Profile</>}
                        </button>
                    </form>
                </div>

                {/* Password */}
                <div className="card border border-earth-800 bg-earth-900/40 p-8">
                    <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-3 mb-8">
                        <Lock className="text-primary-400 w-6 h-6" /> Change Password
                    </h2>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-earth-500 mb-2">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full h-14 bg-earth-950/50 border border-earth-700 rounded-xl px-5 text-white focus:border-primary-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-earth-500 mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full h-14 bg-earth-950/50 border border-earth-700 rounded-xl px-5 text-white focus:border-primary-500 focus:outline-none transition-colors"
                                required
                                minLength={8}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-earth-500 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-14 bg-earth-950/50 border border-earth-700 rounded-xl px-5 text-white focus:border-primary-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>
                        {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-colors disabled:opacity-60"
                        >
                            {passwordSaved ? <><Check className="w-4 h-4" /> Updated</> : <><Save className="w-4 h-4" /> Update Password</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
