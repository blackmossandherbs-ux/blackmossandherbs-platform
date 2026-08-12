'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, Heart, ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const tabs = [
    { href: '/', label: 'Home', icon: Home, match: (p: string) => p === '/' },
    { href: '/shop', label: 'Shop', icon: ShoppingBag, match: (p: string) => p.startsWith('/shop') },
    { href: '/wishlist', label: 'Saved', icon: Heart, match: (p: string) => p.startsWith('/wishlist') },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, match: (p: string) => p.startsWith('/cart'), badge: true },
    { href: '/dashboard', label: 'Account', icon: User, match: (p: string) => p.startsWith('/dashboard') },
]

/**
 * Thumb-reachable bottom navigation — the app-standard nav pattern. Mobile only
 * (hidden from md up, where the header nav takes over). Sits above the home
 * indicator via safe-area padding.
 */
export default function MobileTabBar() {
    const pathname = usePathname() || '/'
    const { count } = useCart()

    // Hide inside admin — that area has its own layout.
    if (pathname.startsWith('/admin')) return null

    return (
        <nav
            className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-earth-950/95 backdrop-blur-xl border-t border-earth-800"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            aria-label="Primary"
        >
            <ul className="grid grid-cols-5">
                {tabs.map((tab) => {
                    const active = tab.match(pathname)
                    const Icon = tab.icon
                    return (
                        <li key={tab.href}>
                            <Link
                                href={tab.href}
                                aria-label={tab.label}
                                aria-current={active ? 'page' : undefined}
                                className={`relative flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                                    active ? 'text-amber-500' : 'text-earth-400 hover:text-earth-200'
                                }`}
                            >
                                <span className="relative">
                                    <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.4 : 2} />
                                    {tab.badge && count > 0 && (
                                        <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-amber-500 text-stone-950 text-[10px] font-black rounded-full flex items-center justify-center">
                                            {count > 9 ? '9+' : count}
                                        </span>
                                    )}
                                </span>
                                <span className="text-[10px] font-bold tracking-wide">{tab.label}</span>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
