export default function LibraryPage() {
    return (
        <div className="pt-32 pb-20 container min-h-screen">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Digital Library</h1>
            <p className="text-earth-300 max-w-2xl text-lg mb-12">
                A repository of biological wisdom. Download protocols, meal plans, and alchemical guides directly to your device.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Placeholders */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[3/4] rounded-3xl bg-earth-900/40 border border-earth-800 flex items-center justify-center p-8 text-center group hover:bg-earth-800/60 transition-colors cursor-pointer">
                        <div>
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📜</div>
                            <h3 className="font-bold text-white mb-2">Protocol Vol. {i}</h3>
                            <p className="text-sm text-earth-400">Biological Frameworks</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
