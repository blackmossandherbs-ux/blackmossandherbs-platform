'use client'

import { useState, FormEvent } from 'react'
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
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setMessage('')
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
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
            {message && (
                <p className={`text-xs mt-2 ${status === 'error' ? 'text-red-400' : 'text-primary-400'}`}>
                    {message}
                </p>
            )}
        </div>
    )
}
