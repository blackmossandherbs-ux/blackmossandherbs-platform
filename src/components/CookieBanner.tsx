'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) setVisible(true)
    }, [])

    const accept = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        setVisible(false)
    }

    const decline = () => {
        localStorage.setItem('cookie-consent', 'declined')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto bg-earth-900 border border-earth-700 rounded-2xl shadow-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                    <p className="text-sm text-earth-200 leading-relaxed">
                        We use cookies to improve your experience and analyse site usage. By clicking &ldquo;Accept&rdquo; you consent to our use of cookies in accordance with our{' '}
                        <Link href="/legal/cookies" className="text-primary-400 hover:text-primary-300 underline underline-offset-2">
                            Cookie Policy
                        </Link>
                        . You can decline non-essential cookies.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button
                        onClick={decline}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-earth-300 border border-earth-700 hover:border-earth-500 transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={accept}
                        className="px-5 py-2 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-500 text-white transition-colors"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    )
}
