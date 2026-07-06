'use client'

import { useState, FormEvent } from 'react'
import Script from 'next/script'

declare global {
    interface Window {
        grecaptcha?: {
            ready: (cb: () => void) => void
            execute: (siteKey: string, options: { action: string }) => Promise<string>
        }
    }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

export default function ContactForm() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
    const [error, setError] = useState('')

    const getRecaptchaToken = async (): Promise<string | undefined> => {
        if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) return undefined
        return new Promise((resolve) => {
            window.grecaptcha!.ready(async () => {
                try {
                    const token = await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action: 'contact' })
                    resolve(token)
                } catch {
                    resolve(undefined)
                }
            })
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setError('')
        try {
            const recaptchaToken = await getRecaptchaToken()
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, recaptchaToken }),
            })
            const data = await res.json()
            if (!res.ok) {
                setStatus('error')
                setError(data.error || 'Could not send your message.')
                return
            }
            setStatus('done')
            setForm({ name: '', email: '', message: '' })
        } catch {
            setStatus('error')
            setError('Network error. Please try again.')
        }
    }

    if (status === 'done') {
        return (
            <div className="bg-earth-900/20 p-8 rounded-3xl border border-primary-700/40 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="text-5xl mb-4">🌿</div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Message Received</h3>
                <p className="text-earth-400">Our team will respond to your enquiry shortly.</p>
            </div>
        )
    }

    return (
        <>
            {RECAPTCHA_SITE_KEY && (
                <Script src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`} strategy="afterInteractive" />
            )}
            <form onSubmit={handleSubmit} className="space-y-6 bg-earth-900/20 p-8 rounded-3xl border border-earth-800">
            <div>
                <label className="block text-sm font-bold text-earth-400 mb-2">Name</label>
                <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-earth-950 border border-earth-800 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none"
                    placeholder="Your Name"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-earth-400 mb-2">Email</label>
                <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-earth-950 border border-earth-800 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none"
                    placeholder="your@email.com"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-earth-400 mb-2">Message</label>
                <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-earth-950 border border-earth-800 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none"
                    placeholder="How can we assist?"
                />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all disabled:opacity-60"
            >
                {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
            </form>
        </>
    )
}
