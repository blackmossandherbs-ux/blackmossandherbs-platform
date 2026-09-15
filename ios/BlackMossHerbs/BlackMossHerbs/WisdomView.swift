import SwiftUI

enum HerbResearchDatabase {
    // Sourced from src/data/herbResearch.ts where a citation exists. Where it
    // doesn't, we say so plainly rather than inventing one — matches the
    // web platform's own compliance stance (sanitizeWellnessContent /
    // getGlobalDisclaimer strip unverified cure/treat/diagnose claims).
    static let entries: [HerbResearchEntry] = [
        HerbResearchEntry(letter: "A", name: "Ashwagandha", origin: "India and North Africa — a staple of Ayurvedic practice for millennia",
            summary: "One of the most widely studied adaptogens; commonly used in traditional practice to support the body's response to stress. Modern research interest is real but we haven't independently verified a specific trial to cite here, so we won't invent one.",
            traditionalUse: "Traditionally taken as a root powder or tincture for stress resilience and sleep quality.",
            safetyNote: "May interact with thyroid medication and sedatives. Avoid in pregnancy. Talk to your doctor if you're on other medications.", sourceCount: 0),
        HerbResearchEntry(letter: "B", name: "Burdock Root", origin: "East Asia, historically naturalised across Europe and North America",
            summary: "A six-week human trial gave burdock root tea to adults with knee osteoarthritis and measured a significant drop in inflammatory markers (IL-6, hs-CRP) versus baseline. Lab studies back its antioxidant activity.",
            traditionalUse: "Long used as a traditional blood-purifying and skin-supporting root.",
            safetyNote: nil, sourceCount: 3),
        HerbResearchEntry(letter: "C", name: "Chamomile", origin: "Europe and Western Asia, now cultivated worldwide",
            summary: "One of the most common traditional herbs for calming and digestive comfort. Widely used in folk medicine as a bedtime tea; specific clinical citations aren't attached here.",
            traditionalUse: "Brewed as tea for relaxation, mild digestive upset, and as a gentle sleep aid.",
            safetyNote: "Can cause allergic reactions in people sensitive to ragweed, daisies, or marigolds.", sourceCount: 0),
        HerbResearchEntry(letter: "D", name: "Dandelion Root", origin: "Europe, now naturalised worldwide",
            summary: "Traditionally used as a mild diuretic and digestive bitter to support liver function. Considered a food-grade herb in most preparations.",
            traditionalUse: "Roasted root as a coffee substitute, or brewed as a bitter digestive tea before meals.",
            safetyNote: "Avoid if you have gallbladder obstruction or are on diuretic medication without medical advice.", sourceCount: 0),
        HerbResearchEntry(letter: "E", name: "Elderberry", origin: "Traditional use across Europe; commercialised research from Australia and Israel",
            summary: "A 2016 randomized, double-blind, placebo-controlled trial of 312 long-haul air travellers found elderberry extract cut cold duration by roughly two days and reduced symptom severity.",
            traditionalUse: "A long-standing cold-season remedy across European folk medicine.",
            safetyNote: "Raw, unripe berries and other plant parts are toxic — only take prepared/cooked extracts.", sourceCount: 2),
        HerbResearchEntry(letter: "F", name: "Fennel Seed", origin: "Mediterranean region, cultivated worldwide",
            summary: "A traditional digestive herb used across Mediterranean and South Asian cooking and folk medicine to ease bloating and gas.",
            traditionalUse: "Chewed whole after meals or brewed as tea for digestive comfort.",
            safetyNote: "Avoid concentrated extracts in pregnancy; can have mild estrogenic activity.", sourceCount: 0),
        HerbResearchEntry(letter: "G", name: "Ginger Root", origin: "Southeast Asia, cultivated globally",
            summary: "Widely used and studied for nausea relief, including in pregnancy-related and motion sickness contexts, with a long history of traditional digestive use.",
            traditionalUse: "Fresh, dried, or as tea for nausea, digestion, and warming circulation.",
            safetyNote: "High doses may interact with blood-thinning medication.", sourceCount: 0),
        HerbResearchEntry(letter: "H", name: "Hawthorn Berry", origin: "Europe, temperate Asia, and North America",
            summary: "A traditional European herb long associated with cardiovascular and circulatory support in folk practice.",
            traditionalUse: "Berries, leaf, and flower used in tinctures and teas for heart and circulation support.",
            safetyNote: "Can interact with heart medication (e.g. digoxin, beta-blockers) — do not combine without medical supervision.", sourceCount: 0),
        HerbResearchEntry(letter: "I", name: "Irish Moss", origin: "North Atlantic coastlines",
            summary: "The same species as our Sea Moss (Chondrus crispus) — this is simply a different regional harvest and preparation, so the same research and safety profile applies.",
            traditionalUse: "Traditionally used across coastal Ireland and Jamaica as a mineral-dense food and folk remedy.",
            safetyNote: "Naturally high in iodine — see Sea Moss for the full safety note.", sourceCount: 3),
        HerbResearchEntry(letter: "J", name: "Juniper Berry", origin: "Northern Hemisphere, widely across Europe and North America",
            summary: "Traditionally used as a mild diuretic and digestive bitter, and historically in folk medicine for urinary tract support.",
            traditionalUse: "Berries used in teas and tinctures, historically also for flavoring.",
            safetyNote: "Avoid during pregnancy and with existing kidney conditions.", sourceCount: 0),
        HerbResearchEntry(letter: "K", name: "Kava Root", origin: "South Pacific islands (Fiji, Vanuatu, Tonga)",
            summary: "Traditionally used in Pacific Island ceremonial and social practice for relaxation. Modern use has declined in several countries due to safety concerns (see note).",
            traditionalUse: "Prepared as a ceremonial drink for relaxation and social bonding.",
            safetyNote: "Linked to rare but serious liver toxicity in case reports. Avoid with any liver condition, alcohol, or other liver-metabolized medication.", sourceCount: 0),
        HerbResearchEntry(letter: "L", name: "Lavender", origin: "Mediterranean region, cultivated worldwide",
            summary: "One of the most common traditional herbs for calming and sleep support, used across aromatherapy and herbal tea traditions.",
            traditionalUse: "Used as tea, tincture, or aromatherapy for relaxation and sleep.",
            safetyNote: "Generally well tolerated; concentrated oil should never be taken internally.", sourceCount: 0),
        HerbResearchEntry(letter: "M", name: "Milk Thistle", origin: "Mediterranean region, now grown worldwide",
            summary: "One of the most studied herbs for liver support, owing to its silymarin content — a compound with a substantial body of research behind it, though we haven't attached a single verified citation here.",
            traditionalUse: "Seeds used as extract or tea, traditionally for liver and digestive support.",
            safetyNote: "Can interact with medications metabolized by the liver — check with your doctor if on prescription medication.", sourceCount: 0),
        HerbResearchEntry(letter: "N", name: "Nettle Leaf", origin: "Europe, Asia, and North America",
            summary: "A traditional folk remedy for seasonal allergy symptoms and general mineral support, rich in iron and other nutrients.",
            traditionalUse: "Cooked as a leafy green or brewed as tea, historically also as a spring tonic.",
            safetyNote: "Fresh, unprocessed nettle can sting on contact — always use dried or cooked preparations.", sourceCount: 0),
        HerbResearchEntry(letter: "O", name: "Oregano Leaf", origin: "Mediterranean region",
            summary: "Traditionally used in folk medicine for its antimicrobial reputation, alongside its long culinary history.",
            traditionalUse: "Used as tea or oil extract for digestive and immune folk remedies.",
            safetyNote: "Concentrated oil is potent — always dilute, and avoid high doses in pregnancy.", sourceCount: 0),
        HerbResearchEntry(letter: "P", name: "Peppermint Leaf", origin: "Europe, now cultivated worldwide",
            summary: "Widely used for digestive comfort, including in enteric-coated capsule form for IBS-type symptoms in some clinical contexts — we haven't attached a specific citation here.",
            traditionalUse: "Brewed as tea for bloating, indigestion, and nausea.",
            safetyNote: "Can worsen acid reflux in some people; avoid oil form near infants' faces (menthol sensitivity).", sourceCount: 0),
        HerbResearchEntry(letter: "Q", name: "Quassia Bark", origin: "Central America and the Caribbean",
            summary: "A traditional bitter tonic used across Caribbean and Central American folk medicine to stimulate digestion.",
            traditionalUse: "Bark steeped as a bitter tea before meals to support appetite and digestion.",
            safetyNote: "Very bitter in concentrated form; avoid high doses in pregnancy.", sourceCount: 0),
        HerbResearchEntry(letter: "R", name: "Rosemary Leaf", origin: "Mediterranean region",
            summary: "A traditional herb long associated with circulation and mental clarity in folk practice, alongside its long culinary use.",
            traditionalUse: "Used as tea, tincture, or culinary herb for digestion and general wellness.",
            safetyNote: "High doses of concentrated extract may not be suitable in pregnancy or with seizure conditions.", sourceCount: 0),
        HerbResearchEntry(letter: "S", name: "Sea Moss", origin: "Atlantic coastlines — the Caribbean, Ireland, and Canada's Maritimes",
            summary: "Chondrus crispus is a genuinely mineral-dense seaweed; a 2024 review in Marine Drugs found real antioxidant and anticoagulant compounds in it. It's also naturally high in iodine — one serving can carry close to double the daily safe upper limit.",
            traditionalUse: "A Caribbean and Irish coastal food tradition, prepared as a gel or added to drinks.",
            safetyNote: "High iodine content can suppress thyroid function with daily use, especially for people with existing thyroid conditions. Talk to your doctor before daily use.", sourceCount: 3),
        HerbResearchEntry(letter: "T", name: "Turmeric Root", origin: "South Asia, a cornerstone of Ayurvedic and Southeast Asian traditional medicine",
            summary: "One of the most researched botanicals for its curcumin content and anti-inflammatory reputation. The evidence base is genuinely large, but we haven't independently verified a single specific trial to cite here.",
            traditionalUse: "Used fresh, dried, or as extract across South and Southeast Asian cooking and traditional medicine.",
            safetyNote: "Can interact with blood thinners and may worsen gallstone symptoms. Poor absorption without black pepper (piperine) or fat.", sourceCount: 0),
        HerbResearchEntry(letter: "U", name: "Uva Ursi Leaf", origin: "Northern Hemisphere temperate and subarctic regions",
            summary: "A traditional folk remedy for urinary tract discomfort, used historically across European and Native American herbal practice.",
            traditionalUse: "Brewed as a short-course tea for urinary tract support.",
            safetyNote: "Not for long-term use (contains hydroquinone derivatives) — avoid in pregnancy, breastfeeding, and kidney conditions.", sourceCount: 0),
        HerbResearchEntry(letter: "V", name: "Valerian Root", origin: "Europe and Asia",
            summary: "One of the most traditionally used herbs for sleep support across European herbal practice, with a genuinely long history of use — we haven't attached a specific verified citation here.",
            traditionalUse: "Root prepared as tea, tincture, or capsule for sleep and relaxation.",
            safetyNote: "Can cause grogginess; avoid combining with sedatives or alcohol.", sourceCount: 0),
        HerbResearchEntry(letter: "W", name: "Wormwood", origin: "Europe, Asia, and North Africa",
            summary: "A traditional bitter digestive herb, historically used in small doses to stimulate appetite and digestion.",
            traditionalUse: "Used as a bitter tincture before meals in small, short-course doses.",
            safetyNote: "Contains thujone — avoid prolonged use, high doses, and use entirely in pregnancy; not for long-term daily use.", sourceCount: 0),
        HerbResearchEntry(letter: "X", name: "Xanthium (Cang Er Zi)", origin: "East Asia — a staple of Traditional Chinese Medicine",
            summary: "Used in Traditional Chinese Medicine, typically prepared (fried/processed) rather than raw, for sinus and nasal congestion support.",
            traditionalUse: "Prepared fruit used in TCM formulas for nasal and sinus complaints.",
            safetyNote: "Raw or improperly processed Xanthium has documented cases of serious liver toxicity — only prepared, correctly processed forms should ever be considered, and only under practitioner guidance.", sourceCount: 0),
        HerbResearchEntry(letter: "Y", name: "Yarrow", origin: "Europe, Asia, and North America",
            summary: "A traditional folk herb long used for its bitter digestive properties and topical wound-care reputation.",
            traditionalUse: "Used as tea for digestion, or topically (in traditional practice) for minor skin support.",
            safetyNote: "Avoid in pregnancy; can cause skin sensitivity in some people.", sourceCount: 0),
        HerbResearchEntry(letter: "Z", name: "Zedoary Root", origin: "South Asia, related to turmeric and ginger",
            summary: "A lesser-known relative of turmeric and ginger, traditionally used in South and Southeast Asian herbal medicine for digestive support.",
            traditionalUse: "Root used in traditional preparations for digestion, similar to its more famous relatives.",
            safetyNote: "Avoid in pregnancy; limited safety data at high doses.", sourceCount: 0),
    ]

    /// Best-effort match for a product's research panel, mirroring the web
    /// platform's getResearchForProduct(name, category) fallback behaviour.
    static func matching(product: Product) -> HerbResearchEntry? {
        let name = product.name.lowercased()
        if let exact = entries.first(where: { name.contains($0.name.lowercased()) }) {
            return exact
        }
        let category = product.category.lowercased()
        return entries.first(where: { category.contains($0.name.lowercased()) })
    }
}

struct WisdomView: View {
    @State private var searchText = ""

    private var filtered: [HerbResearchEntry] {
        guard !searchText.isEmpty else { return HerbResearchDatabase.entries }
        return HerbResearchDatabase.entries.filter {
            $0.name.localizedCaseInsensitiveContains(searchText) ||
            $0.summary.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 32) {

                        VStack(alignment: .leading, spacing: 8) {
                            Text("THE HERBALIST'S ALPHABET")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)

                            Text("Evidence,\nNot Hype.")
                                .font(.system(size: 48, weight: .bold, design: .serif))
                                .foregroundColor(Theme.text)

                            Text("Every letter, A to Z. Where real research exists we cite it; where it's traditional use only, we say so plainly rather than overstating it.")
                                .font(.subheadline)
                                .foregroundColor(Theme.textMuted)
                                .padding(.top, 4)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 40)

                        TextField("Search herbs...", text: $searchText)
                            .padding(14)
                            .background(Theme.surface)
                            .cornerRadius(12)
                            .foregroundColor(Theme.text)
                            .padding(.horizontal, 24)

                        LazyVStack(spacing: 12) {
                            ForEach(filtered) { entry in
                                NavigationLink(destination: WisdomDetailView(entry: entry)) {
                                    WisdomRow(entry: entry)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.horizontal, 24)

                        VStack(alignment: .leading, spacing: 12) {
                            Text("WANT A PERSONALIZED READ?")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(3)
                                .foregroundColor(Theme.textMuted)
                            Text("This glossary is educational, not a diagnosis. For guidance specific to you, book a consultation with a real herbalist from the Apothecary tab.")
                                .font(.caption)
                                .foregroundColor(Theme.textMuted)
                        }
                        .padding(20)
                        .background(Theme.surface)
                        .cornerRadius(16)
                        .padding(.horizontal, 24)
                    }
                    .padding(.bottom, 120)
                }
            }
        }
    }
}

struct WisdomRow: View {
    let entry: HerbResearchEntry

    var body: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle().fill(Theme.surface).frame(width: 44, height: 44)
                Text(String(entry.letter))
                    .font(.system(size: 18, weight: .bold, design: .serif))
                    .foregroundColor(Theme.secondary)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(entry.name)
                    .font(.subheadline).fontWeight(.semibold)
                    .foregroundColor(Theme.text)
                Text(entry.sourceCount > 0 ? "\(entry.sourceCount) sources cited" : "Traditional use — no citation attached")
                    .font(.caption2)
                    .foregroundColor(Theme.textMuted)
            }

            Spacer()
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundColor(Theme.textMuted)
        }
        .padding(16)
        .background(Theme.surface.opacity(0.5))
        .cornerRadius(16)
    }
}

struct WisdomDetailView: View {
    let entry: HerbResearchEntry

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                Text(entry.name)
                    .font(.system(size: 32, weight: .bold, design: .serif))
                    .foregroundColor(Theme.text)

                labeledBlock("ORIGIN", entry.origin)
                labeledBlock("WHAT THE RESEARCH SAYS", entry.summary)
                labeledBlock("TRADITIONAL USE", entry.traditionalUse)

                if let safetyNote = entry.safetyNote {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("⚠ SAFETY NOTE")
                            .font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.secondary)
                        Text(safetyNote)
                            .font(.subheadline)
                            .foregroundColor(Theme.textMuted)
                    }
                    .padding(16)
                    .background(Theme.surface)
                    .cornerRadius(16)
                }

                Text("Educational information only. Not intended to diagnose, treat, cure, or prevent any disease, and not a substitute for advice from a licensed doctor.")
                    .font(.caption2)
                    .foregroundColor(Theme.textMuted)
            }
            .padding(24)
            .padding(.bottom, 60)
        }
        .background(Theme.background.ignoresSafeArea())
    }

    private func labeledBlock(_ label: String, _ text: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label).font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.textMuted)
            Text(text).font(.body).foregroundColor(Theme.text)
        }
    }
}
