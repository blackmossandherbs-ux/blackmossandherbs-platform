'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react'
import { useCart } from '@/context/CartContext'

const NAV_ITEMS = [
    { label: 'Shop', href: '/shop' },
    { label: 'Subscriptions', href: '/subscriptions' },
    { label: 'Wisdom', href: '/wisdom' },
    { label: 'Videos', href: '/videos' },
    { label: 'Consultations', href: '/consultations' },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [query, setQuery] = useState('')
    const searchInputRef = useRef<HTMLInputElement>(null)
    const { count } = useCart()
    const router = useRouter()

    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50)
        }
    }, [searchOpen])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const q = query.trim()
        if (q) {
            router.push(`/shop?q=${encodeURIComponent(q)}`)
            setSearchOpen(false)
            setQuery('')
        }
    }

    return (
        <header className="sticky top-0 z-50 py-4">
            <nav className="container">
                <div className="organic-glass rounded-2xl px-6 lg:px-10 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-900 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/20 transition-all duration-500">
                            <span className="text-white font-bold text-2xl tracking-tighter">BM</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-xl font-bold text-stone-50 leading-none">Black Moss</span>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold">& Herbs</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-stone-300 hover:text-amber-500 transition-all duration-300 font-bold text-sm uppercase tracking-widest relative group"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            aria-label="Search products"
                            className="p-2 text-stone-400 hover:text-amber-500 transition-colors"
                        >
                            {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                        </button>
                        <Link href="/dashboard" aria-label="Account" className="p-2 text-stone-400 hover:text-amber-500 transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" className="relative group" aria-label={`Cart (${count} items)`}>
                            <div className="p-3 bg-white/5 rounded-full border border-white/5 group-hover:border-amber-500/50 transition-all duration-500">
                                <ShoppingCart className="w-5 h-5 text-stone-300 group-hover:text-amber-500" />
                            </div>
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-black text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                    {count}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle navigation menu"
                            className="md:hidden p-2 text-earth-200"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Search bar */}
                {searchOpen && (
                    <div className="mt-2 px-2">
                        <form onSubmit={handleSearch} className="organic-glass rounded-2xl px-6 py-4 flex items-center gap-3">
                            <Search className="w-5 h-5 text-earth-500 shrink-0" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Search products, herbs, sea moss…"
                                className="flex-1 bg-transparent text-white placeholder-earth-600 outline-none text-base"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-colors shrink-0"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                )}

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-2 py-4 bg-earth-950/95 backdrop-blur-xl border border-earth-800 rounded-2xl">
                        <div className="flex flex-col space-y-1 px-4">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-earth-200 hover:text-amber-500 hover:bg-earth-900/50 transition-colors font-medium uppercase tracking-widest text-sm px-3 py-3 rounded-xl"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link
                                href="/blog"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-earth-200 hover:text-amber-500 hover:bg-earth-900/50 transition-colors font-medium uppercase tracking-widest text-sm px-3 py-3 rounded-xl"
                            >
                                Blog
                            </Link>
                            <div className="pt-2 border-t border-earth-800 mt-2">
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 text-earth-300 hover:text-white px-3 py-3 text-sm font-medium rounded-xl hover:bg-earth-900/50 transition-colors"
                                >
                                    <User className="w-4 h-4" /> My Account
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}
