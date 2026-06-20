'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'

interface Props {
    title: string
    slug: string
}

export default function ShareButton({ title, slug }: Props) {
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        const url = `https://blackmossandherbs.com/shop/${slug}`
        if (navigator.share) {
            try {
                await navigator.share({ title, url })
            } catch { /* user cancelled */ }
        } else {
            try {
                await navigator.clipboard.writeText(url)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            } catch { /* ignore */ }
        }
    }

    return (
        <div className="relative flex-1">
            <button
                onClick={handleShare}
                aria-label="Share product"
                className="w-full h-20 rounded-2xl border border-earth-800 hover:border-earth-600 flex items-center justify-center transition-all"
            >
                {copied
                    ? <Check className="w-6 h-6 text-emerald-400" />
                    : <Share2 className="w-6 h-6 text-earth-400" />
                }
            </button>
            {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-earth-800 text-white px-3 py-1 rounded-full whitespace-nowrap pointer-events-none">
                    Link copied!
                </span>
            )}
        </div>
    )
}
