import webpush from 'web-push'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:basmalublin@gmail.com',
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    )
}

// In-memory store for push subscriptions
// In production, these are also persisted to Sanity
let subscriptions: webpush.PushSubscription[] = []

export function addSubscription(sub: webpush.PushSubscription) {
    // Avoid duplicates by endpoint
    const exists = subscriptions.find(s => s.endpoint === sub.endpoint)
    if (!exists) {
        subscriptions.push(sub)
    }
}

export function removeSubscription(endpoint: string) {
    subscriptions = subscriptions.filter(s => s.endpoint !== endpoint)
}

export function getSubscriptions() {
    return subscriptions
}

export function setSubscriptions(subs: webpush.PushSubscription[]) {
    subscriptions = subs
}

/**
 * Send a push notification to all subscribed devices.
 * Automatically removes stale/expired subscriptions.
 */
export async function sendPushToAll(title: string, body: string, url?: string) {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        console.warn('[WebPush] VAPID keys not configured, skipping push')
        return { sent: 0, failed: 0 }
    }

    const payload = JSON.stringify({
        title,
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        url: url || '/admin',
        tag: 'basma-new-order',
    })

    let sent = 0
    let failed = 0
    const staleEndpoints: string[] = []

    const results = await Promise.allSettled(
        subscriptions.map(sub =>
            webpush.sendNotification(sub, payload)
        )
    )

    results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
            sent++
        } else {
            failed++
            // 410 Gone or 404 means subscription expired
            const statusCode = (result.reason as any)?.statusCode
            if (statusCode === 410 || statusCode === 404) {
                staleEndpoints.push(subscriptions[i].endpoint)
            }
            console.error(`[WebPush] Failed to send to device ${i}:`, result.reason)
        }
    })

    // Clean up stale subscriptions
    if (staleEndpoints.length > 0) {
        staleEndpoints.forEach(ep => removeSubscription(ep))
        console.log(`[WebPush] Removed ${staleEndpoints.length} stale subscriptions`)
    }

    console.log(`[WebPush] Sent: ${sent}, Failed: ${failed}, Total subs: ${subscriptions.length}`)
    return { sent, failed }
}
