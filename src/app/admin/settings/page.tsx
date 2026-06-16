'use client'

/**
 * Black Moss & Herbs Platform - Admin Site Settings
 * Lets the team edit homepage copy and the announcement bar without code changes.
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Save, ArrowLeft, Megaphone } from 'lucide-react'

interface Settings {
    announcementEnabled: boolean
    announcementText: string
    heroBadge: string
    heroTitleLine1: string
    heroTitleAccent: string
    heroQuote: string
    heroPrimaryCta: string
    heroSecondaryCta: string
    featuredHeading: string
    featuredAccent: string
    newsletterHeading: string
    newsletterSubtext: string
}

const FIELDS: { key: keyof Settings; label: string; type?: 'text' | 'textarea' | 'toggle'; group: string }[] = [
    { key: 'announcementEnabled', label: 'Show announcement bar', type: 'toggle', group: 'Announcement Bar' },
    { key: 'announcementText', label: 'Announcement text', type: 'text', group: 'Announcement Bar' },
    { key: 'heroBadge', label: 'Hero badge', type: 'text', group: 'Hero Section' },
    { key: 'heroTitleLine1', label: 'Hero title (line 1)', type: 'text', group: 'Hero Section' },
    { key: 'heroTitleAccent', label: 'Hero title (accent)', type: 'text', group: 'Hero Section' },
    { key: 'heroQuote', label: 'Hero quote', type: 'textarea', group: 'Hero Section' },
    { key: 'heroPrimaryCta', label: 'Primary button label', type: 'text', group: 'Hero Section' },
    { key: 'heroSecondaryCta', label: 'Secondary button label', type: 'text', group: 'Hero Section' },
    { key: 'featuredHeading', label: 'Featured heading', type: 'text', group: 'Featured Products' },
    { key: 'featuredAccent', label: 'Featured accent word', type: 'text', group: 'Featured Products' },
    { key: 'newsletterHeading', label: 'Newsletter heading', type: 'text', group: 'Newsletter' },
    { key: 'newsletterSubtext', label: 'Newsletter subtext', type: 'textarea', group: 'Newsletter' },
]

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Settings | null>(null)
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('/api/admin/settings')
            .then((r) => r.json())
            .then((d) => setSettings(d))
            .catch(() => setError('Could not load settings.'))
    }, [])

    const save = async () => {
        if (!settings) return
        setStatus('saving')
        setError('')
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            })
            if (!res.ok) {
                const d = await res.json()
                setError(d.error || 'Save failed.')
                setStatus('error')
                return
            }
            setStatus('saved')
            setTimeout(() => setStatus('idle'), 2000)
        } catch {
            setError('Network error.')
            setStatus('error')
        }
    }

    if (!settings) {
        return (
            <div className="min-h-screen bg-stone-950 text-stone-300 p-12">
                {error || 'Loading settings…'}
            </div>
        )
    }

    const groups = Array.from(new Set(FIELDS.map((f) => f.group)))

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 py-12">
            <div className="container max-w-3xl">
                <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-500 text-sm font-bold uppercase tracking-widest mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to dashboard
                </Link>

                <div className="flex items-center gap-3 mb-2">
                    <Megaphone className="w-6 h-6 text-amber-500" />
                    <h1 className="text-4xl font-serif font-bold text-white">Site Content</h1>
                </div>
                <p className="text-stone-400 mb-10">Edit the homepage and announcement bar. Changes appear on the live site immediately.</p>

                {groups.map((group) => (
                    <div key={group} className="mb-10 glass-premium p-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-6">{group}</h2>
                        <div className="space-y-6">
                            {FIELDS.filter((f) => f.group === group).map((field) => (
                                <div key={field.key}>
                                    {field.type === 'toggle' ? (
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(settings[field.key])}
                                                onChange={(e) => setSettings({ ...settings, [field.key]: e.target.checked })}
                                                className="h-5 w-5 rounded accent-amber-500"
                                            />
                                            <span className="text-sm font-bold text-stone-200">{field.label}</span>
                                        </label>
                                    ) : (
                                        <>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">{field.label}</label>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    value={String(settings[field.key])}
                                                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                                    rows={3}
                                                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={String(settings[field.key])}
                                                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none"
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {error && <p className="text-red-400 mb-4">{error}</p>}

                <button
                    onClick={save}
                    disabled={status === 'saving'}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-60"
                >
                    <Save className="w-5 h-5" />
                    {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save Changes'}
                </button>
            </div>
        </div>
    )
}
