import SwiftUI

struct AppTabView: View {
    @State private var showSplash = true
    
    init() {
        // Premium Apple Native Tab Bar Styling
        let appearance = UITabBarAppearance()
        appearance.configureWithTransparentBackground()
        appearance.backgroundColor = UIColor.black.withAlphaComponent(0.8)
        appearance.backgroundEffect = UIBlurEffect(style: .systemThinMaterialDark)
        
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
    
    var body: some View {
        ZStack {
            if showSplash {
                SplashView()
                    .transition(.opacity)
                    .onAppear {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
                            withAnimation(.easeOut(duration: 0.8)) {
                                showSplash = false
                            }
                        }
                    }
            } else {
                TabView {
                    HomeView()
                        .tabItem {
                            Label("Apothecary", systemImage: "leaf.fill")
                        }
                    
                    WisdomView()
                        .tabItem {
                            Label("Wisdom", systemImage: "book.pages.fill")
                        }
                    
                    JourneyView()
                        .tabItem {
                            Label("Journey", systemImage: "point.topleft.down.curvedto.point.bottomright.up")
                        }
                    
                    HealthBriefView()
                        .tabItem {
                            Label("Profile", systemImage: "waveform.path.ecg")
                        }
                    
                    ProfileView()
                        .tabItem {
                            Label("Account", systemImage: "person.crop.circle.fill")
                        }
                }
                .tint(Theme.secondary)
                .preferredColorScheme(.dark)
            }
        }
    }
}
// SplashView remains the same, I'll copy it here so it doesn't get lost
struct SplashView: View {
    @State private var isAnimating = false
    
    var body: some View {
        ZStack {
            Theme.background.ignoresSafeArea()
            
            VStack(spacing: 24) {
                ZStack {
                    Circle()
                        .stroke(Theme.secondary.opacity(0.3), lineWidth: 1)
                        .frame(width: 120, height: 120)
                        .scaleEffect(isAnimating ? 1.2 : 0.8)
                        .opacity(isAnimating ? 0 : 1)
                    
                    Image(systemName: "drop.fill") 
                        .resizable()
                        .scaledToFit()
                        .frame(width: 40)
                        .foregroundColor(Theme.secondary)
                        .overlay(
                            Image(systemName: "leaf.fill")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 20)
                                .foregroundColor(Theme.background)
                                .offset(y: 5)
                        )
                }
                
                VStack(spacing: 8) {
                    Text("BLACK MOSS & HERBS")
                        .font(.system(size: 20, weight: .black, design: .serif))
                        .tracking(8)
                        .foregroundColor(Theme.text)
                    
                    Text("CELLULAR RESTORATION")
                        .font(.caption2)
                        .tracking(6)
                        .foregroundColor(Theme.secondary)
                }
                .opacity(isAnimating ? 1 : 0)
                .offset(y: isAnimating ? 0 : 20)
            }
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: false)) {}
            withAnimation(.easeOut(duration: 1.0).delay(0.5)) {
                isAnimating = true
            }
        }
    }
}
