import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@blackmoss/ui";
import { Header } from "@/components/layout/header";

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
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
