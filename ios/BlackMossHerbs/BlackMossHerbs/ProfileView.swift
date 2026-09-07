import SwiftUI

struct ProfileView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Theme.background.ignoresSafeArea()
                
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 32) {
                        
                        // Header
                        VStack(alignment: .leading, spacing: 8) {
                            Text("ACCOUNT")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(4)
                                .foregroundColor(Theme.secondary)
                            
                            Text("Settings.")
                                .font(.system(size: 48, weight: .bold, design: .serif))
                                .foregroundColor(Theme.text)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 40)
                        
                        // User Info Card
                        HStack(spacing: 16) {
                            Circle()
                                .fill(Theme.surface)
                                .frame(width: 80, height: 80)
                                .overlay(
                                    Image(systemName: "person.fill")
                                        .font(.system(size: 32))
                                        .foregroundColor(Theme.secondary)
                                )
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Patient #8914")
                                    .font(.title2)
                                    .fontWeight(.semibold)
                                    .foregroundColor(Theme.text)
                                Text("Premium Member")
                                    .font(.subheadline)
                                    .foregroundColor(Theme.secondary)
                            }
                        }
                        .padding(.horizontal, 24)
                        
                        // Sections
                        VStack(spacing: 16) {
                            SettingsRow(title: "Orders & Subscriptions", icon: "box.truck")
                            SettingsRow(title: "Consultation History", icon: "calendar")
                            SettingsRow(title: "Loyalty & Rewards", icon: "star")
                            SettingsRow(title: "Payment Methods", icon: "creditcard")
                            SettingsRow(title: "Security & Privacy", icon: "lock.shield")
                        }
                        .padding(.horizontal, 24)
                        
                        Button(action: {}) {
                            Text("SIGN OUT")
                                .font(.caption)
                                .fontWeight(.bold)
                                .tracking(2)
                                .foregroundColor(Theme.textMuted)
                                .padding()
                                .frame(maxWidth: .infinity)
                                .background(Theme.surface)
                                .cornerRadius(16)
                        }
                        .padding(.horizontal, 24)
                        .padding(.top, 24)
                    }
                    .padding(.bottom, 100)
                }
            }
        }
    }
}

struct SettingsRow: View {
    let title: String
    let icon: String
    
    var body: some View {
        HStack(spacing: 16) {
            Image(systemName: icon)
                .frame(width: 24, height: 24)
                .foregroundColor(Theme.secondary)
            
            Text(title)
                .foregroundColor(Theme.text)
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .foregroundColor(Theme.textMuted)
                .font(.caption)
        }
        .padding()
        .background(Theme.surface)
        .cornerRadius(16)
    }
}
