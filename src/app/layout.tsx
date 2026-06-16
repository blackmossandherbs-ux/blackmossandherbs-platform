/**
 * HECTIC Intellectual Property - Copyright 2024
 */
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AIChatWidget from '@/components/AIChatWidget'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
})

/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Compliance Layer
 */
export const metadata: Metadata = {
    title: 'Black Moss & Herbs - Global Herbal Wellness Platform',
    description: 'Premium herbal wellness products, subscriptions, digital resources, and holistic health consultations. Your trusted source for natural healing.',
    keywords: ['herbal wellness', 'natural health', 'supplements', 'holistic healing', 'herbal medicine'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <body>
                <CartProvider>
                    <Header />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                    <AIChatWidget />
                </CartProvider>
            </body>
        </html>
    )
}
