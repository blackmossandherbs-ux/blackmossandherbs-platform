import Foundation

// MARK: - Auth

struct LoginRequest: Codable {
    let email: String
    let password: String
}

struct SignUpRequest: Codable {
    let email: String
    let password: String
    let name: String?
}

struct AuthUser: Codable {
    let id: String
    let name: String?
    let email: String
    let role: String?
}

struct AuthResponse: Codable {
    let token: String
    let user: AuthUser
}

struct APIErrorResponse: Codable {
    let error: String
}

// MARK: - Biological / wellness profile

struct BiologicalProfile: Codable {
    var healthGoals: [String] = []
    var dietType: String?
    var allergies: [String] = []
    var primaryAilments: String?
    var currentMedications: String?
    var digestion: String?
    var sleepHours: String?
    var stressLevel: String?
    var doctorNote: String?
    var doctorNoteAt: String?
}

struct ProfileResponse: Codable {
    let profile: BiologicalProfile?
    let isNew: Bool?
}

// MARK: - Social links

struct SocialLinks: Codable, Equatable {
    var instagram: String?
    var tiktok: String?
    var website: String?

    var isEmpty: Bool {
        (instagram?.isEmpty ?? true) && (tiktok?.isEmpty ?? true) && (website?.isEmpty ?? true)
    }
}

// MARK: - Account (full profile aggregate from GET /api/user/profile)

struct OrderItemRecord: Codable, Identifiable {
    let id: String
    let quantity: Int
    let price: Double
    let product: OrderItemProduct?
}

struct OrderItemProduct: Codable {
    let name: String
    let images: [String]
}

struct OrderRecord: Codable, Identifiable {
    let id: String
    let orderNumber: String
    let status: String
    let total: Double
    let createdAt: String
    let items: [OrderItemRecord]
}

struct SubscriptionPlanRecord: Codable {
    let name: String
    let price: Double
    let interval: String
    let features: [String]
}

struct SubscriptionRecord: Codable, Identifiable {
    let id: String
    let status: String
    let currentPeriodEnd: String
    let cancelAtPeriodEnd: Bool
    let plan: SubscriptionPlanRecord
}

struct ConsultationRecord: Codable, Identifiable {
    let id: String
    let type: String
    let date: String?
    let status: String
    let price: Double
    let notes: String?
}

struct Account: Codable {
    let id: String
    var name: String?
    let email: String
    var image: String?
    var phone: String?
    var dateOfBirth: String?
    var socialLinks: SocialLinks?
    let role: String
    let loyaltyPoints: Int
    let biologicalProfile: BiologicalProfile?
    let orders: [OrderRecord]?
    let subscriptions: [SubscriptionRecord]?
    let consultations: [ConsultationRecord]?
}

struct AccountResponse: Codable {
    let user: Account
}

// MARK: - Consultation booking (comprehensive intake, doubles as near-signup)

struct ConsultationBookingRequest: Codable {
    var name: String
    var email: String
    var phone: String?
    var dateOfBirth: String?
    var type: String
    var date: String
    var time: String
    var objectives: String?

    var healthGoals: [String]?
    var dietType: String?
    var allergies: [String]?
    var primaryAilments: String?
    var currentMedications: String?
    var digestion: String?
    var sleepHours: String?
    var stressLevel: String?
}

struct ConsultationType: Identifiable {
    let id: String
    let name: String
    let price: Int
    let durationMinutes: Int

    static let all: [ConsultationType] = [
        ConsultationType(id: "initial", name: "Initial Bio-Assessment", price: 150, durationMinutes: 60),
        ConsultationType(id: "follow-up", name: "Follow-up Session", price: 85, durationMinutes: 30),
        ConsultationType(id: "intensive", name: "Intensive Protocol", price: 250, durationMinutes: 90),
    ]
}

// MARK: - Products (live from backend)

struct Product: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let slug: String
    let description: String
    let price: Double
    let compareAtPrice: Double?
    let images: [String]
    let category: String
    let benefits: [String]
    let therapeuticGoals: [String]
    let stock: Int
    let featured: Bool

    static func == (lhs: Product, rhs: Product) -> Bool { lhs.id == rhs.id }
    func hash(into hasher: inout Hasher) { hasher.combine(id) }

    var priceFormatted: String {
        String(format: "£%.2f", price)
    }

    var compareAtPriceFormatted: String? {
        guard let compareAtPrice else { return nil }
        return String(format: "£%.2f", compareAtPrice)
    }

    var imageURL: URL? {
        guard let path = images.first else { return nil }
        if path.hasPrefix("http") { return URL(string: path) }
        return URL(string: "https://www.blackmossandherbs.com\(path)")
    }

    var isInStock: Bool { stock > 0 }
}

struct ProductsResponse: Codable {
    let products: [Product]
}

struct ProductResponse: Codable {
    let product: Product
}

// MARK: - Cart / checkout

struct CheckoutLineItem: Codable {
    let slug: String
    let quantity: Int
}

struct CheckoutRequest: Codable {
    let items: [CheckoutLineItem]
}

struct CheckoutResponse: Codable {
    let url: String
}

// MARK: - Herb research (Wisdom tab)

struct HerbResearchEntry: Identifiable {
    let id = UUID()
    let letter: Character
    let name: String
    let origin: String
    let summary: String
    let traditionalUse: String
    let safetyNote: String?
    let sourceCount: Int
}
