'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'

interface NewsletterFormProps {
    layout?: 'row' | 'col'
    placeholder?: string
    buttonLabel?: string
    formClassName?: string
    inputClassName?: string
    buttonClassName?: string
    showMailIcon?: boolean
}

export default function NewsletterForm({
    layout = 'row',
    placeholder = 'Your email',
    buttonLabel = 'Subscribe',
    formClassName,
    inputClassName,
    buttonClassName,
    showMailIcon = false,
}: NewsletterFormProps) {
    const [email, setEmail] = useState('')
    const [consent, setConsent] = useState(false)
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!consent) {
            setStatus('error')
            setMessage('Please tick the box to confirm you consent to receiving emails.')
            return
        }
        setStatus('loading')
        setMessage('')
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, consent }),
            })
            const data = await res.json()
            if (!res.ok) {
                setStatus('error')
                setMessage(data.error || 'Something went wrong.')
                return
            }
            setStatus('done')
            setMessage('You are on the list. Welcome to the Circle.')
            setEmail('')
        } catch {
            setStatus('error')
            setMessage('Network error. Please try again.')
        }
    }

    const defaultForm = layout === 'col' ? 'flex flex-col space-y-2' : 'flex flex-col sm:flex-row gap-4'

    return (
        <div>
            <form onSubmit={handleSubmit} className={formClassName ?? defaultForm}>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    className={inputClassName ?? 'px-4 py-2 rounded-lg bg-earth-800 border border-earth-700 text-earth-100 placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-primary-500'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={buttonClassName ?? 'btn-primary disabled:opacity-60'}
                >
                    {showMailIcon && <Mail className="w-4 h-4 mr-2" />}
                    {status === 'loading' ? 'Sending…' : buttonLabel}
                </button>
            </form>
            <label className="flex items-start gap-2 mt-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-primary-500 shrink-0"
                />
                <span className="text-[11px] leading-relaxed text-earth-400">
                    I agree to receive marketing emails from Black Moss &amp; Herbs and accept the{' '}
                    <Link href="/legal/privacy" className="underline hover:text-earth-200">Privacy Policy</Link>. You can unsubscribe at any time.
                </span>
            </label>
            {message && (
                <p className={`text-xs mt-2 ${status === 'error' ? 'text-red-400' : 'text-primary-400'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}
