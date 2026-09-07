import SwiftUI

struct HomeView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(spacing: 40) {
                        
                        // Premium Hero
                        ZStack(alignment: .bottomLeading) {
                            Image(systemName: "photo.fill")
                                .resizable()
                                .scaledToFill()
                                .frame(height: 500)
                                .frame(maxWidth: .infinity)
                                .clipped()
                                .overlay(
                                    LinearGradient(
                                        gradient: Gradient(colors: [Color.black.opacity(0.1), Theme.background]),
                                        startPoint: .center,
                                        endPoint: .bottom
                                    )
                                )
                                .overlay(
                                    Theme.primary.opacity(0.3) // Subtle earthy tint
                                )
                            
                            VStack(alignment: .leading, spacing: 12) {
                                Text("WILD CRAFTED")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .tracking(6)
                                    .foregroundColor(Theme.secondary)
                                
                                Text("Biological\nGold.")
                                    .font(.system(size: 56, weight: .bold, design: .serif))
                                    .foregroundColor(Theme.text)
                                    .lineLimit(2)
                            }
                            .padding(24)
                        }
                        
                        // Featured Collection (Horizontal Scroll)
                        VStack(alignment: .leading, spacing: 20) {
                            HStack {
                                Text("THE APOTHECARY")
                                    .font(.system(size: 14, weight: .bold, design: .serif))
                                    .tracking(4)
                                    .foregroundColor(Theme.text)
                                Spacer()
                                Text("View All")
                                    .font(.caption)
                                    .foregroundColor(Theme.textMuted)
                            }
                            .padding(.horizontal, 24)
                            
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 20) {
                                    ForEach(0..<4) { _ in
                                        ProductCard()
                                    }
                                }
                                .padding(.horizontal, 24)
                            }
                        }
                        
                        // Premium CTA for Consultation
                        VStack(spacing: 20) {
                            Text("1-ON-1 HOLISTIC CONSULTATION")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)
                            
                            Text("Let our AI synthesize your profile for the Herbalist.")
                                .font(.system(size: 24, weight: .medium, design: .serif))
                                .multilineTextAlignment(.center)
                                .foregroundColor(Theme.text)
                                .padding(.horizontal, 40)
                            
                            Button(action: {}) {
                                Text("BEGIN ASSESSMENT")
                                    .font(.system(size: 14, weight: .bold))
                                    .tracking(2)
                                    .foregroundColor(Theme.background)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 20)
                                    .background(Theme.secondary)
                                    .clipShape(Capsule())
                            }
                            .padding(.horizontal, 40)
                            .padding(.top, 16)
                        }
                        .padding(.vertical, 60)
                        
                    }
                    .padding(.bottom, 100) // Tab bar clearance
                }
                .edgesIgnoringSafeArea(.top)
            }
        }
    }
}

struct ProductCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            ZStack {
                RoundedRectangle(cornerRadius: 24)
                    .fill(Theme.surface)
                    .frame(width: 260, height: 320)
                
                Image(systemName: "leaf")
                    .font(.system(size: 60))
                    .foregroundColor(Theme.primary.opacity(0.8))
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text("St. Lucia Sea Moss")
                    .font(.system(size: 18, weight: .semibold, design: .serif))
                    .foregroundColor(Theme.text)
                Text("£45.00")
                    .font(.subheadline)
                    .foregroundColor(Theme.secondary)
            }
        }
    }
}
