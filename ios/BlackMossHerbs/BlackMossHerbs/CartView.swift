import SwiftUI
import SafariServices

struct SafariView: UIViewControllerRepresentable {
    let url: URL
    func makeUIViewController(context: Context) -> SFSafariViewController { SFSafariViewController(url: url) }
    func updateUIViewController(_ uiViewController: SFSafariViewController, context: Context) {}
}

struct IdentifiableURL: Identifiable {
    let url: URL
    var id: String { url.absoluteString }
}

struct CartView: View {
    @ObservedObject private var cart = CartManager.shared
    @State private var checkoutURL: IdentifiableURL?
    @State private var isStartingCheckout = false
    @State private var errorMessage: String?
    @State private var showAuth = false

    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()

            if cart.items.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "bag")
                        .font(.system(size: 40))
                        .foregroundColor(Theme.textMuted)
                    Text("Your bag is empty")
                        .font(.headline)
                        .foregroundColor(Theme.textMuted)
                }
            } else {
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        ForEach(cart.items) { item in
                            HStack(spacing: 16) {
                                ProductImage(url: item.product.imageURL)
                                    .frame(width: 72, height: 72)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))

                                VStack(alignment: .leading, spacing: 4) {
                                    Text(item.product.name)
                                        .font(.system(size: 16, weight: .semibold, design: .serif))
                                        .foregroundColor(Theme.text)
                                    Text(item.product.priceFormatted)
                                        .font(.caption)
                                        .foregroundColor(Theme.secondary)

                                    HStack(spacing: 16) {
                                        Button(action: { cart.updateQuantity(item, quantity: item.quantity - 1) }) {
                                            Image(systemName: "minus.circle").foregroundColor(Theme.textMuted)
                                        }
                                        Text("\(item.quantity)").foregroundColor(Theme.text)
                                        Button(action: { cart.updateQuantity(item, quantity: item.quantity + 1) }) {
                                            Image(systemName: "plus.circle").foregroundColor(Theme.textMuted)
                                        }
                                    }
                                    .padding(.top, 4)
                                }

                                Spacer()

                                Button(action: { cart.remove(item) }) {
                                    Image(systemName: "trash")
                                        .foregroundColor(Theme.textMuted)
                                }
                            }
                            .padding(16)
                            .background(Theme.surface)
                            .cornerRadius(16)
                        }

                        HStack {
                            Text("Subtotal")
                                .foregroundColor(Theme.textMuted)
                            Spacer()
                            Text(String(format: "£%.2f", cart.subtotal))
                                .fontWeight(.bold)
                                .foregroundColor(Theme.text)
                        }
                        .padding(.top, 8)

                        Text("Shipping and any tax are calculated at checkout.")
                            .font(.caption2)
                            .foregroundColor(Theme.textMuted)

                        if let errorMessage {
                            Text(errorMessage)
                                .font(.caption)
                                .foregroundColor(.red)
                        }

                        Button(action: startCheckout) {
                            HStack {
                                if isStartingCheckout {
                                    ProgressView().tint(Theme.background)
                                } else {
                                    Text("CHECKOUT").font(.system(size: 14, weight: .bold)).tracking(2)
                                }
                            }
                            .foregroundColor(Theme.background)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 18)
                            .background(Theme.secondary)
                            .clipShape(Capsule())
                        }
                        .disabled(isStartingCheckout)
                        .padding(.top, 12)
                    }
                    .padding(24)
                    .padding(.bottom, 60)
                }
            }
        }
        .navigationTitle("Your Bag")
        .sheet(item: $checkoutURL) { wrapped in
            SafariView(url: wrapped.url)
        }
        .sheet(isPresented: $showAuth) {
            AuthView(onAuthenticated: {
                showAuth = false
                startCheckout()
            })
        }
    }

    private func startCheckout() {
        guard APIService.shared.isSignedIn else {
            showAuth = true
            return
        }
        errorMessage = nil
        isStartingCheckout = true
        let lines = cart.items.map { CheckoutLineItem(slug: $0.product.slug, quantity: $0.quantity) }
        Task {
            do {
                let url = try await APIService.shared.startCheckout(items: lines)
                await MainActor.run {
                    isStartingCheckout = false
                    checkoutURL = IdentifiableURL(url: url)
                }
            } catch {
                await MainActor.run {
                    isStartingCheckout = false
                    errorMessage = error.localizedDescription
                }
            }
        }
    }
}
