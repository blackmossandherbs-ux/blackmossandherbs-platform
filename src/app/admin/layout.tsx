import { Metadata } from 'next'

// Admin is behind auth + middleware and disallowed in robots.txt; this is a
// belt-and-braces noindex so it can never surface in search results.
export const metadata: Metadata = {
    title: 'Admin | Black Moss & Herbs',
    robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return children
}
