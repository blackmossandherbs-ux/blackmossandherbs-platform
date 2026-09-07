import SwiftUI

struct HealthBriefView: View {
    @State private var symptomsOnset = ""
    @State private var failedTreatments = ""
    @State private var dietaryCommitment = 5.0
    @State private var primaryAilments = ""
    @State private var isSaving = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 40) {
                        
                        // Header
                        VStack(alignment: .leading, spacing: 12) {
                            Text("THE MASTER's INTAKE")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)
                            
                            Text("Factual\nDiagnosis.")
                                .font(.system(size: 48, weight: .bold, design: .serif))
                                .foregroundColor(Theme.text)
                                .lineLimit(2)
                            
                            Text("To reach the Alchemist and his medical team, you must provide absolute truth.")
                                .font(.subheadline)
                                .foregroundColor(Theme.textMuted)
                                .padding(.top, 4)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 40)
                        
                        // Trigger Questions
                        VStack(alignment: .leading, spacing: 32) {
                            SectionHeader(title: "CRITICAL TRIGGER QUESTIONS")
                            
                            VStack(alignment: .leading, spacing: 12) {
                                Text("1. What is the exact root of your suffering?")
                                    .font(.headline)
                                    .foregroundColor(Theme.text)
                                Text("Describe the primary ailments, not just the symptoms.")
                                    .font(.caption)
                                    .foregroundColor(Theme.secondary)
                                
                                TextEditor(text: $primaryAilments)
                                    .frame(height: 100)
                                    .padding(12)
                                    .background(Theme.surface)
                                    .cornerRadius(16)
                                    .scrollContentBackground(.hidden)
                            }
                            
                            VStack(alignment: .leading, spacing: 12) {
                                Text("2. When did the biological breakdown begin?")
                                    .font(.headline)
                                    .foregroundColor(Theme.text)
                                
                                TextEditor(text: $symptomsOnset)
                                    .frame(height: 80)
                                    .padding(12)
                                    .background(Theme.surface)
                                    .cornerRadius(16)
                                    .scrollContentBackground(.hidden)
                            }
                            
                            VStack(alignment: .leading, spacing: 12) {
                                Text("3. What conventional treatments have failed you?")
                                    .font(.headline)
                                    .foregroundColor(Theme.text)
                                
                                TextEditor(text: $failedTreatments)
                                    .frame(height: 80)
                                    .padding(12)
                                    .background(Theme.surface)
                                    .cornerRadius(16)
                                    .scrollContentBackground(.hidden)
                            }
                            
                            VStack(alignment: .leading, spacing: 16) {
                                Text("4. Commitment to Cellular Fasting & Dietary Shift")
                                    .font(.headline)
                                    .foregroundColor(Theme.text)
                                
                                HStack {
                                    Text("Unwilling")
                                        .font(.caption)
                                        .foregroundColor(Theme.textMuted)
                                    Slider(value: $dietaryCommitment, in: 1...10, step: 1)
                                        .tint(Theme.secondary)
                                    Text("Absolute")
                                        .font(.caption)
                                        .foregroundColor(Theme.secondary)
                                }
                            }
                        }
                        .padding(.horizontal, 24)
                        
                        // Submit
                        Button(action: {}) {
                            HStack {
                                Text("SUBMIT TO THE NETWORK")
                                    .font(.system(size: 14, weight: .bold))
                                    .tracking(2)
                                Image(systemName: "cpu")
                            }
                            .foregroundColor(Theme.background)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 20)
                            .background(Theme.secondary)
                            .clipShape(Capsule())
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 20)
                        
                        Text("Your data will be analysed by our ensemble of 30 AI diagnostic models before reaching the Alchemist's human medical board.")
                            .font(.caption2)
                            .multilineTextAlignment(.center)
                            .foregroundColor(Theme.textMuted)
                            .padding(.horizontal, 40)
                        
                    }
                    .padding(.bottom, 120)
                }
            }
        }
    }
}

struct SectionHeader: View {
    let title: String
    var body: some View {
        Text(title)
            .font(.caption)
            .fontWeight(.bold)
            .tracking(4)
            .foregroundColor(Theme.textMuted)
    }
}
