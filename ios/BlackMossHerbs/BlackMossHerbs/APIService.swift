import Foundation

class APIService {
    static let shared = APIService()
    // In Simulator, localhost maps to Mac's localhost
    let baseURL = "http://localhost:3000/api" 
    
    var token: String? {
        UserDefaults.standard.string(forKey: "authToken")
    }
    
    func getProfile() async throws -> BiologicalProfile? {
        guard let token = token else { throw URLError(.userAuthenticationRequired) }
        
        guard let url = URL(string: "\(baseURL)/user/wellness") else { throw URLError(.badURL) }
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        
        let profileResponse = try JSONDecoder().decode(ProfileResponse.self, from: data)
        return profileResponse.profile
    }
}
