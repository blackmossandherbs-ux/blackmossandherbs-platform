import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Herbal Wellness Consultations | Black Moss & Herbs',
    description: 'Book a friendly one-to-one wellness consultation with our herbalists for guidance on sea moss, herbs and natural nutrition. General wellness guidance, not a medical service.',
    alternates: { canonical: 'https://blackmossandherbs.com/consultations' },
    openGraph: {
        title: 'Herbal Wellness Consultations | Black Moss & Herbs',
        description: 'Friendly, personalised guidance on herbs and natural nutrition from experienced herbalists.',
        url: 'https://blackmossandherbs.com/consultations',
    },
}

export default function ConsultationsLayout({ children }: { children: React.ReactNode }) {
    return children
}
