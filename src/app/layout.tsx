/**
 * HECTIC Intellectual Property - Copyright 2024
 */
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AIChatWidget from '@/components/AIChatWidget'
import Providers from '@/components/Providers'
import GoogleAnalytics from '@/components/GoogleAnalytics'

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
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://blackmossandherbs.com'
const SITE_TITLE = 'Black Moss & Herbs - Global Herbal Wellness Platform'
const SITE_DESCRIPTION = 'Premium herbal wellness products, subscriptions, digital resources, and holistic health consultations. Your trusted source for natural healing.'

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: '%s | Black Moss & Herbs',
    },
    description: SITE_DESCRIPTION,
    keywords: ['herbal wellness', 'natural health', 'supplements', 'holistic healing', 'herbal medicine'],
    openGraph: {
        type: 'website',
        url: SITE_URL,
        siteName: 'Black Moss & Herbs',
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [{ url: '/brand/logo.svg', width: 320, height: 80, alt: 'Black Moss & Herbs' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: ['/brand/logo.svg'],
    },
    // Free — paste the verification code from Google Search Console into
    // GOOGLE_SITE_VERIFICATION. Omitted entirely (not rendered) if unset.
    verification: process.env.GOOGLE_SITE_VERIFICATION
        ? { google: process.env.GOOGLE_SITE_VERIFICATION }
        : undefined,
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <body>
                <Providers>
                    <Header />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                    <AIChatWidget />
                </Providers>
                <GoogleAnalytics />
            </body>
        </html>
    )
}
