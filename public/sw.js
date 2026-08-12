/* Black Moss & Herbs — service worker.
 * Conservative by design: static assets are cached; pages and API are always
 * fetched fresh (so auth/prices/stock are never stale). If a page navigation
 * fails while offline, we show a friendly offline fallback. */

const VERSION = 'bmh-v1'
const STATIC_CACHE = `${VERSION}-static`
const OFFLINE_URL = '/offline'

const PRECACHE = [
    OFFLINE_URL,
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    )
})

function isStaticAsset(url) {
    return (
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.startsWith('/icons/') ||
        url.pathname.startsWith('/images/') ||
        url.pathname.startsWith('/patterns/') ||
        /\.(?:png|jpg|jpeg|svg|webp|gif|ico|woff2?|css|js)$/.test(url.pathname)
    )
}

self.addEventListener('fetch', (event) => {
    const req = event.request
    if (req.method !== 'GET') return

    const url = new URL(req.url)
    if (url.origin !== self.location.origin) return // don't touch cross-origin (Stripe, AI, etc.)
    if (url.pathname.startsWith('/api/')) return // never cache API responses

    // Page navigations: network-first with an offline fallback.
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req).catch(() => caches.match(OFFLINE_URL, { ignoreSearch: true }))
        )
        return
    }

    // Static assets: stale-while-revalidate.
    if (isStaticAsset(url)) {
        event.respondWith(
            caches.open(STATIC_CACHE).then(async (cache) => {
                const cached = await cache.match(req)
                const network = fetch(req)
                    .then((res) => {
                        if (res && res.status === 200) cache.put(req, res.clone())
                        return res
                    })
                    .catch(() => cached)
                return cached || network
            })
        )
    }
})
