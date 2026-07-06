import Link from 'next/link';

export default function MembershipPage() {
    return (
        <div className="pt-32 pb-20 container min-h-screen">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Membership</h1>
            <p className="text-earth-300 max-w-2xl text-lg mb-12">
                Join the inner circle of Black Moss & Herbs. Access exclusive protocols, early product drops, and direct guidance from our alchemical council.
            </p>
            <div className="p-8 rounded-3xl bg-earth-900/40 border border-earth-800 backdrop-blur-xl max-w-md">
                <h2 className="text-2xl font-bold text-secondary-400 mb-4">The Circle</h2>
                <ul className="space-y-4 text-earth-200 mb-8">
                    <li className="flex items-center gap-3">
                        <span className="text-primary-500">✓</span> Monthly Consultation Credits
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-primary-500">✓</span> 15% Storewide Discount
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-primary-500">✓</span> Priority Dispatch
                    </li>
                </ul>
                <button className="w-full py-4 bg-secondary-500 hover:bg-secondary-400 text-black font-bold uppercase tracking-widest rounded-xl transition-all">
                    Apply for Access
                </button>
            </div>
        </div>
    );
}
