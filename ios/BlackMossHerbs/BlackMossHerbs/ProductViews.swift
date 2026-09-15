import SwiftUI
import UIKit

struct AllProductsView: View {
    @StateObject private var catalog = ProductCatalog.shared
    private let columns = [GridItem(.flexible(), spacing: 20), GridItem(.flexible(), spacing: 20)]

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            if catalog.isLoading && catalog.products.isEmpty {
                ProgressView().padding(.top, 80)
            } else if catalog.products.isEmpty {
                Text(catalog.errorMessage ?? "No products found.")
                    .foregroundColor(Theme.textMuted)
                    .padding(.top, 80)
            } else {
                LazyVGrid(columns: columns, spacing: 24) {
                    ForEach(catalog.products) { product in
                        NavigationLink(destination: ProductDetailView(product: product)) {
                            VStack(alignment: .leading, spacing: 12) {
                                ProductImage(url: product.imageURL)
                                    .frame(height: 180)
                                    .frame(maxWidth: .infinity)
                                    .clipShape(RoundedRectangle(cornerRadius: 20))

                                Text(product.name)
                                    .font(.system(size: 14, weight: .semibold, design: .serif))
                                    .foregroundColor(Theme.text)
                                    .lineLimit(2)
                                Text(product.priceFormatted)
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
        }
        .background(Theme.background.ignoresSafeArea())
        .navigationTitle("The Apothecary")
        .task { await catalog.load() }
        .refreshable { await catalog.reload() }
    }
}

struct ProductDetailView: View {
    let product: Product
    @ObservedObject private var cart = CartManager.shared
    @State private var justAdded = false

    var body: some View {
        ScrollView(.vertical, showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {
                ProductImage(url: product.imageURL)
                    .frame(height: 320)
                    .frame(maxWidth: .infinity)
                    .clipShape(RoundedRectangle(cornerRadius: 24))

                VStack(alignment: .leading, spacing: 8) {
                    Text(product.category.uppercased())
                        .font(.caption2)
                        .fontWeight(.bold)
                        .tracking(2)
                        .foregroundColor(Theme.secondary)

                    Text(product.name)
                        .font(.system(size: 28, weight: .bold, design: .serif))
                        .foregroundColor(Theme.text)

                    HStack(spacing: 10) {
                        Text(product.priceFormatted)
                            .font(.title3)
                            .foregroundColor(Theme.secondary)
                        if let compareAt = product.compareAtPriceFormatted {
                            Text(compareAt)
                                .font(.subheadline)
                                .strikethrough()
                                .foregroundColor(Theme.textMuted)
                        }
                    }

                    Text(product.isInStock ? "In stock" : "Currently unavailable")
                        .font(.caption)
                        .foregroundColor(product.isInStock ? Theme.secondary : Theme.textMuted)
                }

                if !product.description.isEmpty {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("DESCRIPTION")
                            .font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.textMuted)
                        Text(product.description)
                            .font(.body)
                            .foregroundColor(Theme.text)
                    }
                }

                if !product.benefits.isEmpty {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("BENEFITS")
                            .font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.textMuted)
                        ForEach(product.benefits, id: \.self) { benefit in
                            HStack(alignment: .top, spacing: 8) {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(Theme.secondary)
                                    .font(.caption)
                                Text(benefit)
                                    .font(.subheadline)
                                    .foregroundColor(Theme.text)
                            }
                        }
                    }
                }

                if !product.therapeuticGoals.isEmpty {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("THERAPEUTIC GOALS")
                            .font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.textMuted)
                        FlowChips(items: product.therapeuticGoals)
                    }
                }

                if let research = HerbResearchDatabase.matching(product: product) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("WHAT THE RESEARCH SAYS")
                            .font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.textMuted)
                        Text(research.summary)
                            .font(.body)
                            .foregroundColor(Theme.text)
                    }

                    if let safetyNote = research.safetyNote {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("⚠ SAFETY NOTE")
                                .font(.caption2).fontWeight(.bold).tracking(2).foregroundColor(Theme.secondary)
                            Text(safetyNote)
                                .font(.subheadline)
                                .foregroundColor(Theme.textMuted)
                        }
                        .padding(16)
                        .background(Theme.surface)
                        .cornerRadius(16)
                    }
                }

                Text("These statements have not been evaluated by any regulatory authority. This product is not intended to diagnose, treat, cure, or prevent any disease.")
                    .font(.caption2)
                    .foregroundColor(Theme.textMuted)

                Button(action: {
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                    cart.add(product)
                    withAnimation { justAdded = true }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                        withAnimation { justAdded = false }
                    }
                }) {
                    Text(justAdded ? "ADDED ✓" : (product.isInStock ? "ADD TO CART" : "OUT OF STOCK"))
                        .font(.system(size: 14, weight: .bold))
                        .tracking(2)
                        .foregroundColor(Theme.background)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 18)
                        .background(product.isInStock ? Theme.secondary : Theme.textMuted)
                        .clipShape(Capsule())
                }
                .disabled(!product.isInStock)
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
            ProductImage(url: product.imageURL)
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
                Text(product.priceFormatted)
                    .font(.subheadline)
                    .foregroundColor(Theme.secondary)
            }
            .frame(width: 220, alignment: .leading)
        }
    }
}

struct ProductImage: View {
    let url: URL?

    var body: some View {
        ZStack {
            Theme.surface
            if let url {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .success(let image):
                        image.resizable().aspectRatio(contentMode: .fill)
                    default:
                        Image(systemName: "leaf.fill")
                            .foregroundColor(Theme.secondary.opacity(0.4))
                            .font(.system(size: 28))
                    }
                }
            } else {
                Image(systemName: "leaf.fill")
                    .foregroundColor(Theme.secondary.opacity(0.4))
                    .font(.system(size: 28))
            }
        }
        .clipped()
    }
}

struct FlowChips: View {
    let items: [String]
    private let columns = [GridItem(.adaptive(minimum: 100), spacing: 8)]

    var body: some View {
        LazyVGrid(columns: columns, alignment: .leading, spacing: 8) {
            ForEach(items, id: \.self) { item in
                Text(item)
                    .font(.caption2)
                    .foregroundColor(Theme.text)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Theme.surface)
                    .cornerRadius(20)
            }
        }
    }
}
