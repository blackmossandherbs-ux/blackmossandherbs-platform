'use client';

import { useState, useEffect } from 'react';
import { Save, AlertCircle, Heart, Leaf, Activity, Loader2 } from 'lucide-react';
import Button from '@/components/Button';

export default function WellnessDashboard() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>({
        healthGoals: [],
        dietType: 'Standard',
        allergies: []
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
                    healthGoals: data.profile.healthGoals || [],
                    dietType: data.profile.dietType || 'Standard',
                    allergies: data.profile.allergies || []
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
            alert('Your biological identity has been updated.');
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
                <div className="mb-8">
                    <h1 className="font-serif text-4xl font-bold bg-gradient-to-r from-secondary-400 to-primary-400 bg-clip-text text-transparent">
                        My Ecological Data
                    </h1>
                    <p className="text-earth-400 mt-2">
                        Your biological profile helps The Alchemist and our Clinical Herbalists design personalized protocols for you.
                        This data is encrypted and strictly private.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Goals Section */}
                    <div className="card p-8 bg-earth-900/40 border-earth-800 backdrop-blur-xl">
                        <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                            <Heart className="text-primary-500 w-5 h-5" /> Wellness Goals
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {[
                                'Gut Health', 'Energy & Vitality', 'Weight Management',
                                'Hormonal Balance', 'Skin Clarity', 'Mental Focus',
                                'Immunity', 'Detoxification'
                            ].map(goal => (
                                <button
                                    key={goal}
                                    onClick={() => toggleGoal(goal)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${profile.healthGoals.includes(goal)
                                            ? 'bg-primary-900/50 border-primary-500 text-primary-300'
                                            : 'bg-earth-950/50 border-earth-800 text-earth-500 hover:border-earth-600'
                                        }`}
                                >
                                    {goal}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Diet Section */}
                    <div className="card p-8 bg-earth-900/40 border-earth-800 backdrop-blur-xl">
                        <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                            <Leaf className="text-secondary-500 w-5 h-5" /> Dietary Style
                        </h2>
                        <select
                            value={profile.dietType}
                            onChange={(e) => setProfile({ ...profile, dietType: e.target.value })}
                            className="w-full bg-earth-950 border border-earth-700 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none"
                        >
                            <option value="Standard">Standard / Omnivore</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Vegan">Vegan / Plant-Based</option>
                            <option value="Alkaline">Dr. Sebi Alkaline</option>
                            <option value="Keto">Keto / Low Carb</option>
                            <option value="Gluten-Free">Gluten-Free</option>
                        </select>
                        <p className="text-xs text-earth-500 mt-4">
                            * We primarily recommend Alkaline & Plant-Based transitions for maximum restoration.
                        </p>
                    </div>

                    {/* Allergies Section */}
                    <div className="card p-8 bg-earth-900/40 border-earth-800 backdrop-blur-xl md:col-span-2">
                        <h2 className="text-xl font-serif font-bold text-white mb-6 flex items-center gap-2">
                            <AlertCircle className="text-red-400 w-5 h-5" /> Sensitivities & Allergies
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {[
                                'Nuts', 'Shellfish', 'Gluten', 'Dairy', 'Soy',
                                'Latex', 'Pollen', 'None Known'
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

                    <div className="md:col-span-2 flex justify-end">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary-900/20"
                        >
                            {saving ? (
                                <><Loader2 className="animate-spin mr-2" /> Saving Data...</>
                            ) : (
                                <><Save className="mr-2" /> Update Biological Profile</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
