'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

const STORAGE_KEY = 'bm-wishlist'

interface Props {
    slug: string
}

export default function WishlistButton({ slug }: Props) {
    const [saved, setSaved] = useState(false)
    const [flash, setFlash] = useState(false)

    useEffect(() => {
        try {
            const list: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
            setSaved(list.includes(slug))
        } catch { /* ignore */ }
    }, [slug])

    const toggle = () => {
        try {
            const list: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
            const next = saved ? list.filter(s => s !== slug) : [...list, slug]
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
            setSaved(!saved)
            setFlash(true)
            setTimeout(() => setFlash(false), 1500)
        } catch { /* ignore */ }
    }

    return (
        <div className="relative flex-1">
            <button
                onClick={toggle}
                aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                className="w-full h-20 rounded-2xl border border-earth-800 hover:border-earth-600 flex items-center justify-center transition-all"
            >
                <Heart
                    className={`w-6 h-6 transition-colors ${saved ? 'text-rose-500 fill-rose-500' : 'text-earth-400'}`}
                />
            </button>
            {flash && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-earth-800 text-white px-3 py-1 rounded-full whitespace-nowrap pointer-events-none">
                    {saved ? 'Saved!' : 'Removed'}
                </span>
            )}
        </div>
    )
}
