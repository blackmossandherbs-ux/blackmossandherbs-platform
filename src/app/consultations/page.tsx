'use client'

/**
 * Black Moss & Herbs Platform - Herbal Consultations
 */
import { useRef, useState } from 'react'
import { Video } from 'lucide-react'
import ConsultationBookingForm from '@/components/ConsultationBookingForm'

const consultationTypes = [
    {
        id: 'initial',
        name: 'Initial Bio-Assessment',
        price: 150,
        duration: 60,
        description: 'Comprehensive evaluation of your biological terrain and alkaline transition path.',
        features: ['Full Health History Review', 'Alkaline Protocol Design', 'Herbal Prescription', 'Follow-up Plan'],
    },
    {
        id: 'follow-up',
        name: 'Follow-up Session',
        price: 85,
        duration: 30,
        description: 'Progress review and protocol adjustments for ongoing biological restoration.',
        features: ['Results Analysis', 'Formula Fine-tuning', 'Q&A Support', 'Next Steps'],
    },
    {
        id: 'intensive',
        name: 'Intensive Protocol',
        price: 250,
        duration: 90,
        description: 'Deep dive for complex requirements and thorough biological optimization.',
        features: ['Advanced Terrain Analysis', 'Extended Support', 'Custom Master Formulas', 'Priority Support'],
    },
]

export default function ConsultationsPage() {
    const [selectedType, setSelectedType] = useState<string>('initial')
    const formRef = useRef<HTMLDivElement>(null)

    const handleBookSession = (typeId: string) => {
        setSelectedType(typeId)
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <div className="py-24 bg-stone-950 min-h-screen relative overflow-hidden">
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
                        <div key={type.id} className="organic-glass p-10 rounded-3xl border-transparent hover:border-green-500/30 transition-all duration-700 group flex flex-col">
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

                            <ul className="space-y-4 mb-10 flex-1">
                                {type.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm text-stone-300">
                                        <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleBookSession(type.id)}
                                className="w-full h-14 bg-primary-600 hover:bg-amber-600 hover:text-stone-950 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all duration-700"
                            >
                                Book Session
                            </button>
                        </div>
                    ))}
                </div>

                {/* Booking Form */}
                <div ref={formRef} className="max-w-5xl mx-auto scroll-mt-24">
                    <div className="organic-glass p-12 md:p-20 rounded-[3rem] border-amber-500/10">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-serif font-bold text-stone-50 mb-6">Secure Your Slot</h2>
                            <p className="text-stone-400 font-light">Complete the booking form below and we&apos;ll be in touch within 24 hours.</p>
                        </div>
                        <ConsultationBookingForm defaultType={selectedType} />
                    </div>
                </div>

                {/* Practitioners */}
                <div className="mt-40">
                    <div className="text-center mb-20">
                        <h2 className="text-stone-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Master Authority</h2>
                        <h2 className="text-5xl font-serif font-bold text-stone-50">Our Practitioners.</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Dr. Amara Williams', title: 'Lead Herbalist', specialty: 'Biological Terrain & Alkaline Protocols' },
                            { name: 'Sister Ife Okonkwo', title: 'Master Herbalist', specialty: 'Womb Restoration & Hormonal Health' },
                            { name: 'Marcus Adeyemi', title: 'Nutritional Herbalist', specialty: 'Digestive Health & Immunity' },
                        ].map((herbalist, index) => (
                            <div key={index} className="organic-glass p-10 text-center rounded-3xl border-stone-800/10 group hover:border-amber-500/20 transition-all duration-700">
                                <div className="w-32 h-32 bg-stone-900 rounded-full mx-auto mb-8 flex items-center justify-center p-1 border border-stone-800 relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="text-6xl text-stone-700 relative z-10">👤</span>
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-stone-50 mb-2">{herbalist.name}</h3>
                                <p className="text-amber-500 font-black uppercase text-[10px] tracking-widest mb-4">{herbalist.title}</p>
                                <div className="w-12 h-[1px] bg-stone-800 mx-auto mb-6"></div>
                                <p className="text-stone-400 font-light text-sm">{herbalist.specialty}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
