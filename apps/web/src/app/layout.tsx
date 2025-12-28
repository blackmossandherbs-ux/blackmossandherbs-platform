import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@blackmoss/ui";
import { Header } from "@/components/layout/header";
import { AIChatWidget } from "@/components/ai/chat-widget";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlackMoss & Herbs - Premium Herbal Wellness Platform",
  description:
    "Discover premium herbal products, expert consultations, and wellness resources. Shop, subscribe, and transform your wellness journey with nature's healing power.",
  keywords: [
    "herbal wellness",
    "natural health",
    "herbal products",
    "wellness consultation",
    "herbal remedies",
    "natural supplements",
    "holistic health",
    "herbal medicine",
    "premium herbs",
    "wellness platform",
  ],
  authors: [{ name: "BlackMoss & Herbs" }],
  creator: "BlackMoss & Herbs",
  publisher: "BlackMoss & Herbs",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com",
    siteName: "BlackMoss & Herbs",
    title: "BlackMoss & Herbs - Premium Herbal Wellness Platform",
    description:
      "Discover premium herbal products, expert consultations, and wellness resources. Shop, subscribe, and transform your wellness journey.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BlackMoss & Herbs - Premium Herbal Wellness",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlackMoss & Herbs - Premium Herbal Wellness",
    description:
      "Discover premium herbal products, expert consultations, and wellness resources.",
    images: ["/og-image.jpg"],
    creator: "@blackmossherbs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || "https://blackmossandherbs.com"} />
        <link rel="alternate" type="application/rss+xml" title="BlackMoss & Herbs Blog RSS" href="/api/rss" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BlackMoss" />
        <meta name="application-name" content="BlackMoss & Herbs" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <AIChatWidget />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
