import SwiftUI

struct ProfileView: View {
    @ObservedObject private var cart = CartManager.shared
    @State private var comingSoonRow: String?

    private var isSignedIn: Bool {
        APIService.shared.token != nil
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 32) {

                        // Header
                        VStack(alignment: .leading, spacing: 8) {
                            Text("ACCOUNT")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)

                            Text("Settings.")
                                .font(.system(size: 48, weight: .bold, design: .serif))
                                .foregroundColor(Theme.text)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 40)

                        // User Info Card
                        HStack(spacing: 16) {
                            Circle()
                                .fill(Theme.surface)
                                .frame(width: 80, height: 80)
                                .overlay(
                                    Image(systemName: "person.fill")
                                        .font(.system(size: 32))
                                        .foregroundColor(Theme.secondary)
                                )

                            VStack(alignment: .leading, spacing: 4) {
                                Text(isSignedIn ? "Your Account" : "Guest")
                                    .font(.title2)
                                    .fontWeight(.semibold)
                                    .foregroundColor(Theme.text)
                                Text(isSignedIn ? "Signed in" : "Sign in isn't live in this test build yet")
                                    .font(.subheadline)
                                    .foregroundColor(Theme.secondary)
                            }
                        }
                        .padding(.horizontal, 24)

                        // Sections
                        VStack(spacing: 16) {
                            SettingsRow(title: "Your Bag (\(cart.count))", icon: "bag", destination: AnyView(CartView()))
                            SettingsRow(title: "Orders & Subscriptions", icon: "box.truck") { comingSoonRow = "Orders & Subscriptions" }
                            SettingsRow(title: "Consultation History", icon: "calendar") { comingSoonRow = "Consultation History" }
                            SettingsRow(title: "Loyalty & Rewards", icon: "star") { comingSoonRow = "Loyalty & Rewards" }
                            SettingsRow(title: "Payment Methods", icon: "creditcard") { comingSoonRow = "Payment Methods" }
                            SettingsRow(title: "Security & Privacy", icon: "lock.shield") { comingSoonRow = "Security & Privacy" }
                        }
                        .padding(.horizontal, 24)

                        Button(action: { APIService.shared.signOut() }) {
                            Text("SIGN OUT")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(2)
                                .foregroundColor(Theme.textMuted)
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(Theme.surface)
                                .cornerRadius(16)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 24)

                        Text("Black Moss & Herbs — v\(Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0") (build \(Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"))")
                            .font(.caption2)
                            .foregroundColor(Theme.textMuted)
                            .frame(maxWidth: .infinity, alignment: .center)
                            .padding(.top, 12)
                    }
                    .padding(.bottom, 100)
                }
            }
            .alert(comingSoonRow.map { "\($0) isn't live in this test build yet" } ?? "", isPresented: Binding(
                get: { comingSoonRow != nil },
                set: { if !$0 { comingSoonRow = nil } }
            )) {
                Button("OK", role: .cancel) {}
            } message: {
                Text("This section is coming in a future update.")
            }
        }
    }
}

struct SettingsRow: View {
    let title: String
    let icon: String
    var destination: AnyView? = nil
    var action: (() -> Void)? = nil

    var body: some View {
        Group {
            if let destination {
                NavigationLink(destination: destination) { rowContent }
            } else {
                Button(action: { action?() }) { rowContent }
            }
        }
        .buttonStyle(.plain)
    }

    private var rowContent: some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .frame(width: 24, height: 24)
                .foregroundColor(Theme.secondary)

            Text(title)
                .foregroundColor(Theme.text)

            Spacer()

            Image(systemName: "chevron.right")
                .foregroundColor(Theme.textMuted)
                .font(.caption)
        }
        .padding()
        .background(Theme.surface)
        .cornerRadius(16)
    }
}
