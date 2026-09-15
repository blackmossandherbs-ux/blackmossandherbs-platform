import SwiftUI

let healthGoalOptions = ["Gut Health", "Energy", "Immunity", "Skin", "Hormonal Balance", "Sleep", "Inflammation", "Detox"]
let allergyOptions = ["Nuts", "Shellfish", "Gluten", "Dairy", "Soy", "Latex", "Pollen", "Nightshades"]
let dietOptions = ["Standard", "Alkaline", "Vegan", "Vegetarian", "Pescatarian", "Keto", "Paleo"]
let digestionOptions = ["Regular", "Sluggish", "Constipated", "Loose"]
let sleepOptions = ["Under 4", "4-6", "6-8", "8+"]
let stressOptions = ["Low", "Moderate", "High"]
private let timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

struct BookingView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var name = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var dateOfBirth = Date(timeIntervalSince1970: 0)
    @State private var includeDateOfBirth = false

    @State private var selectedType = ConsultationType.all[0]
    @State private var date = Date().addingTimeInterval(86400)
    @State private var time = timeSlots[0]
    @State private var objectives = ""

    @State private var healthGoals: Set<String> = []
    @State private var dietType = dietOptions[0]
    @State private var allergies: Set<String> = []
    @State private var primaryAilments = ""
    @State private var currentMedications = ""
    @State private var digestion = digestionOptions[0]
    @State private var sleepHours = sleepOptions[2]
    @State private var stressLevel = stressOptions[1]

    @State private var isSubmitting = false
    @State private var errorMessage: String?
    @State private var didSucceed = false

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                if didSucceed {
                    successView
                } else {
                    formView
                }
            }
            .navigationTitle("Book Your Consultation")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                }
            }
            .task { prefillFromAccountIfSignedIn() }
        }
    }

    private var formView: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 32) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("This is a full clinical intake, not just a booking form")
                        .font(.system(size: 20, weight: .semibold, design: .serif))
                        .foregroundColor(Theme.text)
                    Text("The more you tell us, the more useful your free consultation will be — and this becomes the start of your wellness profile, so you won't need to fill it in again.")
                        .font(.caption)
                        .foregroundColor(Theme.textMuted)
                }
                .padding(.horizontal, 24)
                .padding(.top, 20)

                section("YOUR DETAILS") {
                    LabeledField(label: "FULL NAME") { TextField("Jane Doe", text: $name) }
                    LabeledField(label: "EMAIL") {
                        TextField("you@example.com", text: $email)
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                            .autocorrectionDisabled()
                    }
                    LabeledField(label: "PHONE (OPTIONAL)") {
                        TextField("+44...", text: $phone).keyboardType(.phonePad)
                    }
                    Toggle("Add date of birth", isOn: $includeDateOfBirth)
                        .tint(Theme.secondary)
                        .foregroundColor(Theme.text)
                    if includeDateOfBirth {
                        DatePicker("Date of birth", selection: $dateOfBirth, displayedComponents: .date)
                            .datePickerStyle(.compact)
                            .tint(Theme.secondary)
                            .foregroundColor(Theme.text)
                    }
                }

                section("SESSION TYPE") {
                    VStack(spacing: 12) {
                        ForEach(ConsultationType.all) { type in
                            Button(action: { selectedType = type }) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text(type.name)
                                            .font(.subheadline).fontWeight(.semibold)
                                            .foregroundColor(Theme.text)
                                        Text("\(type.durationMinutes) min")
                                            .font(.caption2)
                                            .foregroundColor(Theme.textMuted)
                                    }
                                    Spacer()
                                    Text("£\(type.price)")
                                        .font(.caption)
                                        .fontWeight(.bold)
                                        .foregroundColor(Theme.secondary)
                                    Image(systemName: selectedType.id == type.id ? "checkmark.circle.fill" : "circle")
                                        .foregroundColor(selectedType.id == type.id ? Theme.secondary : Theme.textMuted)
                                }
                                .padding(14)
                                .background(Theme.surface)
                                .cornerRadius(12)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }

                section("PREFERRED SLOT") {
                    DatePicker("Date", selection: $date, in: Date()..., displayedComponents: .date)
                        .datePickerStyle(.compact)
                        .tint(Theme.secondary)
                        .foregroundColor(Theme.text)

                    Text("TIME").font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.textMuted)
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                        ForEach(timeSlots, id: \.self) { slot in
                            chip(slot, isSelected: time == slot) { time = slot }
                        }
                    }

                    LabeledField(label: "WHAT DO YOU WANT TO GET OUT OF THIS SESSION? (OPTIONAL)") {
                        TextEditor(text: $objectives).frame(height: 80).scrollContentBackground(.hidden)
                    }
                }

                section("HEALTH GOALS") {
                    wrapChips(healthGoalOptions, selection: $healthGoals)
                }

                section("CLINICAL INTAKE — HELPS US TAILOR YOUR PROTOCOL, WE ARE NOT DOCTORS") {
                    LabeledField(label: "PRIMARY AILMENTS OR SYMPTOMS") {
                        TextEditor(text: $primaryAilments).frame(height: 80).scrollContentBackground(.hidden)
                    }
                    LabeledField(label: "CURRENT MEDICATIONS OR SUPPLEMENTS") {
                        TextEditor(text: $currentMedications).frame(height: 80).scrollContentBackground(.hidden)
                    }

                    Text("ALLERGIES").font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.textMuted)
                    wrapChips(allergyOptions, selection: $allergies)

                    pickerRow(label: "DIET TYPE", selection: $dietType, options: dietOptions)
                    pickerRow(label: "DIGESTION", selection: $digestion, options: digestionOptions)
                    pickerRow(label: "SLEEP (HOURS/NIGHT)", selection: $sleepHours, options: sleepOptions)
                    pickerRow(label: "STRESS LEVEL", selection: $stressLevel, options: stressOptions)
                }

                Text("This information goes to our herbalist team to prepare for your session and is saved to your wellness profile. We are not doctors — always see a licensed physician for medical concerns.")
                    .font(.caption2)
                    .foregroundColor(Theme.textMuted)
                    .padding(.horizontal, 24)

                if let errorMessage {
                    Text(errorMessage)
                        .font(.caption)
                        .foregroundColor(.red)
                        .padding(.horizontal, 24)
                }

                Button(action: submit) {
                    HStack {
                        if isSubmitting {
                            ProgressView().tint(Theme.background)
                        } else {
                            Text("SUBMIT & BOOK SLOT").font(.system(size: 14, weight: .bold)).tracking(2)
                        }
                    }
                    .foregroundColor(Theme.background)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 18)
                    .background(isFormValid ? Theme.secondary : Theme.secondary.opacity(0.4))
                    .clipShape(Capsule())
                }
                .disabled(!isFormValid || isSubmitting)
                .padding(.horizontal, 24)
            }
            .padding(.bottom, 60)
        }
    }

    private var successView: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 56))
                .foregroundColor(Theme.secondary)
            Text("Request Received")
                .font(.system(size: 28, weight: .bold, design: .serif))
                .foregroundColor(Theme.text)
            Text("We'll confirm your \(selectedType.name.lowercased()) for \(formattedDate) at \(time) by email within 24 hours. Your intake is saved to your profile.")
                .font(.subheadline)
                .foregroundColor(Theme.textMuted)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            Button(action: { dismiss() }) {
                Text("DONE").font(.system(size: 14, weight: .bold)).tracking(2)
                    .foregroundColor(Theme.background)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Theme.secondary)
                    .clipShape(Capsule())
            }
            .padding(.horizontal, 40)
            .padding(.top, 12)
        }
        .padding()
    }

    private var isFormValid: Bool {
        !name.trimmingCharacters(in: .whitespaces).isEmpty && email.contains("@")
    }

    private var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }

    private func prefillFromAccountIfSignedIn() {
        guard APIService.shared.isSignedIn else { return }
        if let user = APIService.shared.currentUser {
            name = user.name ?? name
            email = user.email
        }
        Task {
            if let account = try? await APIService.shared.fetchAccount() {
                await MainActor.run {
                    phone = account.phone ?? phone
                    if let profile = account.biologicalProfile {
                        healthGoals = Set(profile.healthGoals)
                        dietType = profile.dietType ?? dietType
                        allergies = Set(profile.allergies)
                        primaryAilments = profile.primaryAilments ?? primaryAilments
                        currentMedications = profile.currentMedications ?? currentMedications
                        digestion = profile.digestion ?? digestion
                        sleepHours = profile.sleepHours ?? sleepHours
                        stressLevel = profile.stressLevel ?? stressLevel
                    }
                }
            }
        }
    }

    private func submit() {
        errorMessage = nil
        isSubmitting = true

        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"

        let isoFormatter = ISO8601DateFormatter()
        isoFormatter.formatOptions = [.withFullDate]

        let booking = ConsultationBookingRequest(
            name: name,
            email: email,
            phone: phone.isEmpty ? nil : phone,
            dateOfBirth: includeDateOfBirth ? isoFormatter.string(from: dateOfBirth) : nil,
            type: selectedType.id,
            date: dateFormatter.string(from: date),
            time: time,
            objectives: objectives.isEmpty ? nil : objectives,
            healthGoals: healthGoals.isEmpty ? nil : Array(healthGoals),
            dietType: dietType,
            allergies: allergies.isEmpty ? nil : Array(allergies),
            primaryAilments: primaryAilments.isEmpty ? nil : primaryAilments,
            currentMedications: currentMedications.isEmpty ? nil : currentMedications,
            digestion: digestion,
            sleepHours: sleepHours,
            stressLevel: stressLevel
        )

        Task {
            do {
                try await APIService.shared.bookConsultation(booking)
                await MainActor.run {
                    isSubmitting = false
                    withAnimation { didSucceed = true }
                }
            } catch {
                await MainActor.run {
                    isSubmitting = false
                    errorMessage = error.localizedDescription
                }
            }
        }
    }

    // MARK: - Reusable pieces

    @ViewBuilder
    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(title)
                .font(.caption)
                .fontWeight(.bold)
                .tracking(3)
                .foregroundColor(Theme.textMuted)
            content()
        }
        .padding(.horizontal, 24)
    }

    private func chip(_ label: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(isSelected ? Theme.background : Theme.text)
                .padding(.vertical, 10)
                .frame(maxWidth: .infinity)
                .background(isSelected ? Theme.secondary : Theme.surface)
                .cornerRadius(10)
        }
        .buttonStyle(.plain)
    }

    private func wrapChips(_ options: [String], selection: Binding<Set<String>>) -> some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
            ForEach(options, id: \.self) { option in
                chip(option, isSelected: selection.wrappedValue.contains(option)) {
                    if selection.wrappedValue.contains(option) {
                        selection.wrappedValue.remove(option)
                    } else {
                        selection.wrappedValue.insert(option)
                    }
                }
            }
        }
    }

    private func pickerRow(label: String, selection: Binding<String>, options: [String]) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label).font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.textMuted)
            Picker(label, selection: selection) {
                ForEach(options, id: \.self) { Text($0).tag($0) }
            }
            .pickerStyle(.segmented)
        }
    }
}
