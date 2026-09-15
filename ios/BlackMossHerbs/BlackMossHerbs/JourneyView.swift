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

                            VStack(alignment: .leading, spacing: 12) {
                                HStack {
                                    Image(systemName: "waveform.path.ecg")
                                        .foregroundColor(Theme.textMuted)
                                    Text("No active protocol yet")
                                        .font(.headline)
                                        .foregroundColor(Theme.text)
                                }

                                Text("Complete your wellness profile or book a free consultation to get a personalized protocol from our herbalist team.")
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

                            VStack(alignment: .leading, spacing: 12) {
                                HStack {
                                    Image(systemName: "video")
                                        .foregroundColor(Theme.textMuted)
                                    Text("No consultations booked")
                                        .font(.headline)
                                        .foregroundColor(Theme.text)
                                }

                                Text("Every new member gets a free 15-minute consultation — book yours from the Apothecary tab.")
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
