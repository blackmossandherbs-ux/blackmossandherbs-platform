import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Cookie Policy',
    description: 'How Black Moss & Herbs uses cookies and similar technologies on our website, in accordance with UK GDPR and PECR.',
    alternates: { canonical: 'https://blackmossandherbs.com/legal/cookies' },
}

export default function CookiePolicyPage() {
    return (
        <div className="pt-32 pb-20 container min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                    Cookie Policy
                </h1>
                <p className="text-earth-400 mb-10">Last updated: June 2025</p>

                <div className="space-y-8 text-earth-300 leading-relaxed">

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">What Are Cookies?</h2>
                        <p>
                            Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience. This policy explains how Black Moss &amp; Herbs uses cookies in accordance with the <strong className="text-white">Privacy and Electronic Communications Regulations (PECR)</strong> and the <strong className="text-white">UK General Data Protection Regulation (UK GDPR)</strong>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Cookies We Use</h2>

                        <div className="space-y-6">
                            <div className="p-5 bg-earth-900/40 border border-earth-800 rounded-2xl">
                                <h3 className="font-bold text-white mb-2">Essential Cookies <span className="ml-2 text-xs text-green-400 font-normal uppercase tracking-widest">Always Active</span></h3>
                                <p className="text-sm">
                                    These cookies are strictly necessary for the website to function. They enable core features such as security, account login, shopping cart and checkout. You cannot opt out of these cookies.
                                </p>
                                <ul className="mt-3 text-xs space-y-1 text-earth-400 list-disc list-inside">
                                    <li><code>next-auth.session-token</code> — Keeps you logged in securely</li>
                                    <li><code>next-auth.csrf-token</code> — Protects against cross-site request forgery</li>
                                    <li><code>cookie-consent</code> — Remembers your cookie preference</li>
                                </ul>
                            </div>

                            <div className="p-5 bg-earth-900/40 border border-earth-800 rounded-2xl">
                                <h3 className="font-bold text-white mb-2">Analytics Cookies <span className="ml-2 text-xs text-amber-400 font-normal uppercase tracking-widest">Requires Consent</span></h3>
                                <p className="text-sm">
                                    These cookies help us understand how visitors use our website so we can improve it. Data is aggregated and anonymised where possible.
                                </p>
                                <ul className="mt-3 text-xs space-y-1 text-earth-400 list-disc list-inside">
                                    <li>Google Analytics (if enabled) — page views, session duration, traffic sources</li>
                                </ul>
                            </div>

                            <div className="p-5 bg-earth-900/40 border border-earth-800 rounded-2xl">
                                <h3 className="font-bold text-white mb-2">Preference Cookies <span className="ml-2 text-xs text-amber-400 font-normal uppercase tracking-widest">Requires Consent</span></h3>
                                <p className="text-sm">
                                    These cookies remember your preferences such as region and language settings to provide a more personalised experience.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Managing Your Cookie Preferences</h2>
                        <p>
                            When you first visit our site, you will see a cookie banner allowing you to accept or decline non-essential cookies. You can change your preferences at any time by clearing your browser cookies and revisiting the site.
                        </p>
                        <p className="mt-3">
                            You can also control cookies through your browser settings. Most browsers allow you to block or delete cookies — see your browser&apos;s help documentation for instructions. Please note that blocking essential cookies may prevent parts of our website from working correctly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Third-Party Cookies</h2>
                        <p>
                            We use a limited number of third-party services that may set cookies on your device. These include:
                        </p>
                        <ul className="mt-3 list-disc list-inside space-y-1">
                            <li><strong className="text-white">Stripe</strong> — for secure payment processing</li>
                            <li><strong className="text-white">Google Analytics</strong> — for website analytics (opt-in only)</li>
                        </ul>
                        <p className="mt-3">
                            Each third party operates under its own privacy and cookie policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Contact Us</h2>
                        <p>
                            If you have questions about our use of cookies, please contact us at{' '}
                            <a href="mailto:support@blackmossandherbs.com" className="text-primary-400 hover:text-primary-300 underline">
                                support@blackmossandherbs.com
                            </a>
                            {' '}or write to our Data Controller at the address in our{' '}
                            <a href="/legal/privacy" className="text-primary-400 hover:text-primary-300 underline">Privacy Policy</a>.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
