import SwiftUI
import PhotosUI

@MainActor
final class AccountStore: ObservableObject {
    static let shared = AccountStore()

    @Published var account: Account?
    @Published var isLoading = false
    @Published var errorMessage: String?

    func refresh() async {
        guard APIService.shared.isSignedIn else { account = nil; return }
        isLoading = true
        errorMessage = nil
        do {
            account = try await APIService.shared.fetchAccount()
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }

    func clear() { account = nil }
}

struct ProfileView: View {
    @ObservedObject private var cart = CartManager.shared
    @StateObject private var store = AccountStore.shared
    @State private var showAuth = false
    @State private var showShareSheet = false
    @State private var shareText = ""

    private var isSignedIn: Bool { APIService.shared.isSignedIn }

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 32) {

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

                        if isSignedIn {
                            if let account = store.account {
                                signedInContent(account)
                            } else if store.isLoading {
                                ProgressView().frame(maxWidth: .infinity).padding(.vertical, 60)
                            } else {
                                Text(store.errorMessage ?? "Couldn't load your account.")
                                    .foregroundColor(Theme.textMuted)
                                    .padding(.horizontal, 24)
                            }
                        } else {
                            signedOutContent
                        }

                        VStack(spacing: 16) {
                            SettingsRow(title: "Your Bag (\(cart.count))", icon: "bag", destination: AnyView(CartView()))
                        }
                        .padding(.horizontal, 24)

                        if isSignedIn {
                            Button(action: {
                                APIService.shared.signOut()
                                store.clear()
                            }) {
                                Text("SIGN OUT")
                                    .font(.caption).fontWeight(.bold).tracking(2)
                                    .foregroundColor(Theme.textMuted)
                                    .padding()
                                    .frame(maxWidth: .infinity)
                                    .background(Theme.surface)
                                    .cornerRadius(16)
                            }
                            .padding(.horizontal, 24)
                        }

                        Text("Black Moss & Herbs — v\(Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0") (build \(Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"))")
                            .font(.caption2)
                            .foregroundColor(Theme.textMuted)
                            .frame(maxWidth: .infinity, alignment: .center)
                            .padding(.top, 12)
                    }
                    .padding(.bottom, 100)
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
        .sheet(isPresented: $showShareSheet) {
            ActivityShareSheet(items: [shareText])
        }
    }

    private var signedOutContent: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 16) {
                Circle().fill(Theme.surface).frame(width: 80, height: 80)
                    .overlay(Image(systemName: "person.fill").font(.system(size: 32)).foregroundColor(Theme.secondary))
                VStack(alignment: .leading, spacing: 4) {
                    Text("Guest").font(.title2).fontWeight(.semibold).foregroundColor(Theme.text)
                    Text("Sign in to see your orders, subscriptions, and wellness profile")
                        .font(.subheadline).foregroundColor(Theme.textMuted)
                }
            }
            Button(action: { showAuth = true }) {
                Text("SIGN IN / CREATE ACCOUNT").font(.system(size: 14, weight: .bold)).tracking(2)
                    .foregroundColor(Theme.background)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Theme.secondary)
                    .clipShape(Capsule())
            }
        }
        .padding(.horizontal, 24)
    }

    @ViewBuilder
    private func signedInContent(_ account: Account) -> some View {
        AccountHeaderCard(account: account, onUpdated: { Task { await store.refresh() } })
            .padding(.horizontal, 24)

        if let subscription = account.subscriptions?.first {
            SubscriptionCard(subscription: subscription)
                .padding(.horizontal, 24)
        }

        HStack {
            Label("\(account.loyaltyPoints) Botanical Credits", systemImage: "star.fill")
                .font(.subheadline).foregroundColor(Theme.secondary)
            Spacer()
        }
        .padding(16)
        .background(Theme.surface)
        .cornerRadius(16)
        .padding(.horizontal, 24)

        VStack(spacing: 16) {
            SettingsRow(title: "Orders (\(account.orders?.count ?? 0))", icon: "box.truck",
                        destination: AnyView(OrdersView(orders: account.orders ?? [])))
            SettingsRow(title: "Consultation History (\(account.consultations?.count ?? 0))", icon: "calendar",
                        destination: AnyView(ConsultationHistoryView(consultations: account.consultations ?? [])))
            SettingsRow(title: "Health & Doctor Sharing", icon: "heart.text.square",
                        destination: AnyView(HealthSharingView()))
            SettingsRow(title: "Security & Password", icon: "lock.shield",
                        destination: AnyView(SecurityView()))
        }
        .padding(.horizontal, 24)
    }
}

struct AccountHeaderCard: View {
    let account: Account
    var onUpdated: () -> Void

    @State private var photoItem: PhotosPickerItem?
    @State private var isUploadingPhoto = false
    @State private var showEditSheet = false

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 16) {
                PhotosPicker(selection: $photoItem, matching: .images) {
                    ZStack {
                        Circle().fill(Theme.surface).frame(width: 80, height: 80)
                        if let imageString = account.image, let url = dataOrRemoteURL(imageString) {
                            AsyncImage(url: url) { phase in
                                if case .success(let image) = phase {
                                    image.resizable().aspectRatio(contentMode: .fill)
                                        .frame(width: 80, height: 80).clipShape(Circle())
                                } else {
                                    Image(systemName: "person.fill").font(.system(size: 32)).foregroundColor(Theme.secondary)
                                }
                            }
                        } else {
                            Image(systemName: "person.fill").font(.system(size: 32)).foregroundColor(Theme.secondary)
                        }
                        if isUploadingPhoto {
                            ProgressView().tint(Theme.secondary)
                        }
                        Circle().stroke(Theme.secondary, lineWidth: 1).frame(width: 80, height: 80)
                    }
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text(account.name?.isEmpty == false ? account.name! : "Your Account")
                        .font(.title2).fontWeight(.semibold).foregroundColor(Theme.text)
                    Text(account.email).font(.caption).foregroundColor(Theme.textMuted)
                    if let socials = account.socialLinks, !socials.isEmpty {
                        HStack(spacing: 10) {
                            if let instagram = socials.instagram, !instagram.isEmpty {
                                Label(instagram, systemImage: "camera").font(.caption2).foregroundColor(Theme.secondary)
                            }
                            if let tiktok = socials.tiktok, !tiktok.isEmpty {
                                Label(tiktok, systemImage: "play.circle").font(.caption2).foregroundColor(Theme.secondary)
                            }
                        }
                    }
                }
                Spacer()
                Button(action: { showEditSheet = true }) {
                    Image(systemName: "pencil.circle.fill").font(.title2).foregroundColor(Theme.secondary)
                }
            }
        }
        .padding(20)
        .background(Theme.surface.opacity(0.5))
        .cornerRadius(20)
        .onChange(of: photoItem) { _, newItem in
            guard let newItem else { return }
            Task {
                isUploadingPhoto = true
                if let data = try? await newItem.loadTransferable(type: Data.self) {
                    let base64 = "data:image/jpeg;base64,\(data.base64EncodedString())"
                    try? await APIService.shared.updateProfile(.init(image: base64))
                    onUpdated()
                }
                isUploadingPhoto = false
            }
        }
        .sheet(isPresented: $showEditSheet) {
            EditProfileView(account: account, onSaved: {
                showEditSheet = false
                onUpdated()
            })
        }
    }

    private func dataOrRemoteURL(_ value: String) -> URL? { URL(string: value) }
}

struct EditProfileView: View {
    let account: Account
    var onSaved: () -> Void
    @Environment(\.dismiss) private var dismiss

    @State private var name: String
    @State private var phone: String
    @State private var instagram: String
    @State private var tiktok: String
    @State private var website: String
    @State private var isSaving = false
    @State private var errorMessage: String?

    init(account: Account, onSaved: @escaping () -> Void) {
        self.account = account
        self.onSaved = onSaved
        _name = State(initialValue: account.name ?? "")
        _phone = State(initialValue: account.phone ?? "")
        _instagram = State(initialValue: account.socialLinks?.instagram ?? "")
        _tiktok = State(initialValue: account.socialLinks?.tiktok ?? "")
        _website = State(initialValue: account.socialLinks?.website ?? "")
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                ScrollView {
                    VStack(spacing: 16) {
                        LabeledField(label: "NAME") { TextField("Your name", text: $name) }
                        LabeledField(label: "PHONE") { TextField("Phone", text: $phone).keyboardType(.phonePad) }
                        LabeledField(label: "INSTAGRAM") { TextField("@handle", text: $instagram).autocapitalization(.none) }
                        LabeledField(label: "TIKTOK") { TextField("@handle", text: $tiktok).autocapitalization(.none) }
                        LabeledField(label: "WEBSITE") { TextField("https://...", text: $website).autocapitalization(.none) }

                        if let errorMessage {
                            Text(errorMessage).font(.caption).foregroundColor(.red)
                        }

                        Button(action: save) {
                            HStack {
                                if isSaving { ProgressView().tint(Theme.background) } else {
                                    Text("SAVE").font(.system(size: 14, weight: .bold)).tracking(2)
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
                    .padding(24)
                }
            }
            .navigationTitle("Edit Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } } }
        }
    }

    private func save() {
        isSaving = true
        errorMessage = nil
        let socials = SocialLinks(
            instagram: instagram.isEmpty ? nil : instagram,
            tiktok: tiktok.isEmpty ? nil : tiktok,
            website: website.isEmpty ? nil : website
        )
        Task {
            do {
                try await APIService.shared.updateProfile(.init(name: name, phone: phone.isEmpty ? nil : phone, socialLinks: socials))
                await MainActor.run { isSaving = false; onSaved() }
            } catch {
                await MainActor.run { isSaving = false; errorMessage = error.localizedDescription }
            }
        }
    }
}

struct SubscriptionCard: View {
    let subscription: SubscriptionRecord
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(subscription.plan.name).font(.headline).foregroundColor(Theme.text)
                Spacer()
                Text(subscription.status).font(.caption2).fontWeight(.bold).foregroundColor(Theme.secondary)
            }
            Text("£\(String(format: "%.2f", subscription.plan.price))/\(subscription.plan.interval)")
                .font(.caption).foregroundColor(Theme.textMuted)
            if subscription.cancelAtPeriodEnd {
                Text("Cancels at end of billing period").font(.caption2).foregroundColor(Theme.textMuted)
            }
        }
        .padding(16)
        .background(Theme.surface)
        .cornerRadius(16)
    }
}

struct OrdersView: View {
    let orders: [OrderRecord]
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                if orders.isEmpty {
                    Text("No orders yet.").foregroundColor(Theme.textMuted).padding(.top, 40)
                }
                ForEach(orders) { order in
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text(order.orderNumber).fontWeight(.semibold).foregroundColor(Theme.text)
                            Spacer()
                            Text(order.status).font(.caption2).foregroundColor(Theme.secondary)
                        }
                        Text("£\(String(format: "%.2f", order.total)) · \(order.items.count) item(s)")
                            .font(.caption).foregroundColor(Theme.textMuted)
                    }
                    .padding(16)
                    .background(Theme.surface)
                    .cornerRadius(16)
                }
            }
            .padding(24)
        }
        .background(Theme.background.ignoresSafeArea())
        .navigationTitle("Orders")
    }
}

struct ConsultationHistoryView: View {
    let consultations: [ConsultationRecord]
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                if consultations.isEmpty {
                    Text("No consultations yet.").foregroundColor(Theme.textMuted).padding(.top, 40)
                }
                ForEach(consultations) { c in
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text(c.type).fontWeight(.semibold).foregroundColor(Theme.text)
                            Spacer()
                            Text(c.status).font(.caption2).foregroundColor(Theme.secondary)
                        }
                        if let date = c.date {
                            Text(date).font(.caption).foregroundColor(Theme.textMuted)
                        }
                    }
                    .padding(16)
                    .background(Theme.surface)
                    .cornerRadius(16)
                }
            }
            .padding(24)
        }
        .background(Theme.background.ignoresSafeArea())
        .navigationTitle("Consultations")
    }
}

struct SecurityView: View {
    @State private var currentPassword = ""
    @State private var newPassword = ""
    @State private var isSaving = false
    @State private var message: String?
    @State private var isError = false

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                LabeledField(label: "CURRENT PASSWORD") { SecureField("Current password", text: $currentPassword) }
                LabeledField(label: "NEW PASSWORD") { SecureField("At least 8 characters", text: $newPassword) }
                if let message {
                    Text(message).font(.caption).foregroundColor(isError ? .red : Theme.secondary)
                }
                Button(action: save) {
                    HStack {
                        if isSaving { ProgressView().tint(Theme.background) } else {
                            Text("UPDATE PASSWORD").font(.system(size: 14, weight: .bold)).tracking(2)
                        }
                    }
                    .foregroundColor(Theme.background)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(Theme.secondary)
                    .clipShape(Capsule())
                }
                .disabled(isSaving || currentPassword.isEmpty || newPassword.count < 8)
            }
            .padding(24)
        }
        .background(Theme.background.ignoresSafeArea())
        .navigationTitle("Security")
    }

    private func save() {
        isSaving = true
        message = nil
        Task {
            do {
                try await APIService.shared.changePassword(currentPassword: currentPassword, newPassword: newPassword)
                await MainActor.run {
                    isSaving = false; isError = false
                    message = "Password updated."
                    currentPassword = ""; newPassword = ""
                }
            } catch {
                await MainActor.run { isSaving = false; isError = true; message = error.localizedDescription }
            }
        }
    }
}

/// UIActivityViewController wrapper — powers "share to your doctor" via the
/// native share sheet (email/AirDrop/Messages) rather than any fake direct
/// clinical data-exchange integration.
struct ActivityShareSheet: UIViewControllerRepresentable {
    let items: [Any]
    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
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
