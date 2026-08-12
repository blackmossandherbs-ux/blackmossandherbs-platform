import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Capacitor config — wraps the hosted Black Moss & Herbs site into native
 * iOS/Android apps. The shell loads the live production site, so the app reuses
 * the same server rendering, auth, checkout and database, and updates instantly
 * whenever you deploy the website (no app-store resubmission for content).
 *
 * For a local build against a dev machine, override `server.url` or comment it
 * out and point `webDir` at a static export.
 */
const config: CapacitorConfig = {
    appId: 'com.blackmossandherbs.app',
    appName: 'Black Moss & Herbs',
    // Required by Capacitor even when loading a remote URL; unused assets live here.
    webDir: 'public',
    server: {
        url: 'https://blackmossandherbs.com',
        hostname: 'blackmossandherbs.com',
        androidScheme: 'https',
        iosScheme: 'https',
        cleartext: false,
    },
    backgroundColor: '#0e150f',
    ios: {
        contentInset: 'always',
        backgroundColor: '#0e150f',
    },
    android: {
        backgroundColor: '#0e150f',
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 1200,
            backgroundColor: '#0e150f',
            showSpinner: false,
            androidScaleType: 'CENTER_CROP',
            splashImmersive: true,
        },
        StatusBar: {
            style: 'DARK', // dark content? we use light content on dark bg — set in code
            backgroundColor: '#0e150f',
            overlaysWebView: true,
        },
        PushNotifications: {
            presentationOptions: ['badge', 'sound', 'alert'],
        },
    },
}

export default config
