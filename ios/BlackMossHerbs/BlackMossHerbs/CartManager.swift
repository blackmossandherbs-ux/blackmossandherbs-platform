import Foundation
import Combine

struct CartItem: Identifiable, Codable {
    let id: UUID
    let product: Product
    var quantity: Int

    init(id: UUID = UUID(), product: Product, quantity: Int) {
        self.id = id
        self.product = product
        self.quantity = quantity
    }
}

@MainActor
final class CartManager: ObservableObject {
    static let shared = CartManager()

    private static let storageKey = "bmh.cart.v1"

    @Published private(set) var items: [CartItem] = [] {
        didSet { persist() }
    }

    init() {
        load()
    }

    var count: Int {
        items.reduce(0) { $0 + $1.quantity }
    }

    var subtotal: Double {
        items.reduce(0) { $0 + $1.product.price * Double($1.quantity) }
    }

    func add(_ product: Product) {
        if let index = items.firstIndex(where: { $0.product.id == product.id }) {
            items[index].quantity += 1
        } else {
            items.append(CartItem(product: product, quantity: 1))
        }
    }

    func updateQuantity(_ item: CartItem, quantity: Int) {
        guard let index = items.firstIndex(where: { $0.id == item.id }) else { return }
        if quantity <= 0 {
            items.remove(at: index)
        } else {
            items[index].quantity = quantity
        }
    }

    func remove(_ item: CartItem) {
        items.removeAll { $0.id == item.id }
    }

    func clear() {
        items.removeAll()
    }

    private func persist() {
        if let data = try? JSONEncoder().encode(items) {
            UserDefaults.standard.set(data, forKey: Self.storageKey)
        }
    }

    private func load() {
        guard let data = UserDefaults.standard.data(forKey: Self.storageKey),
              let saved = try? JSONDecoder().decode([CartItem].self, from: data) else { return }
        items = saved
    }
}
