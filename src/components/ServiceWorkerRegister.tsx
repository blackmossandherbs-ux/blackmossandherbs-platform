'use client'

import { useEffect } from 'react'

/**
 * Registers the service worker that makes the site installable and gives it an
 * offline fallback. Registration is deferred until after load so it never blocks
 * first paint.
 */
export default function ServiceWorkerRegister() {
    useEffect(() => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
        const register = () => {
            navigator.serviceWorker.register('/sw.js').catch((err) => {
                console.error('[sw] registration failed:', err)
            })
        }
        if (document.readyState === 'complete') register()
        else window.addEventListener('load', register, { once: true })
    }, [])

    return null
}
