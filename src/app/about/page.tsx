import { Metadata } from 'next'
import Link from 'next/link'
import { Leaf, Users, Award, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Black Moss & Herbs is a UK-based herbal wellness company dedicated to wildcrafted sea moss, herbal blends and holistic health education.',
    alternates: { canonical: 'https://blackmossandherbs.com/about' },
}

const values = [
    {
        icon: Leaf,
        title: 'Wildcrafted Only',
        desc: 'We source exclusively from protected Atlantic waters. Pool-grown moss never enters our supply chain — the mineral density simply cannot compare.',
    },
    {
        icon: ShieldCheck,
        title: 'UK Food Standards Compliant',
        desc: 'All products are produced to UK FSA standards. Our MHRA-registered food supplements carry clear, honest labelling with no medicinal claims.',
    },
    {
        icon: Users,
        title: 'Community First',
        desc: 'We invest in herbal wellness education — free guides, practitioner consultations and a growing members library that puts knowledge in your hands.',
    },
    {
        icon: Award,
        title: 'Quality Guaranteed',
        desc: 'Every batch is tested for heavy metals and microbial safety. We offer a 14-day satisfaction guarantee on all purchases, no questions asked.',
    },
]

const team = [
    {
        name: 'Dr. Amara Williams',
        role: 'Lead Herbalist & Co-founder',
        bio: 'BSc Biomedical Science, Diploma in Herbal Medicine. 12+ years in herbal wellness and nutrition education. Passionate about sea moss and alkaline-style eating.',
        emoji: '🌿',
    },
    {
        name: 'Marcus Adeyemi',
        role: 'Formulation Lead',
        bio: 'Ethnobotanist and natural product formulator with roots in West African herbal traditions. Developed our flagship sea moss blends and adaptogen range.',
        emoji: '⚗️',
    },
    {
        name: 'Sister Ife Okonkwo',
        role: 'Wellness Education Director',
        bio: 'Ancestral herbalist and wellness educator. Leads our consultation programme and community workshops across the UK.',
        emoji: '📚',
    },
]

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-earth-950">
            {/* Hero */}
            <div className="pt-32 pb-16 container">
                <div className="max-w-3xl">
                    <span className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-4 block">Our Story</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                        Rooted in Nature,<br />Grounded in Science.
                    </h1>
                    <p className="text-earth-300 text-xl leading-relaxed mb-8">
                        Black Moss &amp; Herbs was founded on a simple conviction: that the plants humanity has relied on for thousands of years deserve to be treated with rigour, respect and transparency — not marketing hype.
                    </p>
                    <p className="text-earth-400 text-lg leading-relaxed">
                        We are a UK-based herbal wellness company specialising in wildcrafted sea moss, therapeutic herb blends and holistic health education. Everything we sell, we use ourselves. Every claim we make, we can substantiate.
                    </p>
                </div>
            </div>

            {/* Mission quote */}
            <div className="bg-earth-900/50 border-y border-earth-800 py-16">
                <div className="container max-w-3xl text-center">
                    <blockquote className="font-serif text-2xl md:text-3xl text-secondary-400 italic leading-relaxed mb-4">
                        &ldquo;Nature requires no improvement, only alignment.&rdquo;
                    </blockquote>
                    <cite className="text-earth-500 text-sm not-italic">— Black Moss &amp; Herbs founding principle</cite>
                </div>
            </div>

            {/* Values */}
            <div className="py-20 container">
                <h2 className="text-3xl font-serif font-bold text-white mb-12 text-center">What We Stand For</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {values.map((v) => (
                        <div key={v.title} className="p-8 bg-earth-900/40 border border-earth-800 rounded-2xl">
                            <v.icon className="w-8 h-8 text-primary-400 mb-4" />
                            <h3 className="font-bold text-white text-lg mb-2">{v.title}</h3>
                            <p className="text-earth-400 leading-relaxed text-sm">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team */}
            <div className="py-20 bg-earth-900/30 border-y border-earth-800">
                <div className="container">
                    <h2 className="text-3xl font-serif font-bold text-white mb-4 text-center">The Team</h2>
                    <p className="text-earth-400 text-center mb-12 max-w-xl mx-auto">
                        Herbalists, scientists and educators united by a commitment to honest, evidence-informed wellness.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {team.map((member) => (
                            <div key={member.name} className="text-center p-8 bg-earth-900/50 border border-earth-800 rounded-2xl">
                                <div className="w-20 h-20 bg-primary-900/30 border border-primary-800/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                                    {member.emoji}
                                </div>
                                <h3 className="font-bold text-white text-lg mb-1">{member.name}</h3>
                                <p className="text-primary-400 text-xs font-semibold uppercase tracking-wider mb-4">{member.role}</p>
                                <p className="text-earth-400 text-sm leading-relaxed">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-20 container text-center">
                <h2 className="text-3xl font-serif font-bold text-white mb-4">Ready to start your wellness journey?</h2>
                <p className="text-earth-400 mb-8 max-w-lg mx-auto">
                    Browse our full range of wildcrafted products, or book a consultation with one of our practitioners.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/shop"
                        className="px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition-colors"
                    >
                        Shop Products
                    </Link>
                    <Link
                        href="/consultations"
                        className="px-8 py-4 rounded-xl border border-earth-700 hover:border-earth-500 text-earth-200 hover:text-white font-bold transition-colors"
                    >
                        Book a Consultation
                    </Link>
                </div>
            </div>
        </div>
    )
}
