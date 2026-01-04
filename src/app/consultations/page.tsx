/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Herbal Consultations
 */
import { Metadata } from 'next'
import { Calendar, Clock, Video, MessageCircle } from 'lucide-react'
import Button from '@/components/Button'

export const metadata: Metadata = {
    title: 'Consultations - Black Moss & Herbs',
    description: 'Book a personalized herbal wellness consultation with our certified herbalists.',
}

export default function ConsultationsPage() {
    return (
        <div className="py-24 bg-stone-950 min-h-screen relative overflow-hidden">
            {/* Background Textures */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-green-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-amber-900/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="container relative z-10">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 organic-glass rounded-full mb-8 border-green-500/20">
                        <Video className="w-4 h-4 text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400">Biological Support</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-serif font-bold text-stone-50 mb-8 leading-[0.9] tracking-tighter">
                        Clinical <br />
                        <span className="text-amber-500 italic">Guidance.</span>
                    </h1>
                    <p className="text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed font-light">
                        Personalized alkaline protocols with master practitioners. Verify your biological restoration path with experienced herbal authority.
                    </p>
                </div>

                {/* Consultation Types */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {consultationTypes.map((type) => (
                        <div key={type.id} className="organic-glass p-10 rounded-3xl border-transparent hover:border-green-500/30 transition-all duration-700 group">
                            <div className="flex items-center justify-between mb-10">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-green-600 transition-all duration-700">
                                    <Video className="w-7 h-7 text-green-500 group-hover:text-stone-950" />
                                </div>
                                <div className="text-right">
                                    <span className="block text-2xl font-black text-white">£{type.price}</span>
                                    <span className="text-[10px] text-stone-500 uppercase tracking-widest">{type.duration} Minutes</span>
                                </div>
                            </div>

                            <h3 className="font-serif text-3xl font-bold text-stone-50 mb-4 group-hover:text-amber-500 transition-colors">
                                {type.name}
                            </h3>

                            <p className="text-stone-400 font-light mb-8 leading-relaxed line-clamp-2">
                                {type.description}
                            </p>

                            <ul className="space-y-4 mb-10">
                                {type.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-stone-300">
                                        <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button className="w-full h-14 group-hover:bg-amber-600 group-hover:text-stone-950 transition-all duration-700">Book Session</Button>
                        </div>
                    ))}
                </div>

                {/* Booking Section */}
                <div className="max-w-5xl mx-auto">
                    <div className="organic-glass p-12 md:p-20 rounded-[3rem] border-amber-500/10">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-serif font-bold text-stone-50 mb-6">Secure Your Slot</h2>
                            <p className="text-stone-400 font-light">Enter the alchemist's intake system below.</p>
                        </div>

                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full h-16 bg-stone-900/50 border border-stone-800 rounded-2xl px-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Secure Email</label>
                                    <input
                                        type="email"
                                        className="w-full h-16 bg-stone-900/50 border border-stone-800 rounded-2xl px-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all"
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Protocol Type</label>
                                    <select className="w-full h-16 bg-stone-900/50 border border-stone-800 rounded-2xl px-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all appearance-none">
                                        {consultationTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name} - £{type.price}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Restoration Date</label>
                                        <input
                                            type="date"
                                            className="w-full h-16 bg-stone-900/50 border border-stone-800 rounded-2xl px-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Time</label>
                                        <select className="w-full h-16 bg-stone-900/50 border border-stone-800 rounded-2xl px-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all appearance-none">
                                            {availableTimes.map((time) => (
                                                <option key={time} value={time}>
                                                    {time}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] text-amber-500 font-black uppercase tracking-widest ml-1">Restoration Objectives</label>
                                <textarea
                                    className="w-full min-h-40 bg-stone-900/50 border border-stone-800 rounded-3xl p-6 focus:border-green-500/50 focus:outline-none text-stone-100 transition-all resize-none"
                                    placeholder="Describe your current biological goals..."
                                    required
                                ></textarea>
                            </div>

                            <div className="organic-glass p-8 rounded-2xl border-stone-800 flex flex-col md:flex-row items-center gap-6 justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                                        <MessageCircle className="w-6 h-6 text-green-500" />
                                    </div>
                                    <p className="text-sm text-stone-400 max-w-xs leading-relaxed">
                                        Consultations are high-frequency video sessions. You will receive a secure meeting link upon verification.
                                    </p>
                                </div>
                                <Button type="submit" size="lg" className="w-full md:w-auto px-16 h-16 rounded-xl">
                                    Dispatch Request
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Meet Our Practitioners */}
                <div className="mt-40">
                    <div className="text-center mb-20">
                        <h2 className="text-stone-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Master Authority</h2>
                        <h2 className="text-5xl font-serif font-bold text-stone-50">Our Practitioners.</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Dr. Sarah Johnson',
                                title: 'Master Herbalist',
                                specialty: 'Womb Restoration & Hormones',
                            },
                            {
                                name: 'Michael Chen',
                                title: 'Clinical Herbalist',
                                specialty: 'Digestive Alchemist & Immunity',
                            },
                            {
                                name: 'Dr. Amara Williams',
                                title: 'Holistic Practitioner',
                                specialty: 'Stress Modulation & Adaptogens',
                            },
                        ].map((herbalist, index) => (
                            <div key={index} className="organic-glass p-10 text-center rounded-3xl border-stone-800/10 group hover:border-amber-500/20 transition-all duration-700">
                                <div className="w-32 h-32 bg-stone-900 rounded-full mx-auto mb-8 flex items-center justify-center p-1 border border-stone-800 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="text-6xl text-stone-700 relative z-10">👤</span>
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-stone-50 mb-2">
                                    {herbalist.name}
                                </h3>
                                <p className="text-amber-500 font-black uppercase text-[10px] tracking-widest mb-4">
                                    {herbalist.title}
                                </p>
                                <div className="w-12 h-[1px] bg-stone-800 mx-auto mb-6"></div>
                                <p className="text-stone-400 font-light text-sm">
                                    {herbalist.specialty}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
