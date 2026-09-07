import SwiftUI

struct HealthBriefView: View {
    @State private var starSign = "Taurus"
    @State private var budget = 100.0
    @State private var aiPersona = "Clinical Alchemist"
    
    let signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
    let personas = ["Clinical Alchemist", "Root Doctor", "Scientific Herbalist"]
    
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 40) {
                        
                        // Header
                        VStack(alignment: .leading, spacing: 12) {
                            Text("CLINICAL INTAKE")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)
                            
                            Text("Holistic\nProfile.")
                                .font(.system(size: 48, weight: .bold, design: .serif))
                                .foregroundColor(Theme.text)
                                .lineLimit(2)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 40)
                        
                        // AI & Astrological Alignment
                        VStack(alignment: .leading, spacing: 24) {
                            SectionHeader(title: "COSMIC & AI ALIGNMENT")
                            
                            HStack {
                                Text("Star Sign")
                                    .foregroundColor(Theme.textMuted)
                                Spacer()
                                Picker("Sign", selection: $starSign) {
                                    ForEach(signs, id: \.self) { sign in
                                        Text(sign).tag(sign)
                                    }
                                }
                                .tint(Theme.secondary)
                            }
                            .padding()
                            .background(Theme.surface)
                            .cornerRadius(16)
                            
                            VStack(alignment: .leading, spacing: 12) {
                                Text("AI Synthesis Persona")
                                    .foregroundColor(Theme.textMuted)
                                
                                Picker("Persona", selection: $aiPersona) {
                                    ForEach(personas, id: \.self) { persona in
                                        Text(persona).tag(persona)
                                    }
                                }
                                .pickerStyle(.segmented)
                            }
                            .padding()
                            .background(Theme.surface)
                            .cornerRadius(16)
                        }
                        .padding(.horizontal, 24)
                        
                        // Budget
                        VStack(alignment: .leading, spacing: 16) {
                            SectionHeader(title: "MONTHLY WELLNESS BUDGET")
                            
                            VStack(alignment: .leading) {
                                HStack {
                                    Text("£\(Int(budget))")
                                        .font(.system(size: 32, weight: .bold, design: .serif))
                                        .foregroundColor(Theme.secondary)
                                    Spacer()
                                }
                                
                                Slider(value: $budget, in: 50...500, step: 10)
                                    .tint(Theme.secondary)
                            }
                            .padding()
                            .background(Theme.surface)
                            .cornerRadius(16)
                        }
                        .padding(.horizontal, 24)
                        
                        // Clinical Needs
                        VStack(alignment: .leading, spacing: 16) {
                            SectionHeader(title: "CLINICAL NEEDS")
                            
                            NavigationLink(destination: Text("Ailments Detailed Form")) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("Primary Ailments & Genetics")
                                            .foregroundColor(Theme.text)
                                        Text("Tap to define conditions")
                                            .font(.caption)
                                            .foregroundColor(Theme.textMuted)
                                    }
                                    Spacer()
                                    Image(systemName: "chevron.right")
                                        .foregroundColor(Theme.secondary)
                                }
                                .padding()
                                .background(Theme.surface)
                                .cornerRadius(16)
                            }
                            
                            NavigationLink(destination: Text("Biometrics Form")) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("Digestion, Sleep & Stress")
                                            .foregroundColor(Theme.text)
                                        Text("Daily biometrics")
                                            .font(.caption)
                                            .foregroundColor(Theme.textMuted)
                                    }
                                    Spacer()
                                    Image(systemName: "chevron.right")
                                        .foregroundColor(Theme.secondary)
                                }
                                .padding()
                                .background(Theme.surface)
                                .cornerRadius(16)
                            }
                        }
                        .padding(.horizontal, 24)
                        
                        // Submit
                        Button(action: {}) {
                            Text("GENERATE SYNTHESIS")
                                .font(.system(size: 14, weight: .bold))
                                .tracking(2)
                                .foregroundColor(Theme.background)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 20)
                                .background(Theme.secondary)
                                .clipShape(Capsule())
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 20)
                        
                    }
                    .padding(.bottom, 100)
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
