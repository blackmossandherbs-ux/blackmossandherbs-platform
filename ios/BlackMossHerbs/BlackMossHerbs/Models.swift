import Foundation

struct User: Codable {
    let id: String
    let name: String?
    let email: String
}

struct AuthResponse: Codable {
    let token: String
    let user: User
}

struct BiologicalProfile: Codable {
    var healthGoals: [String]
    var dietType: String?
    var allergies: [String]
    var primaryAilments: String?
    var currentMedications: String?
    var digestion: String?
    var sleepHours: String?
    var stressLevel: String?
}

struct ProfileResponse: Codable {
    let profile: BiologicalProfile?
    let isNew: Bool?
}
