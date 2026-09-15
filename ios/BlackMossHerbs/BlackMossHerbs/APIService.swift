import Foundation

enum APIError: LocalizedError {
    case badURL
    case server(String)
    case unauthorized
    case decoding

    var errorDescription: String? {
        switch self {
        case .badURL: return "Something went wrong on our end."
        case .server(let message): return message
        case .unauthorized: return "Please sign in to continue."
        case .decoding: return "We couldn't read the server's response."
        }
    }
}

final class APIService {
    static let shared = APIService()
    let baseURL = "https://www.blackmossandherbs.com/api"

    private let defaults = UserDefaults.standard
    private let tokenKey = "authToken"
    private let userKey = "authUser"

    var token: String? {
        defaults.string(forKey: tokenKey)
    }

    var currentUser: AuthUser? {
        guard let data = defaults.data(forKey: userKey) else { return nil }
        return try? JSONDecoder().decode(AuthUser.self, from: data)
    }

    var isSignedIn: Bool { token != nil }

    func signOut() {
        defaults.removeObject(forKey: tokenKey)
        defaults.removeObject(forKey: userKey)
    }

    private func persist(_ auth: AuthResponse) {
        defaults.set(auth.token, forKey: tokenKey)
        if let data = try? JSONEncoder().encode(auth.user) {
            defaults.set(data, forKey: userKey)
        }
    }

    // MARK: - Core request helper

    private func request<T: Decodable>(
        path: String,
        method: String = "GET",
        body: Encodable? = nil,
        authenticated: Bool = false
    ) async throws -> T {
        guard let url = URL(string: "\(baseURL)\(path)") else { throw APIError.badURL }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if authenticated {
            guard let token else { throw APIError.unauthorized }
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body {
            request.httpBody = try JSONEncoder().encode(AnyEncodable(body))
        }

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else { throw APIError.decoding }

        if httpResponse.statusCode == 401 {
            throw APIError.unauthorized
        }
        guard (200...299).contains(httpResponse.statusCode) else {
            if let errorResponse = try? JSONDecoder().decode(APIErrorResponse.self, from: data) {
                throw APIError.server(errorResponse.error)
            }
            throw APIError.server("Something went wrong. Please try again.")
        }

        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            throw APIError.decoding
        }
    }

    // MARK: - Auth

    func login(email: String, password: String) async throws {
        let auth: AuthResponse = try await request(
            path: "/auth/mobile-token", method: "POST",
            body: LoginRequest(email: email, password: password)
        )
        persist(auth)
    }

    func signUp(email: String, password: String, name: String?) async throws {
        let auth: AuthResponse = try await request(
            path: "/auth/mobile-register", method: "POST",
            body: SignUpRequest(email: email, password: password, name: name)
        )
        persist(auth)
    }

    // MARK: - Account

    func fetchAccount() async throws -> Account {
        let response: AccountResponse = try await request(path: "/user/profile", authenticated: true)
        return response.user
    }

    struct ProfileUpdate: Encodable {
        var name: String?
        var phone: String?
        var dateOfBirth: String?
        var socialLinks: SocialLinks?
        var image: String?
        var doctorNote: String?
    }

    func updateProfile(_ update: ProfileUpdate) async throws {
        struct Ack: Codable { let success: Bool }
        let _: Ack = try await request(path: "/user/profile", method: "PATCH", body: update, authenticated: true)
    }

    func changePassword(currentPassword: String, newPassword: String) async throws {
        struct Ack: Codable { let success: Bool }
        struct Body: Encodable { let currentPassword: String; let newPassword: String }
        let _: Ack = try await request(
            path: "/user/profile", method: "PATCH",
            body: Body(currentPassword: currentPassword, newPassword: newPassword),
            authenticated: true
        )
    }

    // MARK: - Wellness / biological profile

    func getWellnessProfile() async throws -> BiologicalProfile? {
        let response: ProfileResponse = try await request(path: "/user/wellness", authenticated: true)
        return response.profile
    }

    func submitWellnessProfile(_ profile: BiologicalProfile) async throws {
        struct Ack: Codable { let success: Bool }
        let _: Ack = try await request(path: "/user/wellness", method: "POST", body: profile, authenticated: true)
    }

    // MARK: - Consultations / booking

    func bookConsultation(_ booking: ConsultationBookingRequest) async throws {
        struct Ack: Codable { let success: Bool }
        let _: Ack = try await request(path: "/consultations", method: "POST", body: booking)
    }

    // MARK: - Products

    func fetchProducts() async throws -> [Product] {
        let response: ProductsResponse = try await request(path: "/products")
        return response.products
    }

    // MARK: - Checkout

    func startCheckout(items: [CheckoutLineItem]) async throws -> URL {
        let response: CheckoutResponse = try await request(
            path: "/checkout", method: "POST",
            body: CheckoutRequest(items: items), authenticated: true
        )
        guard let url = URL(string: response.url) else { throw APIError.badURL }
        return url
    }

    // MARK: - Loyalty

    func fetchLoyaltyPoints() async throws -> Int {
        struct Response: Codable { let points: Int }
        let response: Response = try await request(path: "/user/loyalty", authenticated: true)
        return response.points
    }
}

/// Type-erasing wrapper so `request(...)` can accept any Encodable body via an
/// existential `Encodable` parameter (Swift can't encode `any Encodable` directly).
private struct AnyEncodable: Encodable {
    private let encodeClosure: (Encoder) throws -> Void
    init(_ wrapped: Encodable) {
        encodeClosure = wrapped.encode
    }
    func encode(to encoder: Encoder) throws {
        try encodeClosure(encoder)
    }
}
