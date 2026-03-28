// Basma Admin Service Worker — handles caching + push notifications

const CACHE_NAME = 'admin-cache-v2';
const ADMIN_URL = '/admin';

// Install: cache admin pages
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/admin',
                '/admin/history',
                '/favicon.ico',
                '/sounds/order-alarm.wav'
            ]);
        })
    );
    // Activate immediately
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) => {
            return Promise.all(
                names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            );
        })
    );
    // Take control of all pages immediately
    self.clients.claim();
});

// Fetch: cache-first for static, network-first for API
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET and API routes
    if (event.request.method !== 'GET' || url.pathname.startsWith('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Message from the client — show notification when requested
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        self.registration.showNotification(event.data.title || '🔔 Nowe Zamówienie!', {
            body: event.data.body || 'Nowe zamówienie czeka na potwierdzenie!',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            tag: 'basma-new-order',
            requireInteraction: true,
            vibrate: [500, 200, 500, 200, 500, 200, 500],
            actions: [
                { action: 'open', title: 'Otwórz Panel' },
                { action: 'dismiss', title: 'Zamknij' }
            ]
        });
    }
});

// Push notification received (for future server-side push)
self.addEventListener('push', (event) => {
    let data = { title: '🔔 Nowe Zamówienie!', body: 'Nowe zamówienie czeka na potwierdzenie!' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch {
            data.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            tag: 'basma-new-order',
            requireInteraction: true,
            vibrate: [500, 200, 500, 200, 500, 200, 500],
            actions: [
                { action: 'open', title: 'Otwórz Panel' },
                { action: 'dismiss', title: 'Zamknij' }
            ]
        })
    );
});

// Notification click — open/focus the admin dashboard
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'dismiss') return;

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
            // If admin dashboard is already open, focus it
            for (const client of clients) {
                if (client.url.includes('/admin') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open a new window
            return self.clients.openWindow(ADMIN_URL);
        })
    );
});
