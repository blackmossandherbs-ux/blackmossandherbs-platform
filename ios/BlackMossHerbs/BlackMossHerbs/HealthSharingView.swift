import SwiftUI

/// Real, honest health data sharing: generates an actual summary from the
/// user's own profile/consultation data and hands it to iOS's native share
/// sheet (email/AirDrop/Messages) so they can send it to their doctor. There
/// is no certified clinical data-exchange channel here — this is a plain-text
/// export, not a claim of secure medical interoperability.
struct HealthSharingView: View {
    @StateObject private var store = AccountStore.shared
    @State private var doctorNote: String = ""
    @State private var isSaving = false
    @State private var saveMessage: String?
    @State private var showShareSheet = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 28) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Share your health summary with your doctor, and vice versa")
                        .font(.system(size: 22, weight: .semibold, design: .serif))
                        .foregroundColor(Theme.text)
                    Text("We're an herbal wellness practice, not a doctor's office. This isn't a certified clinical data exchange — it's a real summary of what's in your profile that you can send, and a place to keep a note back from your doctor.")
                        .font(.caption)
                        .foregroundColor(Theme.textMuted)
                }

                if let account = store.account {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("SEND TO YOUR DOCTOR").font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.textMuted)
                        Text(summaryText(for: account))
                            .font(.caption)
                            .foregroundColor(Theme.text)
                            .padding(16)
                            .background(Theme.surface)
                            .cornerRadius(16)

                        Button(action: { showShareSheet = true }) {
                            HStack {
                                Image(systemName: "square.and.arrow.up")
                                Text("SHARE HEALTH SUMMARY").font(.system(size: 14, weight: .bold)).tracking(2)
                            }
                            .foregroundColor(Theme.background)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(Theme.secondary)
                            .clipShape(Capsule())
                        }
                    }

                    VStack(alignment: .leading, spacing: 12) {
                        Text("NOTE FROM YOUR DOCTOR").font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.textMuted)
                        Text("If your doctor gives you guidance relevant to your protocol here, jot it down so our herbalist team can see it too.")
                            .font(.caption2)
                            .foregroundColor(Theme.textMuted)

                        TextEditor(text: $doctorNote)
                            .frame(height: 120)
                            .padding(12)
                            .background(Theme.surface)
                            .cornerRadius(16)
                            .scrollContentBackground(.hidden)
                            .foregroundColor(Theme.text)

                        if let savedAt = account.biologicalProfile?.doctorNoteAt {
                            Text("Last saved \(savedAt)").font(.caption2).foregroundColor(Theme.textMuted)
                        }
                        if let saveMessage {
                            Text(saveMessage).font(.caption).foregroundColor(Theme.secondary)
                        }

                        Button(action: saveDoctorNote) {
                            HStack {
                                if isSaving { ProgressView().tint(Theme.background) } else {
                                    Text("SAVE NOTE").font(.system(size: 14, weight: .bold)).tracking(2)
                                }
                            }
                            .foregroundColor(Theme.background)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 16)
                            .background(Theme.secondary)
                            .clipShape(Capsule())
                        }
                        .disabled(isSaving)
                    }
                } else {
                    ProgressView()
                }
            }
            .padding(24)
        }
        .background(Theme.background.ignoresSafeArea())
        .navigationTitle("Health Sharing")
        .task {
            await store.refresh()
            doctorNote = store.account?.biologicalProfile?.doctorNote ?? ""
        }
        .sheet(isPresented: $showShareSheet) {
            if let account = store.account {
                ActivityShareSheet(items: [summaryText(for: account)])
            }
        }
    }

    private func summaryText(for account: Account) -> String {
        var lines = ["Black Moss & Herbs — Health Summary", "Name: \(account.name ?? "—")", "Email: \(account.email)"]
        if let profile = account.biologicalProfile {
            if !profile.healthGoals.isEmpty { lines.append("Health goals: \(profile.healthGoals.joined(separator: ", "))") }
            if let diet = profile.dietType { lines.append("Diet type: \(diet)") }
            if !profile.allergies.isEmpty { lines.append("Allergies: \(profile.allergies.joined(separator: ", "))") }
            if let ailments = profile.primaryAilments, !ailments.isEmpty { lines.append("Primary ailments: \(ailments)") }
            if let meds = profile.currentMedications, !meds.isEmpty { lines.append("Current medications: \(meds)") }
            if let digestion = profile.digestion { lines.append("Digestion: \(digestion)") }
            if let sleep = profile.sleepHours { lines.append("Sleep: \(sleep)") }
            if let stress = profile.stressLevel { lines.append("Stress level: \(stress)") }
        }
        if let consultations = account.consultations, !consultations.isEmpty {
            lines.append("Consultations:")
            for c in consultations.prefix(5) {
                lines.append("- \(c.type) (\(c.status))\(c.date.map { " on \($0)" } ?? "")")
            }
        }
        lines.append("")
        lines.append("Generated from the Black Moss & Herbs app. This is a wellness summary, not a medical record — always confirm details with the patient.")
        return lines.joined(separator: "\n")
    }

    private func saveDoctorNote() {
        isSaving = true
        saveMessage = nil
        Task {
            do {
                try await APIService.shared.updateProfile(.init(doctorNote: doctorNote))
                await store.refresh()
                await MainActor.run { isSaving = false; saveMessage = "Saved." }
            } catch {
                await MainActor.run { isSaving = false; saveMessage = error.localizedDescription }
            }
        }
    }
}
