import { Metadata } from 'next'
import { Calendar, Clock, Video, MessageCircle } from 'lucide-react'
import Button from '@/components/Button'

export const metadata: Metadata = {
    title: 'Consultations - Black Moss & Herbs',
    description: 'Book a personalized herbal wellness consultation with our certified herbalists.',
}

const consultationTypes = [
    {
        id: '1',
        name: 'Initial Wellness Consultation',
        duration: 60,
        price: 89,
        description: 'Comprehensive assessment of your health goals and personalized herbal recommendations.',
        features: [
            'In-depth health history review',
            'Personalized herbal protocol',
            'Lifestyle recommendations',
            'Follow-up email support',
        ],
    },
    {
        id: '2',
        name: 'Follow-Up Consultation',
        duration: 30,
        price: 49,
        description: 'Review progress and adjust your herbal wellness plan as needed.',
        features: [
            'Progress assessment',
            'Protocol adjustments',
            'Answer questions',
            'Ongoing support',
        ],
    },
    {
        id: '3',
        name: 'Quick Question Session',
        duration: 15,
        price: 25,
        description: 'Brief consultation for specific questions about herbs or products.',
        features: [
            'Focused discussion',
            'Product recommendations',
            'Usage guidance',
            'Quick answers',
        ],
    },
]

const availableTimes = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
]

export default function ConsultationsPage() {
    return (
        <div className="py-12">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="section-title">Herbal Consultations</h1>
                    <p className="section-subtitle mx-auto">
                        Get personalized guidance from our certified herbalists
                    </p>
                </div>

                {/* Consultation Types */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {consultationTypes.map((type) => (
                        <div key={type.id} className="card p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Video className="w-6 h-6 text-primary-600" />
                                <Clock className="w-5 h-5 text-earth-500" />
                                <span className="text-earth-600">{type.duration} min</span>
                            </div>

                            <h3 className="font-serif text-2xl font-bold text-earth-900 mb-2">
                                {type.name}
                            </h3>

                            <div className="text-3xl font-bold text-primary-600 mb-4">
                                ${type.price}
                            </div>

                            <p className="text-earth-600 mb-6">
                                {type.description}
                            </p>

                            <ul className="space-y-2 mb-6">
                                {type.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-earth-700">
                                        <MessageCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button className="w-full">Book Now</Button>
                        </div>
                    ))}
                </div>

                {/* Booking Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="card p-8">
                        <h2 className="text-3xl font-serif font-bold text-earth-900 mb-8 text-center">
                            Schedule Your Consultation
                        </h2>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Full Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="input"
                                        placeholder="(555) 123-4567"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Consultation Type</label>
                                    <select className="input" required>
                                        <option value="">Select type...</option>
                                        {consultationTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name} - ${type.price}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Preferred Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            className="input"
                                            required
                                        />
                                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-earth-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Preferred Time</label>
                                    <select className="input" required>
                                        <option value="">Select time...</option>
                                        {availableTimes.map((time) => (
                                            <option key={time} value={time}>
                                                {time}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label">What would you like to discuss?</label>
                                <textarea
                                    className="input min-h-32"
                                    placeholder="Tell us about your health goals and any specific concerns..."
                                    required
                                ></textarea>
                            </div>

                            <div className="bg-earth-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-earth-900 mb-2">Important Information</h3>
                                <ul className="text-sm text-earth-600 space-y-1">
                                    <li>• Consultations are conducted via video call</li>
                                    <li>• You'll receive a confirmation email with the meeting link</li>
                                    <li>• Please arrive 5 minutes early to test your connection</li>
                                    <li>• Cancellations must be made 24 hours in advance</li>
                                </ul>
                            </div>

                            <Button type="submit" size="lg" className="w-full">
                                Book Consultation
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Meet Our Herbalists */}
                <div className="mt-20">
                    <h2 className="text-3xl font-serif font-bold text-earth-900 text-center mb-12">
                        Meet Our Herbalists
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Dr. Sarah Johnson',
                                title: 'Master Herbalist',
                                specialty: 'Women\'s Health & Hormones',
                            },
                            {
                                name: 'Michael Chen',
                                title: 'Clinical Herbalist',
                                specialty: 'Digestive Health & Immunity',
                            },
                            {
                                name: 'Dr. Amara Williams',
                                title: 'Holistic Practitioner',
                                specialty: 'Stress Management & Adaptogens',
                            },
                        ].map((herbalist, index) => (
                            <div key={index} className="card p-6 text-center">
                                <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-4xl text-white">👤</span>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-earth-900 mb-1">
                                    {herbalist.name}
                                </h3>
                                <p className="text-primary-600 font-medium mb-2">
                                    {herbalist.title}
                                </p>
                                <p className="text-sm text-earth-600">
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
