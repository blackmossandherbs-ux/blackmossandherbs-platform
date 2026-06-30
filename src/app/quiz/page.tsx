'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, FlaskConical, Sun, Wind, Leaf, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const steps = [
    {
        id: 'energy',
        question: 'How would you describe your current energy levels?',
        options: [
            { label: 'Depleted', value: 'low', description: 'Constant fatigue, slow recovery.' },
            { label: 'Fluctuating', value: 'medium', description: 'Morning peaks, afternoon crashes.' },
            { label: 'Optimal', value: 'high', description: 'Consistent vitality throughout the day.' },
        ],
        icon: Sun,
    },
    {
        id: 'digestion',
        question: 'How would you describe your digestion?',
        options: [
            { label: 'Sluggish', value: 'sluggish', description: 'Bloating, slow transit time.' },
            { label: 'Sensitive', value: 'sensitive', description: 'Reactive to many food types.' },
            { label: 'Efficient', value: 'efficient', description: 'Regular, comfortable digestion.' },
        ],
        icon: FlaskConical,
    },
    {
        id: 'mental',
        question: 'What is your current mental state?',
        options: [
            { label: 'Foggy', value: 'fog', description: 'Difficulty focusing, mental fatigue.' },
            { label: 'Anxious', value: 'anxious', description: 'Overactive mind, stress-driven thoughts.' },
            { label: 'Sharp', value: 'sharp', description: 'Clear focus and quick recall.' },
        ],
        icon: Wind,
    },
    {
        id: 'goal',
        question: 'What is your primary wellness goal?',
        options: [
            { label: 'Everyday Wellbeing', value: 'immunity', description: 'Mineral-rich seaweeds and herbs.' },
            { label: 'Digestion', value: 'gut', description: 'Herbs traditionally enjoyed for gut wellbeing.' },
            { label: 'Vitality', value: 'vitality', description: 'Nutrient-rich botanicals for a balanced routine.' },
        ],
        icon: Leaf,
    },
]

interface Recommendation {
    title: string
    tagline: string
    reasoning: string
    searchQuery: string
    category: string
}

function getRecommendation(answers: Record<string, string>): Recommendation {
    const { energy, digestion, mental, goal } = answers

    // Suggestions are based on the topics you told us you're interested in —
    // they are product ideas to explore, not health assessments.
    if (goal === 'gut' || digestion === 'sluggish' || digestion === 'sensitive') {
        return {
            title: 'Sea Moss & Bladderwrack Blend',
            tagline: 'A popular everyday pairing',
            reasoning: 'You said digestion and gut wellbeing are on your mind. Many people enjoy our Sea Moss & Bladderwrack blend as part of a balanced daily routine. Both are nutrient-rich seaweeds with a long history of traditional use.',
            searchQuery: 'sea moss bladderwrack',
            category: 'Sea Moss Blends',
        }
    }

    if (goal === 'immunity' || (energy === 'low' && mental === 'fog')) {
        return {
            title: 'Sea Moss Gold',
            tagline: 'Naturally mineral-rich',
            reasoning: 'You told us everyday energy and wellbeing matter to you. Sea Moss Gold is a favourite — a nutrient-dense seaweed that naturally contains a wide range of trace minerals, including iodine, zinc and iron, to enjoy as part of a balanced lifestyle.',
            searchQuery: 'sea moss',
            category: 'Sea Moss',
        }
    }

    if (mental === 'anxious' || (mental === 'fog' && energy === 'medium')) {
        return {
            title: 'Adaptogen & Calm Bundle',
            tagline: 'For your wind-down routine',
            reasoning: 'You mentioned a busy mind. Many customers enjoy adaptogenic herbs like ashwagandha, lion\'s mane and reishi as part of a calming daily ritual. These have a long history of traditional use in herbal wellbeing.',
            searchQuery: 'adaptogen',
            category: 'Herbal Blends',
        }
    }

    if (goal === 'vitality' || energy === 'medium') {
        return {
            title: 'Burdock Root & Sea Moss',
            tagline: 'A traditional botanical pairing',
            reasoning: 'You said overall vitality is your focus. Burdock root and sea moss are both long-loved in traditional herbal practice, and many people enjoy them together as part of a balanced everyday routine.',
            searchQuery: 'burdock',
            category: 'Herbs & Sea Moss',
        }
    }

    // Default
    return {
        title: 'Daily Sea Moss',
        tagline: 'A simple everyday favourite',
        reasoning: 'A daily serving of nutrient-rich sea moss is a simple, popular way to complement a balanced lifestyle. It naturally contains a wide range of trace minerals and has a long history of traditional use.',
        searchQuery: 'sea moss',
        category: 'Sea Moss',
    }
}

export default function BioRestorationQuiz() {
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [isComplete, setIsComplete] = useState(false)

    const handleSelect = (value: string) => {
        const updated = { ...answers, [steps[currentStep].id]: value }
        setAnswers(updated)
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            setIsComplete(true)
        }
    }

    if (isComplete) {
        const rec = getRecommendation(answers)
        return (
            <div className="min-h-screen bg-earth-950 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full premium-card p-12 text-center">
                    <div className="w-20 h-20 bg-primary-900/40 border border-primary-500/50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10 text-primary-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-400 mb-3 block">{rec.category}</span>
                    <h1 className="font-serif text-4xl font-bold text-white mb-2">{rec.title}</h1>
                    <p className="text-secondary-400 font-bold uppercase text-xs tracking-widest mb-8">{rec.tagline}</p>

                    <div className="bg-earth-950/50 border border-earth-800 rounded-2xl p-6 mb-8 text-left">
                        <h3 className="text-earth-500 font-black uppercase text-[10px] tracking-widest mb-3">Why we picked this</h3>
                        <p className="text-earth-300 text-sm leading-relaxed">{rec.reasoning}</p>
                    </div>

                    <p className="text-xs text-earth-600 italic mb-8">
                        Food supplement. Not intended to diagnose, treat, cure, or prevent any disease. Results vary. Consult your GP before use.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/shop?q=${encodeURIComponent(rec.searchQuery)}`}
                            className="flex-1 py-4 bg-secondary-500 hover:bg-secondary-400 text-stone-950 font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Shop This Pick
                        </Link>
                        <button
                            onClick={() => { setCurrentStep(0); setAnswers({}); setIsComplete(false) }}
                            className="flex-1 py-4 border border-earth-700 hover:border-earth-500 text-earth-300 hover:text-white font-bold rounded-xl transition-all text-sm uppercase tracking-widest"
                        >
                            Retake Quiz
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const StepIcon = steps[currentStep].icon

    return (
        <div className="min-h-screen bg-earth-950 flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary-600/10 blur-[120px] rounded-full" />

            <div className="max-w-3xl w-full relative z-10">
                {/* Progress */}
                <div className="mb-12">
                    <div className="flex justify-between items-end mb-4">
                        <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-[0.3em]">
                            <Sparkles size={14} />
                            Wellness Analysis
                        </div>
                        <div className="text-earth-500 font-mono text-sm">
                            {currentStep + 1} / {steps.length}
                        </div>
                    </div>
                    <div className="w-full h-1 bg-earth-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full transition-all duration-500"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex items-start gap-6 mb-8">
                        <div className="w-16 h-16 bg-earth-900/80 border border-earth-800 rounded-2xl flex items-center justify-center shrink-0">
                            <StepIcon className="w-8 h-8 text-secondary-400" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white leading-tight mt-2">{steps[currentStep].question}</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {steps[currentStep].options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className="group w-full p-8 bg-earth-900/40 hover:bg-earth-800/60 border border-earth-800 hover:border-primary-500/50 rounded-2xl text-left transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-xl font-bold text-white mb-1">{option.label}</div>
                                        <div className="text-earth-400 text-sm">{option.description}</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-earth-700 flex items-center justify-center group-hover:border-primary-500 transition-colors">
                                        <ArrowRight className="w-4 h-4 text-earth-500 group-hover:text-primary-400" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {currentStep > 0 && (
                        <div className="flex justify-start pt-4">
                            <button
                                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                                className="flex items-center gap-2 text-earth-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
