'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

/**
 * A tasteful "Add to Home Screen" banner. On Android/Chrome it uses the native
 * beforeinstallprompt event; it stays hidden inside the installed app and once
 * dismissed. (iOS Safari has no install event — that's handled by the store app
 * and the Add-to-Home-Screen share action.)
 */
export default function InstallPrompt() {
    const [deferred, setDeferred] = useState<any>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Already installed / running standalone → never show.
        const standalone =
            window.matchMedia?.('(display-mode: standalone)').matches ||
            (navigator as any).standalone === true
        if (standalone) return
        if (localStorage.getItem('bmh-install-dismissed') === '1') return

        const onPrompt = (e: Event) => {
            e.preventDefault()
            setDeferred(e)
            setVisible(true)
        }
        window.addEventListener('beforeinstallprompt', onPrompt)
        return () => window.removeEventListener('beforeinstallprompt', onPrompt)
    }, [])

    const install = async () => {
        if (!deferred) return
        deferred.prompt()
        try { await deferred.userChoice } catch { /* ignore */ }
        setDeferred(null)
        setVisible(false)
    }

    const dismiss = () => {
        localStorage.setItem('bmh-install-dismissed', '1')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div className="fixed inset-x-3 bottom-20 md:bottom-4 z-[60] md:left-auto md:right-4 md:w-80 animate-in slide-in-from-bottom-4">
            <div className="bg-earth-900 border border-earth-700 rounded-2xl shadow-2xl p-4 flex items-center gap-3">
                <img src="/icons/icon-192.png" alt="" className="w-11 h-11 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm leading-tight">Install Black Moss &amp; Herbs</p>
                    <p className="text-earth-400 text-xs">Add to your home screen for faster access.</p>
                </div>
                <button
                    onClick={install}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-secondary-500 hover:bg-secondary-400 text-stone-950 text-xs font-bold rounded-lg transition-colors"
                >
                    <Download className="w-3.5 h-3.5" /> Install
                </button>
                <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 text-earth-500 hover:text-earth-300 p-1">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
