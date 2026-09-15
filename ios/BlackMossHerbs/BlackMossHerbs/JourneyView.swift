import SwiftUI

struct JourneyView: View {
    @StateObject private var store = AccountStore.shared
    @State private var showAuth = false

    private var isSignedIn: Bool { APIService.shared.isSignedIn }

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

                        if !isSignedIn {
                            signedOutCard
                        } else if let account = store.account {
                            activeProtocolCard(account)
                            consultationsCard(account)
                        } else if store.isLoading {
                            ProgressView().frame(maxWidth: .infinity).padding(.vertical, 40)
                        }

                        nhsCard
                    }
                    .padding(.bottom, 120)
                }
                .refreshable { await store.refresh() }
            }
        }
        .task { await store.refresh() }
        .sheet(isPresented: $showAuth) {
            AuthView(onAuthenticated: {
                showAuth = false
                Task { await store.refresh() }
            })
        }
    }

    private var signedOutCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Sign in to see your journey")
                .font(.headline)
                .foregroundColor(Theme.text)
            Text("Your active protocol and consultation history live on your account. Sign in or complete a booking to get started.")
                .font(.subheadline)
                .foregroundColor(Theme.textMuted)
            Button(action: { showAuth = true }) {
                Text("SIGN IN").font(.system(size: 13, weight: .bold)).tracking(2)
                    .foregroundColor(Theme.background)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
                    .background(Theme.secondary)
                    .clipShape(Capsule())
            }
        }
        .padding()
        .background(Theme.surface)
        .cornerRadius(16)
        .padding(.horizontal, 24)
    }

    @ViewBuilder
    private func activeProtocolCard(_ account: Account) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("ACTIVE PROTOCOL")
                .font(.caption).fontWeight(.bold).tracking(4).foregroundColor(Theme.textMuted)

            VStack(alignment: .leading, spacing: 12) {
                if let profile = account.biologicalProfile {
                    HStack {
                        Image(systemName: "waveform.path.ecg").foregroundColor(Theme.secondary)
                        Text(profile.primaryAilments?.isEmpty == false ? profile.primaryAilments! : "Wellness profile on file")
                            .font(.headline)
                            .foregroundColor(Theme.text)
                            .lineLimit(2)
                    }
                    if !profile.healthGoals.isEmpty {
                        Text("Goals: \(profile.healthGoals.joined(separator: ", "))")
                            .font(.subheadline)
                            .foregroundColor(Theme.textMuted)
                    }
                    NavigationLink(destination: HealthBriefView()) {
                        Text("Update wellness profile").font(.caption).foregroundColor(Theme.secondary)
                    }
                } else {
                    HStack {
                        Image(systemName: "waveform.path.ecg").foregroundColor(Theme.textMuted)
                        Text("No active protocol yet").font(.headline).foregroundColor(Theme.text)
                    }
                    Text("Complete your wellness profile or book a consultation to get a personalized protocol from our herbalist team.")
                        .font(.subheadline).foregroundColor(Theme.textMuted)
                    NavigationLink(destination: HealthBriefView()) {
                        Text("Complete wellness profile").font(.caption).foregroundColor(Theme.secondary)
                    }
                }
            }
            .padding()
            .background(Theme.surface)
            .cornerRadius(16)
        }
        .padding(.horizontal, 24)
    }

    @ViewBuilder
    private func consultationsCard(_ account: Account) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("CONSULTATIONS")
                .font(.caption).fontWeight(.bold).tracking(4).foregroundColor(Theme.textMuted)

            if let consultations = account.consultations, !consultations.isEmpty {
                VStack(spacing: 10) {
                    ForEach(consultations.prefix(5)) { c in
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(c.type).font(.subheadline).fontWeight(.semibold).foregroundColor(Theme.text)
                                if let date = c.date { Text(date).font(.caption2).foregroundColor(Theme.textMuted) }
                            }
                            Spacer()
                            Text(c.status).font(.caption2).fontWeight(.bold).foregroundColor(Theme.secondary)
                        }
                        .padding()
                        .background(Theme.surface)
                        .cornerRadius(16)
                    }
                }
            } else {
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Image(systemName: "video").foregroundColor(Theme.textMuted)
                        Text("No consultations booked").font(.headline).foregroundColor(Theme.text)
                    }
                    Text("Book a consultation from the Apothecary tab to get personalized guidance.")
                        .font(.caption).foregroundColor(Theme.textMuted)
                }
                .padding()
                .background(Theme.surface)
                .cornerRadius(16)
            }
        }
        .padding(.horizontal, 24)
    }

    private var nhsCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("CONNECTED RECORDS")
                .font(.caption).fontWeight(.bold).tracking(4).foregroundColor(Theme.textMuted)

            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Image(systemName: "cross.case").foregroundColor(Theme.textMuted)
                    Text("Connect NHS App").font(.headline).foregroundColor(Theme.text)
                    Spacer()
                    Text("COMING SOON").font(.caption2).fontWeight(.bold).foregroundColor(Theme.textMuted)
                }
                Text("Pulling your records from the NHS App requires us to be formally registered with NHS Digital as an approved organization — that's a real onboarding process, not something we can switch on from here. We're not overstating this: it isn't live yet.")
                    .font(.caption)
                    .foregroundColor(Theme.textMuted)
            }
            .padding()
            .background(Theme.surface.opacity(0.6))
            .cornerRadius(16)
        }
        .padding(.horizontal, 24)
    }
}
