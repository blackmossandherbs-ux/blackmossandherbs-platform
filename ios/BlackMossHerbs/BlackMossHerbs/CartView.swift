import SwiftUI

struct CartView: View {
    @ObservedObject private var cart = CartManager.shared

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
                                Image(item.product.imageName)
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                                    .frame(width: 72, height: 72)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))

                                VStack(alignment: .leading, spacing: 4) {
                                    Text(item.product.name)
                                        .font(.system(size: 16, weight: .semibold, design: .serif))
                                        .foregroundColor(Theme.text)
                                    Text("Qty \(item.quantity) · \(item.product.price)")
                                        .font(.caption)
                                        .foregroundColor(Theme.secondary)
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

                        Text("Checkout isn't available in this test build yet — it's next up.")
                            .font(.caption)
                            .foregroundColor(Theme.textMuted)
                            .padding(.top, 12)
                    }
                    .padding(24)
                    .padding(.bottom, 60)
                }
            }
        }
        .navigationTitle("Your Bag")
    }
}
