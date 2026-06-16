import ContactForm from '@/components/ContactForm'

export const metadata = {
    title: 'Contact Us - Black Moss & Herbs',
    description: 'Get in touch with the Black Moss & Herbs team about your protocol, order, or wholesale enquiry.',
}

export default function ContactPage() {
    return (
        <div className="pt-32 pb-20 container min-h-screen">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">Contact Us</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <p className="text-earth-300 text-lg mb-8">
                        Have a question about your protocol or order? Our team is ready to assist you on your journey.
                    </p>
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl bg-earth-900/40 border border-earth-800">
                            <h3 className="font-bold text-white mb-2">Customer Support</h3>
                            <p className="text-earth-400">support@blackmossandherbs.com</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-earth-900/40 border border-earth-800">
                            <h3 className="font-bold text-white mb-2">Wholesale Inquiries</h3>
                            <p className="text-earth-400">wholesale@blackmossandherbs.com</p>
                        </div>
                    </div>
                </div>
                <ContactForm />
            </div>
        </div>
    );
}
