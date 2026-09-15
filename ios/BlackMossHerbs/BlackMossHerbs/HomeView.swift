import SwiftUI
import UIKit

@MainActor
final class ProductCatalog: ObservableObject {
    static let shared = ProductCatalog()

    @Published var products: [Product] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    func load() async {
        guard products.isEmpty else { return }
        isLoading = true
        errorMessage = nil
        do {
            products = try await APIService.shared.fetchProducts()
        } catch {
            errorMessage = "Couldn't load the apothecary right now. Pull to refresh."
        }
        isLoading = false
    }

    func reload() async {
        isLoading = true
        errorMessage = nil
        do {
            products = try await APIService.shared.fetchProducts()
        } catch {
            errorMessage = "Couldn't load the apothecary right now. Pull to refresh."
        }
        isLoading = false
    }
}

struct HomeView: View {
    @ObservedObject private var cart = CartManager.shared
    @StateObject private var catalog = ProductCatalog.shared
    @State private var showBooking = false

    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()

                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 40) {

                        VStack(alignment: .leading, spacing: 8) {
                            Text("WILD CRAFTED")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)

                            Text("Biological\nGold.")
                                .font(.system(size: 48, weight: .bold, design: .serif))
                                .foregroundColor(Theme.text)
                                .lineLimit(2)
                                .minimumScaleFactor(0.6)

                            Text("Wildcrafted sea moss and clinical herbalism, sourced globally.")
                                .font(.subheadline)
                                .foregroundColor(Theme.textMuted)
                                .padding(.top, 4)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 40)

                        // Featured Collection (Horizontal Scroll)
                        VStack(alignment: .leading, spacing: 20) {
                            HStack {
                                Text("THE APOTHECARY")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .tracking(4)
                                    .foregroundColor(Theme.textMuted)
                                Spacer()
                                NavigationLink(destination: AllProductsView()) {
                                    Text("View All")
                                        .font(.caption)
                                        .foregroundColor(Theme.secondary)
                                }
                            }
                            .padding(.horizontal, 24)

                            if catalog.isLoading && catalog.products.isEmpty {
                                ProgressView()
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 40)
                            } else if let error = catalog.errorMessage, catalog.products.isEmpty {
                                Text(error)
                                    .font(.caption)
                                    .foregroundColor(Theme.textMuted)
                                    .padding(.horizontal, 24)
                            } else {
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 20) {
                                        ForEach(catalog.products.prefix(8)) { product in
                                            NavigationLink(destination: ProductDetailView(product: product)) {
                                                ProductCard(product: product)
                                            }
                                            .buttonStyle(.plain)
                                        }
                                    }
                                    .padding(.horizontal, 24)
                                }
                            }
                        }

                        // Consultation CTA
                        VStack(alignment: .leading, spacing: 16) {
                            Text("CLINICAL CONSULTATION")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)

                            Text("Talk to a real herbalist, not an AI. Comprehensive intake, tailored protocol.")
                                .font(.system(size: 22, weight: .medium, design: .serif))
                                .foregroundColor(Theme.text)
                                .fixedSize(horizontal: false, vertical: true)

                            Button(action: { showBooking = true }) {
                                Text("BOOK A CONSULTATION")
                                    .font(.system(size: 14, weight: .bold))
                                    .tracking(2)
                                    .foregroundColor(Theme.background)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 18)
                                    .background(Theme.secondary)
                                    .clipShape(Capsule())
                            }
                            .padding(.top, 8)
                        }
                        .padding(24)
                        .background(Theme.surface)
                        .cornerRadius(24)
                        .padding(.horizontal, 24)

                    }
                    .padding(.bottom, 120) // Tab bar clearance
                }
                .refreshable { await catalog.reload() }
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    NavigationLink(destination: CartView()) {
                        ZStack(alignment: .topTrailing) {
                            Image(systemName: "bag")
                                .foregroundColor(Theme.secondary)
                            if cart.count > 0 {
                                Text("\(cart.count)")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(Theme.background)
                                    .padding(4)
                                    .background(Theme.secondary)
                                    .clipShape(Circle())
                                    .offset(x: 10, y: -10)
                            }
                        }
                    }
                }
            }
        }
        .task { await catalog.load() }
        .sheet(isPresented: $showBooking) {
            BookingView()
        }
    }
}
