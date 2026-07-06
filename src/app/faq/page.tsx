export default function FAQPage() {
    return (
        <div className="pt-32 pb-20 container min-h-screen">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">Frequently Asked Questions</h1>
            <div className="space-y-6 max-w-3xl">
                {[
                    { q: "How do I use Sea Moss Gel?", a: "Take 1-2 tablespoons daily. You can eat it directly, or mix it into smoothies, teas, and soups." },
                    { q: "Is your Sea Moss wildcrafted?", a: "Yes. We strictly source wildcrafted Chondrus Crispus and Gracilaria from protected Atlantic waters. We never use pool-grown moss." },
                    { q: "What is the shelf life?", a: "Refrigerated gel lasts 3-4 weeks. Dried moss lasts up to 1 year when stored in a cool, dark place." },
                    { q: "Do you ship internationally?", a: "Currently we ship to the UK, EU, and USA. International shipping times may vary." }
                ].map((item, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-earth-900/40 border border-earth-800">
                        <h3 className="font-bold text-white text-lg mb-2">{item.q}</h3>
                        <p className="text-earth-400">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
