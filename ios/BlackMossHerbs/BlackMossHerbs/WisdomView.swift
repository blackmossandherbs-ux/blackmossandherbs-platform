import SwiftUI

struct HerbResearchEntry: Identifiable {
    let id = UUID()
    let name: String
    let origin: String
    let summary: String
    let safetyNote: String?
    let sourceCount: Int
}

struct WisdomProtocolItem: Identifiable {
    let id = UUID()
    let number: String
    let title: String
    let detail: String
}

struct WisdomView: View {
    // Sourced from src/data/herbResearch.ts — only cite a study that was
    // actually found and read. If evidence is thin, say so.
    static let research: [HerbResearchEntry] = [
        HerbResearchEntry(
            name: "Sea Moss",
            origin: "Atlantic coastlines — the Caribbean, Ireland, and Canada's Maritimes",
            summary: "Chondrus crispus is a genuinely mineral-dense seaweed; a 2024 review in Marine Drugs found real antioxidant and anticoagulant compounds in it. It's also naturally high in iodine — one serving can carry close to double the daily safe upper limit.",
            safetyNote: "High iodine content can suppress thyroid function with daily use, especially for people with existing thyroid conditions. Talk to your doctor before daily use.",
            sourceCount: 3
        ),
        HerbResearchEntry(
            name: "Burdock Root",
            origin: "East Asia, historically naturalised across Europe and North America",
            summary: "A six-week human trial gave burdock root tea to adults with knee osteoarthritis and measured a significant drop in inflammatory markers (IL-6, hs-CRP) versus baseline. Lab studies back its antioxidant activity.",
            safetyNote: nil,
            sourceCount: 3
        ),
        HerbResearchEntry(
            name: "Elderberry",
            origin: "Traditional use across Europe; commercialised research from Australia and Israel",
            summary: "A 2016 randomized, double-blind, placebo-controlled trial of 312 long-haul air travellers found elderberry extract cut cold duration by roughly two days and reduced symptom severity.",
            safetyNote: nil,
            sourceCount: 2
        ),
    ]

    static let protocols: [WisdomProtocolItem] = [
        WisdomProtocolItem(number: "01", title: "Reversing Iron Deficiency", detail: "Understanding the role of Sarsaparilla and Burdock Root in blood oxidization."),
        WisdomProtocolItem(number: "02", title: "Restoring Gut Motility", detail: "How bladderwrack and dandelion root support lymphatic drainage."),
        WisdomProtocolItem(number: "03", title: "Calming Chronic Inflammation", detail: "Clinical notes on chaparral and burdock for joint and tissue recovery."),
    ]

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 40) {

                        VStack(alignment: .leading, spacing: 8) {
                            Text("THE RESEARCH")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)

                            Text("Evidence,\nNot Hype.")
                                .font(.system(size: 48, weight: .bold, design: .serif))
                                .foregroundColor(Theme.text)

                            Text("Every herb we sell is backed by a source you can check yourself. If evidence is thin, we say so.")
                                .font(.subheadline)
                                .foregroundColor(Theme.textMuted)
                                .padding(.top, 4)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 40)

                        // Herb Research Carousel
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 20) {
                                ForEach(Self.research) { entry in
                                    ResearchCard(entry: entry)
                                }
                            }
                            .padding(.horizontal, 24)
                        }

                        // Clinical Protocols List
                        VStack(alignment: .leading, spacing: 20) {
                            Text("CLINICAL PROTOCOLS")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.textMuted)
                                .padding(.horizontal, 24)

                            ForEach(Self.protocols) { item in
                                HStack(spacing: 16) {
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(Theme.surface)
                                        .frame(width: 80, height: 80)
                                        .overlay(
                                            Text(item.number)
                                                .font(.system(size: 20, weight: .semibold, design: .serif))
                                                .foregroundColor(Theme.secondary)
                                        )

                                    VStack(alignment: .leading, spacing: 6) {
                                        Text(item.title)
                                            .font(.headline)
                                            .foregroundColor(Theme.text)
                                        Text(item.detail)
                                            .font(.caption)
                                            .foregroundColor(Theme.textMuted)
                                            .lineLimit(2)
                                    }
                                }
                                .padding(.horizontal, 24)
                            }
                        }
                    }
                    .padding(.bottom, 120)
                }
            }
        }
    }
}

struct ResearchCard: View {
    let entry: HerbResearchEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(entry.name)
                .font(.system(size: 20, weight: .semibold, design: .serif))
                .foregroundColor(Theme.secondary)

            Text(entry.origin)
                .font(.caption2)
                .foregroundColor(Theme.textMuted)

            Text(entry.summary)
                .font(.system(size: 14, weight: .regular))
                .foregroundColor(Theme.text)
                .lineLimit(6)

            Spacer()

            if let safetyNote = entry.safetyNote {
                Text("⚠ \(safetyNote)")
                    .font(.caption2)
                    .foregroundColor(Theme.textMuted)
                    .lineLimit(3)
            }

            Text("\(entry.sourceCount) sources cited")
                .font(.caption2)
                .fontWeight(.bold)
                .foregroundColor(Theme.textMuted)
        }
        .padding(24)
        .frame(width: 300, height: 300)
        .background(Theme.surface)
        .cornerRadius(24)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Theme.secondary.opacity(0.3), lineWidth: 1)
        )
    }
}
