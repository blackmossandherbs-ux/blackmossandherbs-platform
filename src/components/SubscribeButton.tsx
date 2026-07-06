'use client'

import { useState } from 'react'
import Button from './Button'

interface SubscribeButtonProps {
    plan: 'starter' | 'plus' | 'pro'
    popular?: boolean
}

export default function SubscribeButton({ plan, popular }: SubscribeButtonProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubscribe = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/checkout/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            })
            const data = await res.json()
            if (!res.ok || !data.url) {
                setError(data.error || 'Could not start checkout.')
                setLoading(false)
                return
            }
            window.location.href = data.url
        } catch {
            setError('Network error. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="mb-6">
            <Button
                variant={popular ? 'primary' : 'outline'}
                className="w-full"
                size="lg"
                onClick={handleSubscribe}
                disabled={loading}
            >
                {loading ? 'Starting…' : 'Get Started'}
            </Button>
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
        </div>
    )
}
