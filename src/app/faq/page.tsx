import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FAQ — Sea Moss, Delivery & Returns',
    description: 'Answers to common questions about Black Moss & Herbs products, UK delivery, returns policy, sea moss usage, and subscription plans.',
    alternates: { canonical: 'https://blackmossandherbs.com/faq' },
    openGraph: {
        title: 'FAQ | Black Moss & Herbs',
        description: 'Everything you need to know about our wildcrafted sea moss, UK delivery times, returns, and subscriptions.',
        url: 'https://blackmossandherbs.com/faq',
    },
}

const faqs = [
    {
        q: 'How do I use Sea Moss Gel?',
        a: 'Take 1–2 tablespoons daily. You can eat it directly or blend it into smoothies, teas, soups, and porridge. For best results, take on an empty stomach in the morning.',
    },
    {
        q: 'Is your Sea Moss wildcrafted?',
        a: 'Yes. We source exclusively wildcrafted Chondrus Crispus and Gracilaria from protected Atlantic waters. We never use pool-grown moss, which lacks the mineral density of wild-harvested varieties.',
    },
    {
        q: 'What is the shelf life of your products?',
        a: 'Refrigerated sea moss gel lasts 3–4 weeks. Dried sea moss and herbal blends last up to 12 months when stored in a cool, dark place away from moisture and direct sunlight.',
    },
    {
        q: 'Do you deliver across the UK?',
        a: 'Yes — we deliver to all mainland UK addresses, including Scotland, Wales and Northern Ireland. Standard delivery is 2–4 working days. Express next-day options are available at checkout. See our Delivery page for full details.',
    },
    {
        q: 'What is your returns policy?',
        a: 'Under the UK Consumer Rights Act and Consumer Contracts Regulations, you have 14 days from receipt of your order to cancel and return unopened items for a full refund. Please visit our Returns & Refunds page or contact support@blackmossandherbs.com to initiate a return.',
    },
    {
        q: 'Are your products safe during pregnancy?',
        a: 'We always recommend consulting your midwife or GP before taking any supplement during pregnancy or while breastfeeding. Some herbal blends are not suitable for certain stages of pregnancy.',
    },
    {
        q: 'Are your products MHRA-approved?',
        a: 'Our products are food supplements and do not require MHRA approval. They are produced to UK food safety standards and are not medicines. They are not intended to diagnose, treat, cure or prevent any disease.',
    },
    {
        q: 'What is Sea Moss?',
        a: 'Wildcrafted sea moss is a nutrient-dense seaweed that naturally contains a wide range of trace minerals, including iodine, iron, magnesium, potassium and zinc. It has a long history of traditional use and is enjoyed by many people as part of a balanced lifestyle. As a food supplement, it is not intended to diagnose, treat, cure or prevent any disease.',
    },
    {
        q: 'Can I cancel or pause my subscription?',
        a: 'Yes. You can cancel or pause your subscription at any time from your account dashboard with no penalty. Changes take effect from the next billing cycle. We do not charge cancellation fees.',
    },
    {
        q: 'How do I track my order?',
        a: 'Once your order has been dispatched, you will receive a tracking email with your Royal Mail or courier tracking number. You can also view order status in your account under Order History.',
    },
    {
        q: 'Do you offer wholesale or bulk orders?',
        a: 'Yes — we supply wellness practitioners, gyms, spas and health food stores across the UK. Contact us at support@blackmossandherbs.com with your business details and required quantities.',
    },
    {
        q: 'How do I book a herbal consultation?',
        a: 'Visit our Consultations page and choose between a 30-minute introductory session or a 60-minute in-depth consultation. Sessions are conducted via video call. You will receive a confirmation email with joining details.',
    },
]

const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
        },
    })),
}

export default function FAQPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div className="pt-32 pb-20 container min-h-screen">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-earth-400 mb-12 text-lg">
                        Everything you need to know about our products, UK delivery, returns and more.
                    </p>

                    <div className="space-y-4">
                        {faqs.map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-earth-900/40 border border-earth-800">
                                <h2 className="font-bold text-white text-lg mb-2">{item.q}</h2>
                                <p className="text-earth-400 leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 rounded-2xl bg-primary-900/20 border border-primary-800/40 text-center">
                        <h2 className="text-xl font-bold text-white mb-3">Still have questions?</h2>
                        <p className="text-earth-400 mb-4">Our team is happy to help — usually within one business day.</p>
                        <a
                            href="/contact"
                            className="inline-block px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-colors"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
