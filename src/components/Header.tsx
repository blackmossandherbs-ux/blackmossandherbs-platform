'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 glass border-b border-earth-200">
            <nav className="container">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">BM</span>
                        </div>
                        <span className="font-serif text-xl font-bold text-earth-900 hidden sm:block">
                            Black Moss & Herbs
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/shop" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                            Shop
                        </Link>
                        <Link href="/subscriptions" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                            Subscriptions
                        </Link>
                        <Link href="/library" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                            Library
                        </Link>
                        <Link href="/blog" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                            Blog
                        </Link>
                        <Link href="/videos" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                            Videos
                        </Link>
                        <Link href="/consultations" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                            Consultations
                        </Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-earth-700 hover:text-primary-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link href="/dashboard" className="p-2 text-earth-700 hover:text-primary-600 transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" className="p-2 text-earth-700 hover:text-primary-600 transition-colors relative">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                0
                            </span>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-earth-700"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 animate-slide-down">
                        <div className="flex flex-col space-y-4">
                            <Link href="/shop" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                                Shop
                            </Link>
                            <Link href="/subscriptions" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                                Subscriptions
                            </Link>
                            <Link href="/library" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                                Library
                            </Link>
                            <Link href="/blog" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                                Blog
                            </Link>
                            <Link href="/videos" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                                Videos
                            </Link>
                            <Link href="/consultations" className="text-earth-700 hover:text-primary-600 transition-colors font-medium">
                                Consultations
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}
