
/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Alchemist AI Persona
 */
"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { sanitizeWellnessContent, getUKDisclaimer, isMedicalAdviceRequest } from '@/lib/compliance';

type GuideId = 'mr-moss';

interface Guide {
    id: GuideId;
    name: string;
    description: string;
    icon: any;
    initialMessage: string;
}

const GUIDES: Guide[] = [
    {
        id: 'mr-moss',
        name: 'Mr. Moss',
        description: 'Your Wellness Guide',
        icon: Bot,
        initialMessage: "Hello, I'm Mr. Moss — your friendly guide here at Black Moss & Herbs. Ask me anything about sea moss, our herbs, or natural wellbeing. How can I help you today?"
    }
];

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'selection' | 'chat'>('chat');
    const [selectedGuide, setSelectedGuide] = useState<Guide>(GUIDES[0]);
    const [messages, setMessages] = useState<any[]>([{ role: 'assistant', content: GUIDES[0].initialMessage }]);
    const [hasUsedFreeGift, setHasUsedFreeGift] = useState(false);
    const [userMessageCount, setUserMessageCount] = useState(0);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSelectGuide = (guide: Guide) => {
        setSelectedGuide(guide);
        setMessages([{ role: 'assistant', content: guide.initialMessage }]);
        setView('chat');
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        const newMessages = [...messages, { role: 'user', content: userMsg }];
        setMessages(newMessages);
        setInput('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    guideId: selectedGuide.id,
                    messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
                }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            let finalResponse = sanitizeWellnessContent(data.content);
            const lower = userMsg.toLowerCase();
            const isHealthInquiry = isMedicalAdviceRequest(userMsg) || lower.includes('pain') || lower.includes('condition') || lower.includes('chronic');

            if (isHealthInquiry) {
                finalResponse += "\n\n" + getUKDisclaimer();
            }

            setMessages(prev => [...prev, { role: 'assistant', content: finalResponse }]);
        } catch (error) {
            console.error('[AI Chat Widget] ERROR:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry — I'm having trouble responding right now. Please try again in a moment." }]);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-earth-900 border border-earth-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-earth-950 p-4 flex justify-between items-center border-b border-earth-800">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setView('selection')}
                                className={`${view === 'chat' ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity p-1 hover:bg-earth-800 rounded-lg text-earth-400`}
                            >
                                ←
                            </button>
                            <div className="p-2 bg-primary-900/50 rounded-full text-primary-400">
                                <selectedGuide.icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-serif text-secondary-400 font-bold">{selectedGuide.name}</h3>
                                <p className="text-xs text-earth-400">{selectedGuide.description}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-earth-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0">
                        {view === 'selection' ? (
                            <div className="p-6 space-y-4 animate-in fade-in duration-300">
                                <h4 className="text-sm font-secondary-400 font-bold text-center text-white mb-2 uppercase tracking-widest">Choose Your Guide</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {GUIDES.map((guide) => (
                                        <button
                                            key={guide.id}
                                            onClick={() => handleSelectGuide(guide)}
                                            className="flex items-center gap-4 p-4 bg-earth-800/50 border border-earth-700 rounded-2xl hover:border-secondary-500/50 hover:bg-earth-800 transition-all text-left"
                                        >
                                            <div className="p-2 bg-primary-900/30 rounded-xl text-primary-400">
                                                <guide.icon size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">{guide.name}</div>
                                                <div className="text-xs text-earth-400">{guide.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-center text-earth-500 italic mt-4">"The Council provides frameworks, not medical diagnosis."</p>
                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-4 bg-earth-900/95 backdrop-blur-sm">
                                    {messages.map((m, i) => (
                                        <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user'
                                                ? 'bg-secondary-600 text-white rounded-tr-none'
                                                : 'bg-earth-800 text-earth-100 border border-earth-700 rounded-tl-none whitespace-pre-wrap'
                                                }`}>
                                                {m.content}
                                            </div>
                                            {m.role === 'assistant' && (m.content.includes('Consultation') || m.content.includes('join the Circle')) && (
                                                <div className="mt-2 flex gap-2">
                                                    <Link href="/consultations" className="text-xs bg-secondary-500 hover:bg-secondary-400 text-black font-bold py-1 px-3 rounded-full transition-colors">
                                                        Book Consult
                                                    </Link>
                                                    <Link href="/library" className="text-xs bg-earth-700 hover:bg-earth-600 text-white font-bold py-1 px-3 rounded-full transition-colors">
                                                        Join Circle
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="p-3 bg-earth-950 border-t border-earth-800 flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ask a question..."
                                        className="flex-1 bg-earth-900 border border-earth-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-secondary-500 transition-colors placeholder:text-earth-500"
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="p-2 bg-secondary-500 hover:bg-secondary-400 text-black rounded-xl transition-colors"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                                <p className="px-3 pb-3 -mt-1 bg-earth-950 text-[9px] leading-snug text-earth-600">
                                    Messages are processed by an AI service to generate replies. Please don&apos;t share sensitive health information. General wellness guidance only — not medical advice. See our{' '}
                                    <Link href="/legal/privacy" className="underline hover:text-earth-400">Privacy Policy</Link>.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center ${isOpen ? 'bg-earth-800 text-earth-400 rotate-90' : 'bg-gradient-to-r from-primary-700 to-secondary-600 text-white animate-pulse-slow'
                    }`}
            >
                {isOpen ? <X size={24} /> : <Sparkles size={24} />}
            </button>
        </div>
    );
}
