/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Bio-Restoration Quiz
 */
"use client";

import { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, FlaskConical, Droplet, Sun, Wind } from 'lucide-react';
import Button from '@/components/Button';

const steps = [
    {
        id: 'energy',
        question: 'How would you describe your current biological energy levels?',
        options: [
            { label: 'Depleted', value: 'low', description: 'Constant fatigue, slow recovery.' },
            { label: 'Fluctuating', value: 'medium', description: 'Morning peaks, afternoon crashes.' },
            { label: 'Optimal', value: 'high', description: 'Consistent vitality throughout the day.' },
        ],
        icon: Sun
    },
    {
        id: 'digestion',
        question: 'Describe your digestive efficiency.',
        options: [
            { label: 'Sluggish', value: 'sluggish', description: 'Bloating, slow transit time.' },
            { label: 'Sensitive', value: 'sensitive', description: 'Reactive to many food types.' },
            { label: 'Efficient', value: 'efficient', description: 'Regular, comfortable digestion.' },
        ],
        icon: FlaskConical
    },
    {
        id: 'mental',
        question: 'What is your current cognitive state?',
        options: [
            { label: 'Foggy', value: 'fog', description: 'Difficulty focusing, mental fatigue.' },
            { label: 'Distracted', value: 'distracted', description: 'Overactive mind, anxious thoughts.' },
            { label: 'Sharp', value: 'sharp', description: 'Clear focus and quick recall.' },
        ],
        icon: Wind
    }
];

export default function BioRestorationQuiz() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isComplete, setIsComplete] = useState(false);

    const handleSelect = (value: string) => {
        setAnswers({ ...answers, [steps[currentStep].id]: value });
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsComplete(true);
        }
    };

    if (isComplete) {
        return (
            <div className="min-h-screen bg-earth-950 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full card p-12 border border-primary-500/30 bg-earth-900/60 backdrop-blur-2xl text-center rounded-[3rem]">
                    <div className="w-20 h-20 bg-primary-900/40 border border-primary-500/50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <CheckCircle2 className="w-10 h-10 text-primary-400" />
                    </div>
                    <h1 className="font-serif text-4xl font-bold text-white mb-4">Protocol Generated</h1>
                    <p className="text-earth-400 text-lg mb-8">Based on your biological markers, we have identified a high-affinity protocol for your restoration.</p>

                    <div className="bg-earth-950/50 border border-earth-800 rounded-2xl p-6 mb-8 text-left">
                        <h3 className="text-secondary-400 font-black uppercase text-xs tracking-widest mb-4">Primary Restoration: Sea Moss Gold Matrix</h3>
                        <p className="text-white text-sm leading-relaxed">Focus on intracellular hydration and mineral replenishment. Your markers suggest a need for high-density iodine and organic iron.</p>
                    </div>

                    <Button size="lg" className="w-full h-16 rounded-2xl text-lg font-bold">
                        Access Your Full Protocol
                    </Button>
                </div>
            </div>
        );
    }

    const StepIcon = steps[currentStep].icon;

    return (
        <div className="min-h-screen bg-earth-950 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary-600/10 blur-[120px] rounded-full" />

            <div className="max-w-3xl w-full relative z-10">
                <div className="mb-12 flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                            <Sparkles size={14} />
                            Biological Analysis
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-white">Step {currentStep + 1} of {steps.length}</h2>
                    </div>
                    <div className="text-earth-500 font-mono text-sm">
                        {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
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

                    <div className="flex justify-between items-center pt-8">
                        <button
                            disabled={currentStep === 0}
                            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                            className="flex items-center gap-2 text-earth-500 hover:text-white disabled:opacity-0 transition-all font-bold text-xs uppercase tracking-widest"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
