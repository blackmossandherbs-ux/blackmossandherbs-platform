import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Returns & Refunds Policy',
    description: 'Our returns and refunds policy for UK customers. Under the Consumer Contracts Regulations you have 14 days to return unwanted items.',
    alternates: { canonical: 'https://blackmossandherbs.com/legal/returns' },
}

export default function ReturnsPage() {
    return (
        <div className="pt-32 pb-20 container min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                    Returns &amp; Refunds Policy
                </h1>
                <p className="text-earth-400 mb-10">Last updated: June 2025</p>

                <div className="space-y-8 text-earth-300 leading-relaxed">

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Your Right to Cancel (UK Law)</h2>
                        <p>
                            Under the <strong className="text-white">Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013</strong>, you have the right to cancel your order within <strong className="text-white">14 calendar days</strong> of receiving your goods — no reason needed.
                        </p>
                        <p className="mt-3">
                            To exercise your right to cancel, contact us at{' '}
                            <a href="mailto:support@blackmossandherbs.com" className="text-primary-400 hover:text-primary-300 underline">
                                support@blackmossandherbs.com
                            </a>{' '}
                            or use the contact form on our{' '}
                            <Link href="/contact" className="text-primary-400 hover:text-primary-300 underline">Contact page</Link>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Conditions for Returns</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Items must be <strong className="text-white">unopened, unused and in their original packaging</strong>.</li>
                            <li>Perishable products (fresh sea moss gel, refrigerated items) cannot be returned for hygiene and food safety reasons unless they are faulty or misdescribed.</li>
                            <li>Digital products (eBooks, guides, video access) are non-refundable once downloaded or accessed.</li>
                            <li>Items must be returned within <strong className="text-white">14 days of notifying us</strong> of your cancellation.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Faulty or Incorrect Items</h2>
                        <p>
                            If your item arrives damaged, faulty, or is not as described, you are entitled to a replacement or full refund under the <strong className="text-white">Consumer Rights Act 2015</strong>. Please contact us within 30 days of delivery with photos of the issue.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">How to Return an Item</h2>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Email <a href="mailto:support@blackmossandherbs.com" className="text-primary-400 hover:text-primary-300 underline">support@blackmossandherbs.com</a> with your order number and reason.</li>
                            <li>We will respond within 2 business days with return instructions and a return address.</li>
                            <li>Package items securely — we recommend using a tracked service, as we cannot accept responsibility for items lost in transit.</li>
                            <li>Return postage costs are your responsibility unless the item is faulty or incorrect.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Refunds</h2>
                        <p>
                            Once we receive and inspect your return, we will process your refund to your original payment method within <strong className="text-white">14 days</strong>. You will receive an email confirmation when the refund is issued. Processing times vary by bank (usually 3–5 working days).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Subscriptions</h2>
                        <p>
                            You may cancel your subscription at any time from your account dashboard. Cancellation takes effect at the end of your current billing period — you will retain access until then. Partial refunds for unused subscription periods are not available.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Contact Us</h2>
                        <p>
                            For any questions about returns or refunds, please contact our customer care team:
                        </p>
                        <ul className="mt-3 space-y-1">
                            <li>Email: <a href="mailto:support@blackmossandherbs.com" className="text-primary-400 hover:text-primary-300 underline">support@blackmossandherbs.com</a></li>
                            <li>Response time: within 2 business days</li>
                        </ul>
                    </section>

                </div>
            </div>
        </div>
    )
}
