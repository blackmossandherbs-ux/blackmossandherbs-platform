import SwiftUI

struct AuthView: View {
    var onAuthenticated: () -> Void = {}

    @State private var mode: Mode = .login
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var isSubmitting = false
    @State private var errorMessage: String?

    enum Mode { case login, signUp }

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 32) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text(mode == .login ? "WELCOME BACK" : "JOIN THE APOTHECARY")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)

                            Text(mode == .login ? "Sign In." : "Create Account.")
                                .font(.system(size: 40, weight: .bold, design: .serif))
                                .foregroundColor(Theme.text)

                            Text("Your account links your consultations, wellness profile, orders, and subscriptions in one place. If you've already booked a consultation with this email, we'll connect it automatically.")
                                .font(.subheadline)
                                .foregroundColor(Theme.textMuted)
                                .padding(.top, 4)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 40)

                        VStack(spacing: 16) {
                            Picker("Mode", selection: $mode) {
                                Text("Sign In").tag(Mode.login)
                                Text("Create Account").tag(Mode.signUp)
                            }
                            .pickerStyle(.segmented)

                            if mode == .signUp {
                                LabeledField(label: "NAME") {
                                    TextField("Your name", text: $name)
                                        .textContentType(.name)
                                }
                            }

                            LabeledField(label: "EMAIL") {
                                TextField("you@example.com", text: $email)
                                    .textContentType(.emailAddress)
                                    .keyboardType(.emailAddress)
                                    .autocapitalization(.none)
                                    .autocorrectionDisabled()
                            }

                            LabeledField(label: "PASSWORD") {
                                SecureField(mode == .signUp ? "At least 8 characters" : "Password", text: $password)
                                    .textContentType(mode == .signUp ? .newPassword : .password)
                            }

                            if let errorMessage {
                                Text(errorMessage)
                                    .font(.caption)
                                    .foregroundColor(.red)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                            }

                            Button(action: submit) {
                                HStack {
                                    if isSubmitting {
                                        ProgressView().tint(Theme.background)
                                    } else {
                                        Text(mode == .login ? "SIGN IN" : "CREATE ACCOUNT")
                                            .font(.system(size: 14, weight: .bold))
                                            .tracking(2)
                                    }
                                }
                                .foregroundColor(Theme.background)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 18)
                                .background(isFormValid ? Theme.secondary : Theme.secondary.opacity(0.4))
                                .clipShape(Capsule())
                            }
                            .disabled(!isFormValid || isSubmitting)
                            .padding(.top, 8)
                        }
                        .padding(.horizontal, 24)
                    }
                    .padding(.bottom, 60)
                }
            }
        }
    }

    private var isFormValid: Bool {
        email.contains("@") && password.count >= (mode == .signUp ? 8 : 1)
    }

    private func submit() {
        errorMessage = nil
        isSubmitting = true
        Task {
            do {
                switch mode {
                case .login:
                    try await APIService.shared.login(email: email, password: password)
                case .signUp:
                    try await APIService.shared.signUp(email: email, password: password, name: name.isEmpty ? nil : name)
                }
                await MainActor.run {
                    isSubmitting = false
                    onAuthenticated()
                }
            } catch {
                await MainActor.run {
                    isSubmitting = false
                    errorMessage = error.localizedDescription
                }
            }
        }
    }
}

struct LabeledField<Content: View>: View {
    let label: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(.caption2)
                .fontWeight(.bold)
                .tracking(2)
                .foregroundColor(Theme.textMuted)
            content
                .padding(14)
                .background(Theme.surface)
                .cornerRadius(12)
                .foregroundColor(Theme.text)
        }
    }
}
