'use client'

import { useState, useRef } from 'react'
import { MessageCircle, Check, Loader2 } from 'lucide-react'
import Button from './Button'

const consultationTypes = [
    { id: 'initial', name: 'Initial Bio-Assessment', price: 150, duration: 60 },
    { id: 'follow-up', name: 'Follow-up Session', price: 85, duration: 30 },
    { id: 'intensive', name: 'Intensive Protocol', price: 250, duration: 90 },
]

const availableTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

interface Props {
    defaultType?: string
}

export default function ConsultationBookingForm({ defaultType }: Props) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [type, setType] = useState(defaultType || consultationTypes[0].id)
    const [date, setDate] = useState('')
    const [time, setTime] = useState(availableTimes[0])
    const [objectives, setObjectives] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    // Min date = tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split('T')[0]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch('/api/consultations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, type, date, time, objectives }),
            })
            if (!res.ok) {
                const d = await res.json()
                throw new Error(d.error || 'Submission failed')
            }
            setSuccess(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-stone-50 mb-4">Request Dispatched</h3>
                <p className="text-stone-400 font-light max-w-md mx-auto leading-relaxed">
                    Your consultation request has been received. A confirmation has been sent to <strong className="text-stone-300">{email}</strong>. Our practitioners will confirm your slot within 24 hours.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-16 bg-stone-900/50 border border-stone-800 rounded-2xl px-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all"
                        placeholder="Full Name"
                        required
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-16 bg-stone-900/50 border border-stone-800 rounded-2xl px-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all"
                        placeholder="email@example.com"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Protocol Type</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full h-16 bg-stone-900/50 border border-stone-800 rounded-2xl px-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all appearance-none"
                    >
                        {consultationTypes.map((t) => (
                            <option key={t.id} value={t.id}>{t.name} — £{t.price}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            min={minDate}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full h-16 bg-stone-900/50 border border-stone-800 rounded-2xl px-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Time</label>
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full h-16 bg-stone-900/50 border border-stone-800 rounded-2xl px-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all appearance-none"
                        >
                            {availableTimes.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Restoration Objectives</label>
                <textarea
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    className="w-full min-h-40 bg-stone-900/50 border border-stone-800 rounded-3xl p-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all resize-none"
                    placeholder="Describe your current biological goals and health history…"
                />
            </div>

            {error && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-xl px-5 py-3">{error}</p>
            )}

            <div className="organic-glass p-8 rounded-2xl border-stone-800 flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
                        Sessions are conducted via secure video link. You will receive confirmation and payment details within 24 hours.
                    </p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-16 h-16 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3"
                >
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Dispatching…</> : 'Dispatch Request'}
                </button>
            </div>
        </form>
    )
}
