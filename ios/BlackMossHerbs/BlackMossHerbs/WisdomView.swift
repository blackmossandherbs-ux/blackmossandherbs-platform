import SwiftUI

struct WisdomView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 40) {
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("THE TRUTH")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)
                            
                            Text("Case\nStudies.")
                                .font(.system(size: 48, weight: .bold, design: .serif))
                                .foregroundColor(Theme.text)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 40)
                        
                        // Case Studies Carousel
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 20) {
                                CaseStudyCard(
                                    disease: "Fibroids & PCOS",
                                    quote: "\"After 3 years of failed IVF, the 90-day alkaline detox and sea moss protocol completely shrank the masses.\"",
                                    name: "Sarah M., UK"
                                )
                                CaseStudyCard(
                                    disease: "Chronic Inflammation",
                                    quote: "\"The Master's blend was the only thing that allowed me to walk without arthritis pain. The truth is in the herbs.\"",
                                    name: "James T., Jamaica"
                                )
                                CaseStudyCard(
                                    disease: "Lupus Auto-immune",
                                    quote: "\"My medical doctors were stunned. The biological profile AI caught what they missed, and the Alchemist's team fixed it.\"",
                                    name: "Elena R., USA"
                                )
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
                            
                            ForEach(0..<3) { _ in
                                HStack(spacing: 16) {
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(Theme.surface)
                                        .frame(width: 80, height: 80)
                                        .overlay(Image(systemName: "leaf.arrow.triangle.circlepath").foregroundColor(Theme.secondary))
                                    
                                    VStack(alignment: .leading, spacing: 6) {
                                        Text("Reversing Iron Deficiency")
                                            .font(.headline)
                                            .foregroundColor(Theme.text)
                                        Text("Understanding the role of Sarsaparilla and Burdock Root in blood oxidization.")
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

struct CaseStudyCard: View {
    let disease: String
    let quote: String
    let name: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(disease)
                .font(.headline)
                .foregroundColor(Theme.secondary)
            
            Text(quote)
                .font(.system(size: 18, weight: .regular, design: .serif))
                .foregroundColor(Theme.text)
                .italic()
            
            Spacer()
            
            Text("— \(name)")
                .font(.caption)
                .fontWeight(.bold)
                .foregroundColor(Theme.textMuted)
        }
        .padding(24)
        .frame(width: 300, height: 260)
        .background(Theme.surface)
        .cornerRadius(24)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Theme.secondary.opacity(0.3), lineWidth: 1)
        )
    }
}
