import SwiftUI

struct WisdomView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 32) {
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("ANCIENT KNOWLEDGE")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)
                            
                            Text("Herbal\nWisdom.")
                                .font(.system(size: 48, weight: .bold, design: .serif))
                                .foregroundColor(Theme.text)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 40)
                        
                        // Featured Video / Lecture
                        VStack(alignment: .leading, spacing: 16) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 24)
                                    .fill(Theme.surface)
                                    .frame(height: 220)
                                
                                Image(systemName: "play.circle.fill")
                                    .font(.system(size: 64))
                                    .foregroundColor(Theme.secondary)
                            }
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text("The Science of Cellular Fasting")
                                    .font(.title3)
                                    .fontWeight(.bold)
                                    .foregroundColor(Theme.text)
                                Text("Masterclass • 45 mins")
                                    .font(.caption)
                                    .foregroundColor(Theme.secondary)
                            }
                        }
                        .padding(.horizontal, 24)
                        
                        // Articles List
                        VStack(alignment: .leading, spacing: 20) {
                            Text("CLINICAL PROTOCOLS")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.textMuted)
                                .padding(.horizontal, 24)
                            
                            ForEach(0..<4) { _ in
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
