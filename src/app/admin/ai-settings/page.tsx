'use client'

/**
 * Admin → AI Settings. Pick a (free) provider, paste API keys, and activate the
 * Mr. Moss guide + AI article generation. Keys rotate automatically.
 */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bot, Save, Zap, CheckCircle, AlertCircle, KeyRound } from 'lucide-react'

interface ProviderInfo {
    id: string
    label: string
    defaultModel: string
    keyHint: string
    free: boolean
    envPrefix: string
}

interface Status {
    enabled: boolean
    provider: string
    model: string
    adminKeyCount: number
    envKeyCount: number
    totalKeyCount: number
    keyPreviews: string[]
    ready: boolean
    providers: ProviderInfo[]
}

export default function AdminAISettingsPage() {
    const [status, setStatus] = useState<Status | null>(null)
    const [enabled, setEnabled] = useState(false)
    const [provider, setProvider] = useState('groq')
    const [model, setModel] = useState('')
    const [keysText, setKeysText] = useState('')
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')
    const [testing, setTesting] = useState(false)
    const [testResult, setTestResult] = useState<{ ok: boolean; text: string } | null>(null)

    const load = async () => {
        try {
            const res = await fetch('/api/admin/ai-settings')
            const d: Status = await res.json()
            setStatus(d)
            setEnabled(d.enabled)
            setProvider(d.provider)
            setModel(d.model)
        } catch {
            setError('Could not load AI settings.')
        }
    }

    useEffect(() => { load() }, [])

    const currentProvider = status?.providers.find(p => p.id === provider)

    const onProviderChange = (id: string) => {
        setProvider(id)
        const p = status?.providers.find(pr => pr.id === id)
        if (p) setModel(p.defaultModel)
    }

    const save = async () => {
        setSaving(true)
        setSaved(false)
        setError('')
        const payload: any = { enabled, provider, model }
        const lines = keysText.split('\n').map(s => s.trim()).filter(Boolean)
        if (lines.length) payload.keys = lines // only replace keys when new ones are pasted
        try {
            const res = await fetch('/api/admin/ai-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const d = await res.json()
            if (!res.ok) {
                setError(d.error || 'Save failed.')
            } else {
                setKeysText('')
                setSaved(true)
                setStatus(s => s ? { ...s, ...d } : s)
                setTimeout(() => setSaved(false), 2500)
                load()
            }
        } catch {
            setError('Network error.')
        } finally {
            setSaving(false)
        }
    }

    const runTest = async () => {
        setTesting(true)
        setTestResult(null)
        try {
            const res = await fetch('/api/admin/ai-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'test' }),
            })
            const d = await res.json()
            setTestResult(d.ok ? { ok: true, text: d.reply } : { ok: false, text: d.error || 'Test failed.' })
        } catch {
            setTestResult({ ok: false, text: 'Network error.' })
        } finally {
            setTesting(false)
        }
    }

    if (!status) {
        return <div className="min-h-screen bg-stone-950 text-stone-300 p-12">{error || 'Loading…'}</div>
    }

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 py-12">
            <div className="container max-w-3xl">
                <Link href="/admin" className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-500 text-sm font-bold uppercase tracking-widest mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to dashboard
                </Link>

                <div className="flex items-center gap-3 mb-2">
                    <Bot className="w-6 h-6 text-amber-500" />
                    <h1 className="text-4xl font-serif font-bold text-white">AI Settings</h1>
                </div>
                <p className="text-stone-400 mb-8">
                    Power the <strong className="text-white">Mr. Moss</strong> chat guide and AI article generation. Use a free provider, paste one or more keys, and switch it on. Keys rotate automatically.
                </p>

                {/* Status banner */}
                <div className={`mb-8 p-5 rounded-2xl border flex items-center gap-3 ${status.ready ? 'bg-emerald-900/20 border-emerald-800 text-emerald-300' : 'bg-stone-900/60 border-stone-800 text-stone-400'}`}>
                    {status.ready ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <div className="text-sm">
                        {status.ready
                            ? <>Mr. Moss is <strong>live</strong> on {status.provider} — {status.totalKeyCount} key{status.totalKeyCount !== 1 ? 's' : ''} in rotation ({status.envKeyCount} from env, {status.adminKeyCount} saved here).</>
                            : <>Mr. Moss is <strong>off</strong>. Add a key below and enable to activate.</>}
                    </div>
                </div>

                <div className="glass-premium p-8 space-y-7">
                    {/* Enable */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-5 w-5 rounded accent-amber-500" />
                        <span className="text-sm font-bold text-white">Enable AI (Mr. Moss chat + article generation)</span>
                    </label>

                    {/* Provider */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">Provider</label>
                        <div className="grid sm:grid-cols-2 gap-3">
                            {status.providers.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => onProviderChange(p.id)}
                                    className={`text-left p-4 rounded-xl border transition-all ${provider === p.id ? 'border-amber-500 bg-amber-500/10' : 'border-stone-700 bg-stone-900 hover:border-stone-500'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-white">{p.label}</span>
                                        {p.free && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded-full">Free</span>}
                                    </div>
                                    <div className="text-[11px] text-stone-500 mt-1">{p.keyHint}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2">Model</label>
                        <input
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder={currentProvider?.defaultModel}
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none font-mono text-sm"
                        />
                        <p className="text-[11px] text-stone-600 mt-1">Default for {currentProvider?.label}: <code>{currentProvider?.defaultModel}</code></p>
                    </div>

                    {/* Keys */}
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-2 flex items-center gap-2">
                            <KeyRound className="w-3.5 h-3.5" /> API Keys (one per line)
                        </label>
                        {status.keyPreviews.length > 0 && (
                            <p className="text-[11px] text-stone-500 mb-2">
                                {status.keyPreviews.length} saved: {status.keyPreviews.join(', ')} — paste below to replace, or leave blank to keep.
                            </p>
                        )}
                        <textarea
                            value={keysText}
                            onChange={(e) => setKeysText(e.target.value)}
                            rows={4}
                            placeholder={`Paste one or more ${currentProvider?.label || ''} keys, one per line…`}
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none font-mono text-xs"
                        />
                        <p className="text-[11px] text-stone-600 mt-1">
                            You can also set keys via env: <code>{currentProvider?.envPrefix}</code>, <code>{currentProvider?.envPrefix}_2</code>, or a comma list in <code>{currentProvider?.envPrefix}S</code>.
                        </p>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <div className="flex flex-wrap gap-3">
                        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-60">
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
                        </button>
                        <button onClick={runTest} disabled={testing} className="inline-flex items-center gap-2 px-6 py-3 border border-stone-700 hover:border-amber-500 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all disabled:opacity-60">
                            <Zap className="w-4 h-4" />
                            {testing ? 'Testing…' : 'Test Mr. Moss'}
                        </button>
                    </div>

                    {testResult && (
                        <div className={`p-4 rounded-xl border text-sm ${testResult.ok ? 'bg-emerald-900/20 border-emerald-800 text-emerald-200' : 'bg-red-900/20 border-red-800 text-red-300'}`}>
                            {testResult.ok ? <><strong>Mr. Moss says:</strong> {testResult.text}</> : <><strong>Test failed:</strong> {testResult.text}</>}
                        </div>
                    )}
                </div>

                <p className="text-xs text-stone-600 mt-6">
                    Tip: add several free keys (e.g. multiple Groq keys) — the system rotates across them so you rarely hit a rate limit.
                </p>
            </div>
        </div>
    )
}
