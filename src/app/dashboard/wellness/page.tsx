'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Leaf, Heart, AlertCircle, Save, Loader2, FileText, Activity, Droplets } from 'lucide-react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function HolisticProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Comprehensive NHS-style holistic intake form
    const [profile, setProfile] = useState<any>({
        healthGoals: [],
        dietType: 'Standard',
        allergies: [],
        primaryAilments: '',
        currentMedications: '',
        digestion: 'Regular',
        sleepHours: '6-8',
        stressLevel: 'Moderate'
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/wellness');
            const data = await res.json();
            if (data.profile) {
                setProfile({
                    ...profile,
                    ...data.profile
                });
            }
        } catch (error) {
            console.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('/api/user/wellness', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });
            alert('Your Clinical Health Brief has been updated and securely stored.');
        } catch (error) {
            alert('Error updating profile.');
        } finally {
            setSaving(false);
        }
    };

    const toggleGoal = (goal: string) => {
        const goals = profile.healthGoals.includes(goal)
            ? profile.healthGoals.filter((g: string) => g !== goal)
            : [...profile.healthGoals, goal];
        setProfile({ ...profile, healthGoals: goals });
    };

    const toggleAllergy = (allergy: string) => {
        const allergies = profile.allergies.includes(allergy)
            ? profile.allergies.filter((a: string) => a !== allergy)
            : [...profile.allergies, allergy];
        setProfile({ ...profile, allergies: allergies });
    };

    if (loading) return (
        <div className="min-h-screen bg-earth-950 flex items-center justify-center">
            <Loader2 className="animate-spin text-secondary-500 w-8 h-8" />
        </div>
    );

    return (
        <div className="py-12 bg-earth-950 min-h-screen">
            <div className="container max-w-4xl">
                <div className="mb-12 border-b border-earth-800 pb-8">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary-500 mb-4">Patient Intake Form</div>
                    <h1 className="font-serif text-4xl font-bold text-white mb-4">
                        Clinical Health Brief
                    </h1>
                    <p className="text-earth-400 text-lg leading-relaxed max-w-2xl">
                        Like an NHS record, but for your holistic health. The more comprehensive information you provide, the better our AI and Clinical Herbalists can personalize your consultation and protocol.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Primary Medical Section */}
                    <div className="card p-8 bg-earth-900/40 border-earth-800 backdrop-blur-xl">
                        <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                            <Activity className="text-primary-500 w-5 h-5" /> Medical History & Ailments
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-earth-300 mb-2 uppercase tracking-widest">Primary Conditions</label>
                                <p className="text-xs text-earth-500 mb-3">Please list any chronic conditions (e.g., Arthritis, PCOS, Cancer, Hypertension, Eczema) or areas of acute pain.</p>
                                <textarea 
                                    value={profile.primaryAilments}
                                    onChange={(e) => setProfile({...profile, primaryAilments: e.target.value})}
                                    className="w-full bg-earth-950 border border-earth-700 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none h-24"
                                    placeholder="Describe your current health challenges..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-earth-300 mb-2 uppercase tracking-widest">Current Medications & Supplements</label>
                                <p className="text-xs text-earth-500 mb-3">Crucial for checking herb-drug interactions.</p>
                                <textarea 
                                    value={profile.currentMedications}
                                    onChange={(e) => setProfile({...profile, currentMedications: e.target.value})}
                                    className="w-full bg-earth-950 border border-earth-700 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none h-24"
                                    placeholder="List any prescriptions or supplements you currently take..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lifestyle & Digestion Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="card p-8 bg-earth-900/40 border-earth-800 backdrop-blur-xl">
                            <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                                <Leaf className="text-secondary-500 w-5 h-5" /> Diet & Digestion
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-earth-400 mb-2 uppercase tracking-widest">Dietary Style</label>
                                    <select
                                        value={profile.dietType}
                                        onChange={(e) => setProfile({ ...profile, dietType: e.target.value })}
                                        className="w-full bg-earth-950 border border-earth-700 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none"
                                    >
                                        <option value="Standard">Standard / Omnivore</option>
                                        <option value="Vegetarian">Vegetarian</option>
                                        <option value="Vegan">Vegan / Plant-Based</option>
                                        <option value="Alkaline">Alkaline / Electric</option>
                                        <option value="Keto">Keto / Low Carb</option>
                                        <option value="Gluten-Free">Gluten-Free</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-earth-400 mb-2 uppercase tracking-widest">Bowel Regularity</label>
                                    <select
                                        value={profile.digestion}
                                        onChange={(e) => setProfile({ ...profile, digestion: e.target.value })}
                                        className="w-full bg-earth-950 border border-earth-700 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none"
                                    >
                                        <option value="Regular">Regular (1-3 times daily)</option>
                                        <option value="Sluggish">Sluggish (Every few days)</option>
                                        <option value="Constipated">Constipated</option>
                                        <option value="Loose">Loose / IBS-D</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="card p-8 bg-earth-900/40 border-earth-800 backdrop-blur-xl">
                            <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                                <Droplets className="text-blue-400 w-5 h-5" /> Lifestyle Factors
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-earth-400 mb-2 uppercase tracking-widest">Average Sleep</label>
                                    <select
                                        value={profile.sleepHours}
                                        onChange={(e) => setProfile({ ...profile, sleepHours: e.target.value })}
                                        className="w-full bg-earth-950 border border-earth-700 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none"
                                    >
                                        <option value="Under 4">Under 4 hours</option>
                                        <option value="4-6">4-6 hours</option>
                                        <option value="6-8">6-8 hours</option>
                                        <option value="8+">8+ hours</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-earth-400 mb-2 uppercase tracking-widest">Stress Levels</label>
                                    <select
                                        value={profile.stressLevel}
                                        onChange={(e) => setProfile({ ...profile, stressLevel: e.target.value })}
                                        className="w-full bg-earth-950 border border-earth-700 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none"
                                    >
                                        <option value="Low">Low / Managed</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="High">High / Overwhelmed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Allergies Section */}
                    <div className="card p-8 bg-earth-900/40 border-earth-800 backdrop-blur-xl">
                        <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-3">
                            <AlertCircle className="text-red-400 w-5 h-5" /> Sensitivities & Allergies
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {[
                                'Nuts', 'Shellfish', 'Gluten', 'Dairy', 'Soy',
                                'Latex', 'Pollen', 'Nightshades', 'None Known'
                            ].map(allergy => (
                                <button
                                    key={allergy}
                                    onClick={() => toggleAllergy(allergy)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${profile.allergies.includes(allergy)
                                            ? 'bg-red-900/20 border-red-500 text-red-300'
                                            : 'bg-earth-950/50 border-earth-800 text-earth-500 hover:border-earth-600'
                                        }`}
                                >
                                    {allergy}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-8 p-8 bg-gradient-to-r from-primary-950/50 to-secondary-950/50 border border-primary-900/50 rounded-2xl">
                        <div>
                            <h3 className="text-xl font-serif font-bold text-white mb-2">Ready for your Consultation?</h3>
                            <p className="text-sm text-earth-400 max-w-md">Once your brief is saved, our AI will synthesize your data into a clinical report for your free 15-minute consultation via the app.</p>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-earth-800 hover:bg-earth-700 text-white font-bold px-8 py-4 rounded-xl flex-1 sm:flex-none"
                            >
                                {saving ? (
                                    <><Loader2 className="animate-spin mr-2" /> Saving...</>
                                ) : (
                                    <><Save className="mr-2" /> Save Brief</>
                                )}
                            </Button>
                            <Link href="/consultations" className="flex-1 sm:flex-none">
                                <Button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-primary-900/20 text-xs">
                                    Book Consult
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
