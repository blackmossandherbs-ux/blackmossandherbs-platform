'use client'

import { useState } from 'react'
import { Mail, Send, CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function EmailArchive() {
    const [testEmail, setTestEmail] = useState('')
    const [sending, setSending] = useState(false)
    const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

    const sendTestEmail = async () => {
        if (!testEmail.trim()) return
        setSending(true)
        setResult(null)
        try {
            const res = await fetch('/api/admin/test-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: testEmail }),
            })
            const data = await res.json()
            setResult({ ok: res.ok, message: data.message || (res.ok ? 'Email sent successfully.' : 'Failed to send email.') })
        } catch {
            setResult({ ok: false, message: 'Network error. Check your SMTP configuration.' })
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="py-12 bg-earth-950 min-h-screen text-earth-200">
            <div className="container relative z-10 max-w-4xl">
                <div className="mb-12">
                    <h1 className="font-serif text-4xl font-bold text-white mb-2">Email System</h1>
                    <p className="text-earth-400">Test your transactional email configuration and verify delivery.</p>
                </div>

                {/* SMTP status info */}
                <div className="p-6 bg-earth-900/40 border border-earth-800 rounded-2xl mb-8 flex items-start gap-4">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-white mb-1">Email Log Tracking</p>
                        <p className="text-sm text-earth-400 leading-relaxed">
                            Real-time email logs require a provider like SendGrid, Resend, or Postmark with webhook delivery events.
                            Configure your SMTP credentials in <code className="text-secondary-400 bg-earth-950 px-1.5 py-0.5 rounded text-xs">.env</code> to enable transactional emails (order confirmations, welcome emails, password resets).
                        </p>
                    </div>
                </div>

                {/* Test email form */}
                <div className="p-8 bg-earth-900/40 border border-earth-800 rounded-2xl mb-8">
                    <h2 className="text-lg font-bold text-white mb-6">Send Test Email</h2>
                    <div className="flex gap-4">
                        <input
                            type="email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendTestEmail()}
                            placeholder="recipient@example.com"
                            className="flex-1 bg-earth-950 border border-earth-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition-colors text-sm"
                        />
                        <button
                            onClick={sendTestEmail}
                            disabled={sending || !testEmail.trim()}
                            className="px-6 py-3 bg-secondary-500 hover:bg-secondary-400 disabled:opacity-50 text-stone-950 font-bold rounded-xl transition-colors flex items-center gap-2 text-sm"
                        >
                            <Send className="w-4 h-4" />
                            {sending ? 'Sending...' : 'Send Test'}
                        </button>
                    </div>
                    {result && (
                        <div className={`mt-4 flex items-center gap-2 text-sm p-3 rounded-xl ${result.ok ? 'bg-emerald-900/30 border border-emerald-800 text-emerald-400' : 'bg-red-900/30 border border-red-800 text-red-400'}`}>
                            {result.ok ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                            {result.message}
                        </div>
                    )}
                </div>

                {/* Email types reference */}
                <div className="p-8 bg-earth-900/40 border border-earth-800 rounded-2xl">
                    <h2 className="text-lg font-bold text-white mb-6">Configured Email Types</h2>
                    <div className="space-y-3">
                        {[
                            { name: 'Welcome Email', trigger: 'New user registration', status: 'active' },
                            { name: 'Order Confirmation', trigger: 'Checkout completed (Stripe webhook)', status: 'active' },
                            { name: 'Password Reset', trigger: 'Forgot password request', status: 'active' },
                            { name: 'Consultation Request', trigger: 'Booking form submitted', status: 'active' },
                        ].map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-4 bg-earth-950/50 rounded-xl border border-earth-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary-900/40 rounded-lg flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{item.name}</p>
                                        <p className="text-xs text-earth-500">{item.trigger}</p>
                                    </div>
                                </div>
                                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Configured
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
