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
                <form className="space-y-6 bg-earth-900/20 p-8 rounded-3xl border border-earth-800">
                    <div>
                        <label className="block text-sm font-bold text-earth-400 mb-2">Name</label>
                        <input type="text" className="w-full bg-earth-950 border border-earth-800 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none" placeholder="Your Name" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-earth-400 mb-2">Email</label>
                        <input type="email" className="w-full bg-earth-950 border border-earth-800 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none" placeholder="your@email.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-earth-400 mb-2">Message</label>
                        <textarea rows={4} className="w-full bg-earth-950 border border-earth-800 rounded-xl px-4 py-3 text-white focus:border-secondary-500 outline-none" placeholder="How can we assist?" />
                    </div>
                    <button className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all">Send Message</button>
                </form>
            </div>
        </div>
    );
}
