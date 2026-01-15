"use client";

import { useState, useEffect } from 'react';
import { PenTool, Send, Globe, MessageSquare, CheckCircle, RefreshCw, Layers, Library, Trash2, Edit2, Plus, X, Play, Loader2, Sparkles } from 'lucide-react';
import Button from '@/components/Button';

interface BlogPost {
    id: string;
    title: string;
    category: string;
    createdAt: string;
    published: boolean;
}

interface Video {
    id: string;
    title: string;
    category: string;
    createdAt: string;
    url: string;
}

export default function ContentHubPage() {
    const [view, setView] = useState<'AI' | 'LIBRARY'>('AI');
    const [topic, setTopic] = useState('');
    const [persona, setPersona] = useState('Journalist');
    const [generating, setGenerating] = useState(false);
    const [draft, setDraft] = useState<any>(null);
    const [deployed, setDeployed] = useState(false);

    // Library State
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loadingLibrary, setLoadingLibrary] = useState(false);

    useEffect(() => {
        if (view === 'LIBRARY') {
            fetchLibrary();
        }
    }, [view]);

    const fetchLibrary = async () => {
        setLoadingLibrary(true);
        try {
            const [blogsRes, videosRes] = await Promise.all([
                fetch('/api/admin/blogs'),
                fetch('/api/admin/videos')
            ]);
            const [blogsData, videosData] = await Promise.all([
                blogsRes.json(),
                videosRes.json()
            ]);
            setBlogs(blogsData);
            setVideos(videosData);
        } catch (error) {
            console.error('Library sync failure:', error);
        } finally {
            setLoadingLibrary(false);
        }
    };

    const deleteBlog = async (id: string) => {
        if (!confirm('Purge this wisdom record?')) return;
        await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
        fetchLibrary();
    };

    const deleteVideo = async (id: string) => {
        if (!confirm('Purge this visual record?')) return;
        await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
        fetchLibrary();
    };

    // SIMULATED AI GENERATOR
    // In a real production environment, this would call an OpenAI API route.
    // For this demo/ MVP, we use highly sophisticated templates.
    const handleGenerate = async () => {
        setGenerating(true);
        setDeployed(false);

        // Simulate "Thinking" time
        await new Promise(resolve => setTimeout(resolve, 2000));

        let title = '';
        let content = '';
        let category = 'Wellness';
        let excerpt = '';

        const t = topic.toLowerCase();

        if (t.includes('sea moss')) {
            title = 'The 92-Mineral Miracle: Why Sea Moss Is Taking Over';
            category = 'Superfoods';
            excerpt = 'From thyroid health to unlimited energy, sea moss is the biological reset button you have been looking for.';
            content = `
                <p>In the world of holistic health, few substances command the authority of Chondrus Crispus, commonly known as Sea Moss. It’s not just a trend; it’s a biological necessity.</p>
                <h3>The Mineral Matrix</h3>
                <p>The human body consists of 102 minerals. Sea Moss contains 92 of them. Think about that math for a second. By simply incorporating this marine gold into your routine, you are effectively refueling your cellular engine with almost every single building block it needs to function.</p>
                <h3>Thyroid & Energy</h3>
                <p>Feeling tired? That’s often a mineral deficiency, specifically Iodine. Sea Moss is packed with natural, bio-available iodine that supports the thyroid gland, the master regulator of your metabolism and energy.</p>
                <h3>How To Use It</h3>
                <p>Gel form is best. One to two tablespoons a day in your smoothie, tea, or straight off the spoon. It is the easiest adjustment with the highest return on investment for your health.</p>
            `;
        } else if (t.includes('immune') || t.includes('virus') || t.includes('flu')) {
            title = 'Bulletproofing Your Biology: The Alkaline Immune Protocol';
            category = 'Immune Health';
            excerpt = 'Stop fighting sickness and start building resilience. Here are the top 3 herbs for immediate immune defense.';
            content = `
                <p>We are taught to fear the germ, but we should focus on the terrain. A strong, alkaline body is hostile to invaders. Immunity isn’t luck; it’s engineering.</p>
                <h3>1. Elderberry (The Shield)</h3>
                <p>Known as the "medicine chest," Elderberry stops viruses from replicating. It’s your first line of defense.</p>
                <h3>2. Oregano Oil (The Weapon)</h3>
                <p>Potent, anti-viral, and anti-bacterial. It’s nature’s antibiotic without the gut-destroying side effects.</p>
                <h3>3. Vitamin C (The Fuel)</h3>
                <p>Not from a packet of sugar powder. We mean Camu Camu or Acerola Cherry. Real, plant-based electric vitamin C that absorbs instantly.</p>
                <p><strong>The Protocol:</strong> Combine these three daily during the winter months, and watch your resilience skyrocket.</p>
            `;
        } else {
            // Generic Fallback - Dynamic
            title = `The Truth About ${topic}: What They Don't Tell You`;
            category = 'Herbal Wisdom';
            excerpt = `An investigative look into ${topic} and how it plays a critical role in modern biological restoration.`;
            content = `
                <p>There is a lot of noise in the wellness space about <strong>${topic}</strong>. Today, we are cutting through the marketing and getting straight to the biology.</p>
                <h3>The Root Cause</h3>
                <p>Most modern ailments stem from inflammation and acidity. ${topic}, when utilized correctly, acts as a powerful alkalizing agent, helping to cool the system down and restore flow.</p>
                <h3>Ancient Wisdom, Modern Science</h3>
                <p>Our ancestors knew about the power of ${topic} for centuries. Modern science is just catching up. Studies now confirm what herbalists have said all along: nature provides the blueprint.</p>
                <h3>Implementation</h3>
                <p>Don’t overcomplicate it. Start small. Consistency is better than intensity. Listen to your body as you introduce this new protocol.</p>
            `;
        }

        setDraft({ title, excerpt, content, category });
        setGenerating(false);
    };

    const handleDeploy = async () => {
        if (!draft) return;
        setGenerating(true);
        try {
            const res = await fetch('/api/admin/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: draft.title,
                    content: draft.content,
                    excerpt: draft.excerpt,
                    category: draft.category,
                    published: true,
                    // Auto-slug generation handles the rest on the server
                })
            });
            if (res.ok) {
                setDeployed(true);
                // Clear draft after delay
                setTimeout(() => setDraft(null), 3000);
            }
        } catch (error) {
            console.error('Deployment failure:', error);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="py-12 bg-earth-950 min-h-screen relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/patterns/noise.png')] opacity-5 pointer-events-none" />

            <div className="container relative z-10">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent mb-2">
                            Newsroom Control
                        </h1>
                        <p className="text-earth-400 text-lg">AI-Augmented Editorial Suite</p>
                    </div>
                    <div className="bg-earth-900/50 p-1.5 rounded-2xl border border-earth-800 backdrop-blur-md flex">
                        <button
                            onClick={() => setView('AI')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'AI' ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'text-earth-500 hover:text-earth-300'}`}>
                            <RefreshCw size={14} className={view === 'AI' ? 'animate-spin-slow' : ''} />
                            AI Auto-Write
                        </button>
                        <button
                            onClick={() => setView('LIBRARY')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'LIBRARY' ? 'bg-secondary-600 text-white shadow-lg shadow-secondary-900/20' : 'text-earth-500 hover:text-earth-300'}`}>
                            <Library size={14} />
                            Archives
                        </button>
                    </div>
                </div>

                {view === 'AI' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="card p-8 border border-earth-800 bg-earth-900/40 backdrop-blur-xl rounded-[2rem]">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-900/20 rounded-xl flex items-center justify-center border border-primary-700/30">
                                        <Sparkles className="w-5 h-5 text-primary-400" />
                                    </div>
                                    Topic Command
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-earth-500 uppercase tracking-widest mb-3">Core Subject</label>
                                        <input
                                            type="text"
                                            className="w-full bg-earth-950/50 border border-earth-800 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-secondary-500 transition-colors placeholder:text-earth-700"
                                            placeholder="e.g. Benefits of Sea Moss..."
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                        />
                                    </div>
                                    <Button
                                        className="w-full h-16 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl overflow-hidden group relative bg-gradient-to-r from-primary-900 to-earth-900 hover:from-primary-800 hover:to-earth-800"
                                        onClick={handleGenerate}
                                        disabled={generating || !topic}>
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {generating ? <Loader2 className="animate-spin" /> : <Layers className="w-5 h-5 text-primary-400" />}
                                            Generate Article
                                        </span>
                                    </Button>
                                    <p className="text-[10px] text-earth-500 text-center leading-relaxed">
                                        The AI Council will analyze biological data and draft a compliant, high-authority article instantly.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            {draft ? (
                                <div className="space-y-6 animate-in fade-in duration-700">
                                    <div className="card border border-earth-800 bg-earth-900/60 backdrop-blur-xl p-10 rounded-[3rem]">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-secondary-500">Draft Preview</span>
                                                <span className="text-xs text-earth-500">Review before publishing</span>
                                            </div>
                                            <Button
                                                onClick={handleDeploy}
                                                disabled={deployed || generating}
                                                className={`px-8 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${deployed ? 'bg-emerald-600 text-white' : 'bg-primary-600 text-white'}`}>
                                                {deployed ? <CheckCircle className="mr-2" size={16} /> : <Send className="mr-2" size={16} />}
                                                {deployed ? 'Published Live' : 'Publish to Newsfeed'}
                                            </Button>
                                        </div>

                                        {/* Editable Fields */}
                                        <div className="space-y-4">
                                            <input
                                                className="w-full bg-transparent text-4xl font-serif font-bold text-white border-b border-transparent focus:border-earth-700 focus:outline-none pb-2 transition-colors placeholder:text-earth-700"
                                                value={draft.title}
                                                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                                            />

                                            <textarea
                                                className="w-full bg-secondary-950/20 text-secondary-200 text-lg font-medium italic border-l-4 border-secondary-500 p-4 rounded-r-xl focus:outline-none resize-none"
                                                value={draft.excerpt}
                                                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                                                rows={3}
                                            />

                                            <div className="p-6 bg-earth-950/50 rounded-3xl border border-earth-800">
                                                {/* Simple HTML Textarea for Content - Journalist can edit HTML directly or just text */}
                                                <textarea
                                                    className="w-full h-[500px] bg-transparent text-earth-300 leading-relaxed focus:outline-none resize-none font-mono text-sm"
                                                    value={draft.content}
                                                    onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="card h-full flex flex-col items-center justify-center p-20 text-center border-dashed border-2 border-earth-800/50 bg-earth-900/20 rounded-[3rem]">
                                    <div className="w-24 h-24 bg-earth-900/50 rounded-full flex items-center justify-center mb-6">
                                        <PenTool className="w-10 h-10 text-earth-600" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-earth-300 mb-2">Editorial Suite Ready</h3>
                                    <p className="text-earth-500 text-sm max-w-sm mx-auto">
                                        Enter a topic to generate a new article, or browse the archives to manage existing content.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="card border border-earth-800 bg-earth-900/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Existing Library View Implementation... */}
                        <div className="p-8">
                            <h2 className="text-2xl font-serif font-bold text-white mb-6">Archive Registry</h2>
                            <table className="w-full text-left">
                                <thead className="bg-earth-950/80 border-b border-earth-800">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-earth-500">Article</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-earth-500">Category</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-earth-500">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-earth-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-earth-800/30">
                                    {loadingLibrary ? (
                                        <tr><td colSpan={4} className="p-8 text-center text-earth-500 text-xs font-bold uppercase tracking-widest">Loading Archives...</td></tr>
                                    ) : blogs.map(blog => (
                                        <tr key={blog.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-white max-w-xs truncate">{blog.title}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-earth-400 uppercase">{blog.category}</td>
                                            <td className="px-6 py-4 text-xs text-earth-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => deleteBlog(blog.id)}
                                                    className="text-red-500 hover:text-red-400 hover:bg-red-900/20 p-2 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
