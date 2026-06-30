import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy | Black Moss & Herbs',
    description: 'How Black Moss & Herbs collects, uses, stores and protects your personal data under UK GDPR, including your rights and how to exercise them.',
    alternates: { canonical: 'https://blackmossandherbs.com/legal/privacy' },
}

const updated = 'June 2026'

export default function PrivacyPage() {
    return (
        <div className="py-24 bg-earth-950 min-h-screen">
            <div className="container max-w-3xl">
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 text-white">Privacy Policy</h1>
                <p className="text-earth-500 text-sm mb-10">Last updated: {updated}</p>

                <div className="space-y-8 text-earth-300 leading-relaxed text-sm">
                    <p>
                        Black Moss &amp; Herbs (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your personal data and respecting your privacy.
                        This policy explains what we collect, why, how long we keep it, who we share it with, and the rights you have under the UK GDPR and the Data Protection Act 2018.
                    </p>

                    <section>
                        <h2 className="text-white font-bold text-lg mb-3">1. Who we are (Data Controller)</h2>
                        <p>
                            Black Moss &amp; Herbs is the data controller for the personal data described in this policy.
                            For any privacy question or to exercise your rights, contact us at{' '}
                            <a href="mailto:support@blackmossandherbs.com" className="text-secondary-400 underline">support@blackmossandherbs.com</a>{' '}
                            with &ldquo;Data Request&rdquo; in the subject line. We respond within 30 days.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-lg mb-3">2. Data we collect</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><strong className="text-earth-100">Account data:</strong> name, email address, and password (stored securely hashed).</li>
                            <li><strong className="text-earth-100">Order &amp; delivery data:</strong> billing and shipping address, items ordered, order history.</li>
                            <li><strong className="text-earth-100">Payment data:</strong> processed entirely by Stripe. We never see or store your full card details.</li>
                            <li><strong className="text-earth-100">Marketing data:</strong> your email and consent status if you subscribe to our newsletter.</li>
                            <li><strong className="text-earth-100">Support &amp; consultation data:</strong> messages and booking details you send us.</li>
                            <li><strong className="text-earth-100">Technical data:</strong> essential cookies and, with your consent, analytics data (see our <a href="/legal/cookies" className="text-secondary-400 underline">Cookie Policy</a>).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-lg mb-3">3. Lawful basis for processing</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><strong className="text-earth-100">Contract:</strong> creating your account, processing and delivering your orders, managing subscriptions.</li>
                            <li><strong className="text-earth-100">Consent:</strong> marketing emails, non-essential cookies/analytics, and AI chat. You can withdraw consent at any time.</li>
                            <li><strong className="text-earth-100">Legitimate interests:</strong> securing our website and preventing fraud.</li>
                            <li><strong className="text-earth-100">Legal obligation:</strong> keeping order and tax records as required by law.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-lg mb-3">4. How long we keep your data</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><strong className="text-earth-100">Account data:</strong> until you delete your account or after 3 years of inactivity.</li>
                            <li><strong className="text-earth-100">Order records &amp; invoices:</strong> 7 years (UK tax and accounting requirements).</li>
                            <li><strong className="text-earth-100">Newsletter subscription:</strong> until you unsubscribe.</li>
                            <li><strong className="text-earth-100">Support enquiries:</strong> up to 2 years.</li>
                            <li><strong className="text-earth-100">AI chat messages:</strong> not stored by us; retention is governed by the AI provider (see section 6).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-lg mb-3">5. Who we share data with</h2>
                        <p className="mb-3">We only share data with trusted providers who help us run the service, under data processing agreements:</p>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><strong className="text-earth-100">Stripe</strong> — payment processing (name, email, billing/shipping address, order details). See <a href="https://stripe.com/privacy" className="text-secondary-400 underline" target="_blank" rel="noopener noreferrer">Stripe&rsquo;s privacy policy</a>.</li>
                            <li><strong className="text-earth-100">Email/SMTP provider</strong> — sending order confirmations, password resets and (with consent) newsletters.</li>
                            <li><strong className="text-earth-100">AI provider</strong> — see section 6.</li>
                            <li><strong className="text-earth-100">Analytics</strong> — only if you accept analytics cookies.</li>
                        </ul>
                        <p className="mt-3">We never sell your personal data.</p>
                    </section>

                    <section id="ai-processing">
                        <h2 className="text-white font-bold text-lg mb-3">6. AI chat (&ldquo;Mr. Moss&rdquo;)</h2>
                        <p>
                            When you use our on-site chat, your message is sent to a third-party AI provider (such as Groq, OpenRouter, Google Gemini or Anthropic)
                            to generate a reply. We do not store your chat messages in our database, but the provider may process and retain them per their own policy.
                            Please do not share sensitive personal or health information in the chat. The chat offers general wellness information only and is not medical advice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-lg mb-3">7. International transfers</h2>
                        <p>
                            Some of our providers (including payment and AI services) may process data outside the UK/EEA. Where they do, we rely on appropriate safeguards
                            such as the UK International Data Transfer Agreement or Standard Contractual Clauses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-lg mb-3">8. Your rights</h2>
                        <p className="mb-3">Under UK GDPR you have the right to:</p>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Access a copy of your data — use <strong className="text-earth-100">Dashboard → Account Settings → Download My Data</strong>.</li>
                            <li>Erase your account and data — use <strong className="text-earth-100">Account Settings → Delete My Account</strong>.</li>
                            <li>Rectify inaccurate data, restrict or object to processing, and withdraw consent at any time.</li>
                            <li>Complain to the <a href="https://ico.org.uk" className="text-secondary-400 underline" target="_blank" rel="noopener noreferrer">Information Commissioner&rsquo;s Office (ICO)</a> if you believe we have mishandled your data.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-lg mb-3">9. Data security</h2>
                        <p>
                            We use appropriate technical and organisational measures to protect your data, including encrypted connections (HTTPS) and securely hashed passwords.
                            No method of transmission over the internet is 100% secure, but we work to protect your data and review our measures regularly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-white font-bold text-lg mb-3">10. Contact</h2>
                        <p>
                            Questions about this policy or your data? Email{' '}
                            <a href="mailto:support@blackmossandherbs.com" className="text-secondary-400 underline">support@blackmossandherbs.com</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
