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
    "Discover premium herbal products, expert consultations, and wellness resources. Shop, subscribe, and transform your wellness journey.",
  keywords: ["herbs", "wellness", "natural health", "herbal products", "consultations"],
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
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BlackMoss" />
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
