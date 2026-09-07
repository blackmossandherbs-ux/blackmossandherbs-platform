import SwiftUI

struct JourneyView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 32) {
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("YOUR PATH")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)
                            
                            Text("Clinical\nJourney.")
                                .font(.system(size: 48, weight: .bold, design: .serif))
                                .foregroundColor(Theme.text)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 40)
                        
                        // Active Protocol
                        VStack(alignment: .leading, spacing: 16) {
                            Text("ACTIVE PROTOCOL")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.textMuted)
                            
                            VStack(alignment: .leading, spacing: 16) {
                                HStack {
                                    Image(systemName: "waveform.path.ecg")
                                        .foregroundColor(Theme.secondary)
                                    Text("Phase 1: Deep Detox")
                                        .font(.headline)
                                        .foregroundColor(Theme.text)
                                    Spacer()
                                    Text("Day 4/14")
                                        .font(.caption)
                                        .foregroundColor(Theme.secondary)
                                }
                                
                                ProgressView(value: 4, total: 14)
                                    .tint(Theme.secondary)
                                
                                Text("Focusing on lymphatic drainage and gut motility.")
                                    .font(.subheadline)
                                    .foregroundColor(Theme.textMuted)
                            }
                            .padding()
                            .background(Theme.surface)
                            .cornerRadius(16)
                        }
                        .padding(.horizontal, 24)
                        
                        // Consultations
                        VStack(alignment: .leading, spacing: 16) {
                            Text("CONSULTATIONS")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.textMuted)
                            
                            VStack(alignment: .leading, spacing: 16) {
                                HStack(alignment: .top) {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("AI Synthesis Review")
                                            .font(.headline)
                                            .foregroundColor(Theme.text)
                                        Text("Oct 12 • 2:00 PM EST")
                                            .font(.subheadline)
                                            .foregroundColor(Theme.secondary)
                                    }
                                    Spacer()
                                    Image(systemName: "video.fill")
                                        .foregroundColor(Theme.background)
                                        .padding(10)
                                        .background(Theme.secondary)
                                        .clipShape(Circle())
                                }
                                
                                Text("Your AI generated report is ready for the herbalist.")
                                    .font(.caption)
                                    .foregroundColor(Theme.textMuted)
                            }
                            .padding()
                            .background(Theme.surface)
                            .cornerRadius(16)
                        }
                        .padding(.horizontal, 24)
                    }
                    .padding(.bottom, 120)
                }
            }
        }
    }
}
