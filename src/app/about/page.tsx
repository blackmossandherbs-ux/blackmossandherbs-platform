export default function AboutPage() {
    return (
        <div className="pt-32 pb-20 container min-h-screen">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">About Us</h1>
            <div className="prose prose-invert prose-lg max-w-3xl">
                <p className="text-xl text-earth-300 leading-relaxed">
                    Black Moss & Herbs is not just a brand; it is a return to biological authority. Founded on the principles of alkaline restoration and intracellular cleansing, we provide the tools to realign your vessel with nature&apos;s frequency.
                </p>
                <p className="text-earth-400">
                    Our Sea Moss is wildcrafted from the pristine waters of the Atlantic, ensuring maximum mineral density. Our herbs are sourced with clinical precision, free from hybrids and chemical interference.
                </p>
                <div className="my-12 p-8 border-l-4 border-secondary-500 bg-earth-900/30">
                    <p className="font-serif italic text-2xl text-secondary-400">&quot;Nature requires no improvement, only alignment.&quot;</p>
                </div>
            </div>
        </div>
    );
}
