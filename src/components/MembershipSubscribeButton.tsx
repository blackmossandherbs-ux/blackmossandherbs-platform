'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
    planId: string
    label?: string
}

export default function MembershipSubscribeButton({ planId, label = 'Join The Circle' }: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubscribe = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/checkout/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId }),
            })
            const data = await res.json()
            if (res.status === 401) {
                router.push('/login?callbackUrl=/membership')
                return
            }
            if (!res.ok || !data.url) {
                setError(data.error || 'Could not start checkout.')
                setLoading(false)
                return
            }
            window.location.href = data.url
        } catch {
            setError('Something went wrong. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div>
            <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-4 bg-secondary-500 hover:bg-secondary-400 disabled:opacity-60 text-stone-950 font-black uppercase tracking-widest rounded-xl transition-all text-sm"
            >
                {loading ? 'Redirecting...' : label}
            </button>
            {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
        </div>
    )
}
