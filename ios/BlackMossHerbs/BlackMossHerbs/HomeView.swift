import SwiftUI
import UIKit

struct HomeView: View {
    @ObservedObject private var cart = CartManager.shared
    @State private var showBookingAlert = false

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

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 20) {
                                    ForEach(Self.products) { product in
                                        NavigationLink(destination: ProductDetailView(product: product)) {
                                            ProductCard(product: product)
                                        }
                                        .buttonStyle(.plain)
                                    }
                                }
                                .padding(.horizontal, 24)
                            }
                        }

                        // Premium CTA for Consultation
                        VStack(alignment: .leading, spacing: 16) {
                            Text("FREE 15-MINUTE CONSULTATION")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)

                            Text("Talk to a real herbalist, not an AI. Every new member gets 15 minutes, free.")
                                .font(.system(size: 22, weight: .medium, design: .serif))
                                .foregroundColor(Theme.text)
                                .fixedSize(horizontal: false, vertical: true)

                            Button(action: { showBookingAlert = true }) {
                                Text("BOOK YOUR FREE SLOT")
                                    .font(.system(size: 14, weight: .bold))
                                    .tracking(2)
                                    .foregroundColor(Theme.background)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 18)
                                    .background(Theme.secondary)
                                    .clipShape(Capsule())
                            }
                            .padding(.top, 8)
                            .alert("Booking isn't live in this test build yet", isPresented: $showBookingAlert) {
                                Button("OK", role: .cancel) {}
                            } message: {
                                Text("This is coming in the next update — for now, reach out directly to schedule your free consultation.")
                            }
                        }
                        .padding(24)
                        .background(Theme.surface)
                        .cornerRadius(24)
                        .padding(.horizontal, 24)

                    }
                    .padding(.bottom, 120) // Tab bar clearance
                }
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
    }

    static let products: [Product] = [
        Product(
            name: "St. Lucia Sea Moss", price: "£45.00", imageName: "SeaMoss",
            origin: "Atlantic coastlines — the Caribbean, Ireland, and Canada's Maritimes",
            summary: "Chondrus crispus is a genuinely mineral-dense seaweed; a 2024 review in Marine Drugs found real antioxidant and anticoagulant compounds in it.",
            safetyNote: "Naturally high in iodine — can suppress thyroid function with daily use. Talk to your doctor if you take thyroid medication."
        ),
        Product(
            name: "Burdock Root Tincture", price: "£28.00", imageName: "BurdockRoot",
            origin: "East Asia, historically naturalised across Europe and North America",
            summary: "A six-week human trial gave burdock root tea to adults with knee osteoarthritis and measured a significant drop in inflammatory markers versus baseline.",
            safetyNote: nil
        ),
        Product(
            name: "Irish Moss", price: "£21.99", imageName: "IrishMoss",
            origin: "North Atlantic coastlines",
            summary: "The same species as our Sea Moss (Chondrus crispus) — this is simply a different regional harvest and preparation, so the same research and safety profile applies.",
            safetyNote: "Naturally high in iodine — see Sea Moss for the full safety note."
        ),
        Product(
            name: "Sarsaparilla Blend", price: "£24.00", imageName: "Sarsaparilla",
            origin: "Central and South America; long-standing use in traditional herbal practice",
            summary: "Sarsaparilla is part of long-standing traditional herbal practice. We haven't attached a specific clinical citation to it yet — we'd rather say that plainly than overstate the evidence.",
            safetyNote: nil
        ),
    ]
}

struct Product: Identifiable {
    let id = UUID()
    let name: String
    let price: String
    let imageName: String
    let origin: String
    let summary: String
    let safetyNote: String?
}

struct AllProductsView: View {
    private let columns = [GridItem(.flexible(), spacing: 20), GridItem(.flexible(), spacing: 20)]

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            LazyVGrid(columns: columns, spacing: 24) {
                ForEach(HomeView.products) { product in
                    NavigationLink(destination: ProductDetailView(product: product)) {
                        VStack(alignment: .leading, spacing: 12) {
                            Image(product.imageName)
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(height: 180)
                                .frame(maxWidth: .infinity)
                                .clipShape(RoundedRectangle(cornerRadius: 20))

                            Text(product.name)
                                .font(.system(size: 14, weight: .semibold, design: .serif))
                                .foregroundColor(Theme.text)
                                .lineLimit(2)
                            Text(product.price)
                                .font(.caption)
                                .foregroundColor(Theme.secondary)
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(24)
            .padding(.bottom, 60)
        }
        .background(Theme.background.ignoresSafeArea())
        .navigationTitle("The Apothecary")
    }
}

struct ProductDetailView: View {
    let product: Product
    @ObservedObject private var cart = CartManager.shared
    @State private var justAdded = false

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {
                Image(product.imageName)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(height: 320)
                    .frame(maxWidth: .infinity)
                    .clipShape(RoundedRectangle(cornerRadius: 24))

                VStack(alignment: .leading, spacing: 8) {
                    Text(product.name)
                        .font(.system(size: 28, weight: .bold, design: .serif))
                        .foregroundColor(Theme.text)
                    Text(product.price)
                        .font(.title3)
                        .foregroundColor(Theme.secondary)
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text("ORIGIN")
                        .font(.caption2)
                        .fontWeight(.bold)
                        .tracking(2)
                        .foregroundColor(Theme.textMuted)
                    Text(product.origin)
                        .font(.subheadline)
                        .foregroundColor(Theme.text)
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text("WHAT THE RESEARCH SAYS")
                        .font(.caption2)
                        .fontWeight(.bold)
                        .tracking(2)
                        .foregroundColor(Theme.textMuted)
                    Text(product.summary)
                        .font(.body)
                        .foregroundColor(Theme.text)
                }

                if let safetyNote = product.safetyNote {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("⚠ SAFETY NOTE")
                            .font(.caption2)
                            .fontWeight(.bold)
                            .tracking(2)
                            .foregroundColor(Theme.secondary)
                        Text(safetyNote)
                            .font(.subheadline)
                            .foregroundColor(Theme.textMuted)
                    }
                    .padding(16)
                    .background(Theme.surface)
                    .cornerRadius(16)
                }

                Button(action: {
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                    cart.add(product)
                    withAnimation { justAdded = true }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                        withAnimation { justAdded = false }
                    }
                }) {
                    Text(justAdded ? "ADDED ✓" : "ADD TO CART")
                        .font(.system(size: 14, weight: .bold))
                        .tracking(2)
                        .foregroundColor(Theme.background)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 18)
                        .background(Theme.secondary)
                        .clipShape(Capsule())
                }
                .padding(.top, 12)
            }
            .padding(24)
            .padding(.bottom, 60)
        }
        .background(Theme.background.ignoresSafeArea())
    }
}

struct ProductCard: View {
    let product: Product

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Image(product.imageName)
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 220, height: 260)
                .clipShape(RoundedRectangle(cornerRadius: 24))
                .overlay(
                    RoundedRectangle(cornerRadius: 24)
                        .stroke(Theme.secondary.opacity(0.2), lineWidth: 1)
                )

            VStack(alignment: .leading, spacing: 4) {
                Text(product.name)
                    .font(.system(size: 16, weight: .semibold, design: .serif))
                    .foregroundColor(Theme.text)
                    .lineLimit(1)
                Text(product.price)
                    .font(.subheadline)
                    .foregroundColor(Theme.secondary)
            }
            .frame(width: 220, alignment: .leading)
        }
    }
}
