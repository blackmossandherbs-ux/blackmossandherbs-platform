import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Delivery Information',
    description: 'UK delivery times, costs and areas for Black Moss & Herbs orders. Standard 2–4 day, express next-day options available.',
    alternates: { canonical: 'https://blackmossandherbs.com/legal/delivery' },
}

export default function DeliveryPage() {
    return (
        <div className="pt-32 pb-20 container min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                    Delivery Information
                </h1>
                <p className="text-earth-400 mb-10">Last updated: June 2025</p>

                <div className="space-y-8 text-earth-300 leading-relaxed">

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">UK Delivery Options</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-earth-700">
                                        <th className="text-left py-3 pr-4 text-white font-semibold">Service</th>
                                        <th className="text-left py-3 pr-4 text-white font-semibold">Estimated Time</th>
                                        <th className="text-left py-3 text-white font-semibold">Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-earth-800">
                                    <tr>
                                        <td className="py-3 pr-4">Standard Delivery</td>
                                        <td className="py-3 pr-4">2–4 working days</td>
                                        <td className="py-3">£3.99</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 pr-4">Express Delivery</td>
                                        <td className="py-3 pr-4">Next working day (order by 1pm)</td>
                                        <td className="py-3">£6.99</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 pr-4 font-semibold text-primary-400">Free Standard Delivery</td>
                                        <td className="py-3 pr-4">2–4 working days</td>
                                        <td className="py-3 text-primary-400 font-semibold">FREE on orders over £40</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Where We Deliver</h2>
                        <p>We deliver to all <strong className="text-white">mainland UK addresses</strong>, including:</p>
                        <ul className="mt-3 list-disc list-inside space-y-1">
                            <li>England, Wales, Scotland and Northern Ireland</li>
                            <li>Scottish Highlands (may add 1–2 extra working days)</li>
                            <li>Channel Islands and Isle of Man (additional charges may apply)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Order Processing</h2>
                        <p>
                            Orders placed before <strong className="text-white">1pm Monday–Friday</strong> are processed the same day. Orders placed after 1pm or on weekends are processed the next working day.
                        </p>
                        <p className="mt-3">
                            Fresh sea moss gel orders are dispatched in insulated packaging with ice packs to maintain freshness during transit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Tracking Your Order</h2>
                        <p>
                            Once your order is dispatched, you will receive a tracking email from us or directly from our courier (Royal Mail / DPD). You can also check your order status in your{' '}
                            <a href="/dashboard/orders" className="text-primary-400 hover:text-primary-300 underline">Order History</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">Delivery Issues</h2>
                        <p>
                            If your order hasn&apos;t arrived within the estimated timeframe, please check your tracking link first. If there is still an issue, contact us at{' '}
                            <a href="mailto:support@blackmossandherbs.com" className="text-primary-400 hover:text-primary-300 underline">
                                support@blackmossandherbs.com
                            </a>{' '}
                            and we will investigate promptly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-3">International Shipping</h2>
                        <p>
                            We currently do not offer international shipping. We are working to expand to the EU and Republic of Ireland. Sign up to our newsletter to be notified when international shipping becomes available.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
