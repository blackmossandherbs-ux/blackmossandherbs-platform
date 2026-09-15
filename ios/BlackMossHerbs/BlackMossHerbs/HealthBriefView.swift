import SwiftUI

struct HealthBriefView: View {
    @State private var healthGoals: Set<String> = []
    @State private var dietType = dietOptions[0]
    @State private var allergies: Set<String> = []
    @State private var primaryAilments = ""
    @State private var currentMedications = ""
    @State private var digestion = digestionOptions[0]
    @State private var sleepHours = sleepOptions[2]
    @State private var stressLevel = stressOptions[1]

    @State private var isLoading = true
    @State private var isSaving = false
    @State private var errorMessage: String?
    @State private var showAuth = false
    @State private var didSave = false

    private var isSignedIn: Bool { APIService.shared.isSignedIn }

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                if !isSignedIn {
                    signInPrompt
                } else {
                    ScrollView(.vertical, showsIndicators: false) {
                        VStack(alignment: .leading, spacing: 40) {

                            VStack(alignment: .leading, spacing: 12) {
                                Text("YOUR WELLNESS PROFILE")
                                    .font(.caption).fontWeight(.bold).tracking(4).foregroundColor(Theme.secondary)
                                Text("Tell Us\nThe Truth.")
                                    .font(.system(size: 48, weight: .bold, design: .serif))
                                    .foregroundColor(Theme.text)
                                    .lineLimit(2)
                                Text("Our herbalist team uses your answers to recommend a protocol — not to diagnose. Always see a doctor for medical concerns.")
                                    .font(.subheadline)
                                    .foregroundColor(Theme.textMuted)
                                    .padding(.top, 4)
                            }
                            .padding(.horizontal, 24)
                            .padding(.top, 40)

                            if isLoading {
                                ProgressView().frame(maxWidth: .infinity).padding(.vertical, 40)
                            } else {
                                VStack(alignment: .leading, spacing: 28) {
                                    fieldBlock("PRIMARY AILMENTS OR SYMPTOMS") {
                                        TextEditor(text: $primaryAilments).frame(height: 100).scrollContentBackground(.hidden)
                                    }
                                    fieldBlock("CURRENT MEDICATIONS OR SUPPLEMENTS") {
                                        TextEditor(text: $currentMedications).frame(height: 80).scrollContentBackground(.hidden)
                                    }

                                    VStack(alignment: .leading, spacing: 12) {
                                        SectionHeader(title: "HEALTH GOALS")
                                        chipGrid(healthGoalOptions, selection: $healthGoals)
                                    }

                                    VStack(alignment: .leading, spacing: 12) {
                                        SectionHeader(title: "ALLERGIES")
                                        chipGrid(allergyOptions, selection: $allergies)
                                    }

                                    pickerBlock("DIET TYPE", $dietType, dietOptions)
                                    pickerBlock("DIGESTION", $digestion, digestionOptions)
                                    pickerBlock("SLEEP (HOURS/NIGHT)", $sleepHours, sleepOptions)
                                    pickerBlock("STRESS LEVEL", $stressLevel, stressOptions)
                                }
                                .padding(.horizontal, 24)

                                if let errorMessage {
                                    Text(errorMessage).font(.caption).foregroundColor(.red).padding(.horizontal, 24)
                                }
                                if didSave {
                                    Text("Saved to your profile.").font(.caption).foregroundColor(Theme.secondary).padding(.horizontal, 24)
                                }

                                Button(action: save) {
                                    HStack {
                                        if isSaving { ProgressView().tint(Theme.background) } else {
                                            Text("SUBMIT YOUR PROFILE").font(.system(size: 14, weight: .bold)).tracking(2)
                                            Image(systemName: "arrow.up.circle")
                                        }
                                    }
                                    .foregroundColor(Theme.background)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 20)
                                    .background(Theme.secondary)
                                    .clipShape(Capsule())
                                }
                                .disabled(isSaving)
                                .padding(.horizontal, 24)
                                .padding(.top, 20)

                                Text("Your answers go directly to our herbalist team and are saved to your account's wellness profile.")
                                    .font(.caption2)
                                    .multilineTextAlignment(.center)
                                    .foregroundColor(Theme.textMuted)
                                    .padding(.horizontal, 40)
                            }
                        }
                        .padding(.bottom, 120)
                    }
                }
            }
        }
        .task { await loadIfSignedIn() }
        .sheet(isPresented: $showAuth) {
            AuthView(onAuthenticated: {
                showAuth = false
                Task { await loadIfSignedIn() }
            })
        }
    }

    private var signInPrompt: some View {
        VStack(spacing: 16) {
            Image(systemName: "waveform.path.ecg").font(.system(size: 40)).foregroundColor(Theme.textMuted)
            Text("Sign in to build your wellness profile")
                .font(.headline).foregroundColor(Theme.text)
            Text("This becomes part of your account, so our herbalist team and your future consultations can see it.")
                .font(.subheadline).foregroundColor(Theme.textMuted)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            Button(action: { showAuth = true }) {
                Text("SIGN IN").font(.system(size: 13, weight: .bold)).tracking(2)
                    .foregroundColor(Theme.background)
                    .padding(.horizontal, 24).padding(.vertical, 12)
                    .background(Theme.secondary)
                    .clipShape(Capsule())
            }
        }
        .padding()
    }

    private func loadIfSignedIn() async {
        guard isSignedIn else { isLoading = false; return }
        isLoading = true
        if let profile = try? await APIService.shared.getWellnessProfile() {
            healthGoals = Set(profile.healthGoals)
            dietType = profile.dietType ?? dietType
            allergies = Set(profile.allergies)
            primaryAilments = profile.primaryAilments ?? ""
            currentMedications = profile.currentMedications ?? ""
            digestion = profile.digestion ?? digestion
            sleepHours = profile.sleepHours ?? sleepHours
            stressLevel = profile.stressLevel ?? stressLevel
        }
        isLoading = false
    }

    private func save() {
        isSaving = true
        errorMessage = nil
        didSave = false
        let profile = BiologicalProfile(
            healthGoals: Array(healthGoals),
            dietType: dietType,
            allergies: Array(allergies),
            primaryAilments: primaryAilments.isEmpty ? nil : primaryAilments,
            currentMedications: currentMedications.isEmpty ? nil : currentMedications,
            digestion: digestion,
            sleepHours: sleepHours,
            stressLevel: stressLevel
        )
        Task {
            do {
                try await APIService.shared.submitWellnessProfile(profile)
                await MainActor.run { isSaving = false; didSave = true }
            } catch {
                await MainActor.run { isSaving = false; errorMessage = error.localizedDescription }
            }
        }
    }

    @ViewBuilder
    private func fieldBlock<Content: View>(_ label: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            SectionHeader(title: label)
            content()
                .padding(12)
                .background(Theme.surface)
                .cornerRadius(16)
                .foregroundColor(Theme.text)
        }
    }

    private func pickerBlock(_ label: String, _ selection: Binding<String>, _ options: [String]) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            SectionHeader(title: label)
            Picker(label, selection: selection) {
                ForEach(options, id: \.self) { Text($0).tag($0) }
            }
            .pickerStyle(.segmented)
        }
    }

    private func chipGrid(_ options: [String], selection: Binding<Set<String>>) -> some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
            ForEach(options, id: \.self) { option in
                Button(action: {
                    if selection.wrappedValue.contains(option) { selection.wrappedValue.remove(option) }
                    else { selection.wrappedValue.insert(option) }
                }) {
                    Text(option)
                        .font(.caption).fontWeight(.medium)
                        .foregroundColor(selection.wrappedValue.contains(option) ? Theme.background : Theme.text)
                        .padding(.vertical, 10)
                        .frame(maxWidth: .infinity)
                        .background(selection.wrappedValue.contains(option) ? Theme.secondary : Theme.surface)
                        .cornerRadius(10)
                }
                .buttonStyle(.plain)
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
