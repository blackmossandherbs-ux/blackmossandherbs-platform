import Foundation
import Combine

struct CartItem: Identifiable {
    let id = UUID()
    let product: Product
    var quantity: Int
}

@MainActor
final class CartManager: ObservableObject {
    static let shared = CartManager()

    @Published private(set) var items: [CartItem] = []

    var count: Int {
        items.reduce(0) { $0 + $1.quantity }
    }

    func add(_ product: Product) {
        if let index = items.firstIndex(where: { $0.product.id == product.id }) {
            items[index].quantity += 1
        } else {
            items.append(CartItem(product: product, quantity: 1))
        }
    }

    func remove(_ item: CartItem) {
        items.removeAll { $0.id == item.id }
    }
}
