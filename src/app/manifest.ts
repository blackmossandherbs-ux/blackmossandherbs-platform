import { MetadataRoute } from 'next'

/**
 * Web App Manifest — makes Black Moss & Herbs installable as an app on Android
 * (Add to Home Screen / Play via TWA) and drives the standalone display mode
 * used by the iOS/Android Capacitor shells.
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Black Moss & Herbs',
        short_name: 'Black Moss',
        description: 'Premium wildcrafted sea moss, herbal blends and wellness — delivered across the UK.',
        id: '/',
        start_url: '/?utm_source=pwa',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0e150f',
        theme_color: '#0e150f',
        categories: ['shopping', 'health', 'lifestyle'],
        icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
            { name: 'Shop', short_name: 'Shop', url: '/shop?utm_source=pwa-shortcut' },
            { name: 'My Account', short_name: 'Account', url: '/dashboard?utm_source=pwa-shortcut' },
            { name: 'Wishlist', short_name: 'Wishlist', url: '/wishlist?utm_source=pwa-shortcut' },
        ],
    }
}
