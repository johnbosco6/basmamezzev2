// Basma Admin Service Worker — handles push notifications
// IMPORTANT: We do NOT cache any admin pages to avoid redirect loops

const CACHE_NAME = 'admin-cache-v5'; // bumped to bust old broken caches

// Assets safe to cache (no HTML pages — they cause redirect loops)
const STATIC_ASSETS = [
    '/sounds/order-alarm.wav',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Install: only cache safe static assets — NEVER cache admin HTML pages
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Cache only static assets that never redirect
            return Promise.allSettled(
                STATIC_ASSETS.map((asset) =>
                    fetch(asset, { cache: 'no-store' })
                        .then((res) => {
                            if (res.ok) return cache.put(asset, res);
                        })
                        .catch(() => { /* ignore missing assets */ })
                )
            );
        })
    );
    self.skipWaiting();
});

// Activate: clean ALL old caches to remove any cached redirects
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.map((name) => caches.delete(name)))
        ).then(() => {
            // Re-create only the new clean cache
            return caches.open(CACHE_NAME).then((cache) =>
                Promise.allSettled(
                    STATIC_ASSETS.map((asset) =>
                        fetch(asset, { cache: 'no-store' })
                            .then((res) => { if (res.ok) return cache.put(asset, res); })
                            .catch(() => {})
                    )
                )
            );
        })
    );
    self.clients.claim();
});

// Fetch: NEVER intercept admin page navigation — always go to network
// This prevents caching of auth redirects which causes the login loop
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Let ALL of these go straight to the network (no SW interception):
    // 1. Non-GET requests (POST, etc.)
    // 2. API routes
    // 3. Admin HTML pages (navigation requests to /admin/*)
    // 4. Next.js internal routes
    if (
        event.request.method !== 'GET' ||
        url.pathname.startsWith('/api/') ||
        url.pathname.startsWith('/admin') ||
        url.pathname.startsWith('/_next/') ||
        event.request.mode === 'navigate'
    ) {
        return; // Pass through to network — no caching
    }

    // For safe static assets only: cache-first strategy
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request);
        })
    );
});

// ─── Push Notifications ────────────────────────────────────────────────────

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const uniqueTag = `basma-order-${Date.now()}`;
        self.registration.showNotification(event.data.title || '🔔 Nowe Zamówienie!', {
            body: event.data.body || 'Nowe zamówienie czeka na potwierdzenie!',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            tag: uniqueTag,
            requireInteraction: true,
            vibrate: [500, 200, 500, 200, 500, 200, 500],
            actions: [
                { action: 'open', title: 'Otwórz Panel' },
                { action: 'dismiss', title: 'Zamknij' }
            ]
        });
    }
});

self.addEventListener('push', (event) => {
    let data = {
        title: '🔔 Nowe Zamówienie!',
        body: 'Nowe zamówienie czeka na potwierdzenie w panelu Basma!',
        icon: '/icons/icon-192x192.png'
    };

    if (event.data) {
        try {
            data = event.data.json();
        } catch {
            data = { title: '🔔 Nowe Zamówienie!', body: event.data.text(), icon: '/icons/icon-192x192.png' };
        }
    }

    const uniqueTag = `basma-order-${Date.now()}`;
    const options = {
        body: data.body,
        icon: data.icon || '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: uniqueTag,
        requireInteraction: true,
        vibrate: [500, 200, 500, 200, 500, 200, 500],
        timestamp: Date.now(),
        data: { url: data.url || '/admin' },
        actions: [
            { action: 'open', title: 'OTWÓRZ PANEL' },
            { action: 'dismiss', title: 'Zamknij' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options).then(() => {
            return self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
                clients.forEach((client) => {
                    if (client.url.includes('/admin')) {
                        client.postMessage({ type: 'PLAY_ALARM' });
                    }
                });
            });
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'dismiss') return;

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
            for (const client of clients) {
                if (client.url.includes('/admin') && 'focus' in client) {
                    return client.focus();
                }
            }
            return self.clients.openWindow('/admin');
        })
    );
});
