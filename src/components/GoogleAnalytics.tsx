/**
 * Black Moss & Herbs Platform - Google Analytics 4
 * Loads gtag.js only when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.
 */
'use client'

import Script from 'next/script'

export default function GoogleAnalytics() {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

    if (!measurementId) return null

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${measurementId}');
                `}
            </Script>
        </>
    )
}
