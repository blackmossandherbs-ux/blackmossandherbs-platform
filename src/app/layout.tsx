/**
 * HECTIC Intellectual Property - Copyright 2024
 */
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AIChatWidget from '@/components/AIChatWidget'
import CookieBanner from '@/components/CookieBanner'
import Providers from '@/components/Providers'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
})

export const metadata: Metadata = {
    metadataBase: new URL('https://blackmossandherbs.com'),
    title: {
        default: 'Black Moss & Herbs | Premium Herbal Wellness UK',
        template: '%s | Black Moss & Herbs',
    },
    description: 'Premium wildcrafted sea moss, herbal blends and wellness subscriptions — delivered across the UK. Expert consultations, digital guides and a members library.',
    keywords: ['sea moss UK', 'wildcrafted sea moss', 'herbal wellness UK', 'irish moss gel', 'black moss herbs', 'natural supplements UK', 'holistic health'],
    authors: [{ name: 'Black Moss & Herbs', url: 'https://blackmossandherbs.com' }],
    creator: 'Black Moss & Herbs',
    publisher: 'Black Moss & Herbs',
    alternates: {
        canonical: 'https://blackmossandherbs.com',
    },
    openGraph: {
        type: 'website',
        locale: 'en_GB',
        url: 'https://blackmossandherbs.com',
        siteName: 'Black Moss & Herbs',
        title: 'Black Moss & Herbs | Premium Herbal Wellness UK',
        description: 'Premium wildcrafted sea moss, herbal blends and wellness subscriptions delivered across the UK.',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Black Moss & Herbs — Premium Herbal Wellness',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Black Moss & Herbs | Premium Herbal Wellness UK',
        description: 'Premium wildcrafted sea moss, herbal blends and wellness subscriptions delivered across the UK.',
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    ...(process.env.GOOGLE_SITE_VERIFICATION
        ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
        : {}),
}

const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Black Moss & Herbs',
    url: 'https://blackmossandherbs.com',
    logo: 'https://blackmossandherbs.com/images/logo.png',
    description: 'Premium wildcrafted sea moss, herbal blends and wellness subscriptions — delivered across the UK.',
    address: {
        '@type': 'PostalAddress',
        addressCountry: 'GB',
    },
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'support@blackmossandherbs.com',
        availableLanguage: 'English',
    },
    sameAs: [
        'https://www.instagram.com/blackmossandherbs',
        'https://www.facebook.com/blackmossandherbs',
    ],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en-GB" className={`${inter.variable} ${playfair.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
            </head>
            <body>
                <Providers>
                    <Header />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                    <AIChatWidget />
                    <CookieBanner />
                </Providers>
            </body>
        </html>
    )
}
