/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Global Navigation
 */
'use client'

import Link from 'next/link'
import { useState } from 'react'
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
    const { count } = useCart()

    return (
        <header className="sticky top-0 z-50 py-4">
            <nav className="container">
                <div className="organic-glass rounded-2xl px-6 lg:px-10 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-900 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/20 transition-all duration-500">
                            <span className="text-white font-bold text-2xl tracking-tighter">BM</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-xl font-bold text-stone-50 leading-none">
                                Black Moss
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-bold">
                                & Herbs
                            </span>
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
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-6">
                        <button className="p-2 text-stone-400 hover:text-amber-500 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link href="/dashboard" className="p-2 text-stone-400 hover:text-amber-500 transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" className="relative group">
                            <div className="p-3 bg-white/5 rounded-full border border-white/5 group-hover:border-amber-500/50 transition-all duration-500">
                                <ShoppingCart className="w-5 h-5 text-stone-300 group-hover:text-amber-500" />
                            </div>
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-black text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                                    {count}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-earth-200"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-2 py-4 animate-slide-down bg-earth-950/95 backdrop-blur-xl border border-earth-800 rounded-2xl">
                        <div className="flex flex-col space-y-4 px-6">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-earth-200 hover:text-secondary-400 transition-colors font-medium uppercase tracking-widest text-sm"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link
                                href="/blog"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-earth-200 hover:text-secondary-400 transition-colors font-medium uppercase tracking-widest text-sm"
                            >
                                Blog
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}
