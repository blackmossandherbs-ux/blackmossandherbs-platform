import Link from 'next/link'
import { WifiOff } from 'lucide-react'

// Static page (no data) so the service worker can cache it as the offline fallback.
export const metadata = {
    title: 'Offline',
    robots: { index: false },
}

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-earth-950 flex items-center justify-center px-6 text-center">
            <div className="max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-earth-900 border border-earth-800 flex items-center justify-center mx-auto mb-6">
                    <WifiOff className="w-7 h-7 text-earth-500" />
                </div>
                <h1 className="font-serif text-3xl font-bold text-white mb-3">You&apos;re offline</h1>
                <p className="text-earth-400 mb-8">
                    We can&apos;t reach the internet right now. Check your connection and try again — your cart and wishlist are saved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-8 py-3.5 bg-secondary-500 hover:bg-secondary-400 text-stone-950 font-bold rounded-xl transition-colors"
                >
                    Try Again
                </Link>
            </div>
        </div>
    )
}
