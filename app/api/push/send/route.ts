import { NextRequest, NextResponse } from 'next/server'
import { sendPushToAll, getSubscriptions, setSubscriptions } from '@/lib/web-push'
import { createClient } from 'next-sanity'

export const dynamic = 'force-dynamic'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

/**
 * POST: Send push notification to all subscribed admin devices.
 * Called from /api/orders when a new order is placed.
 */
export async function POST(req: NextRequest) {
    try {
        const { title, body, url } = await req.json()

        // If no subscriptions in memory, try loading from Sanity first
        if (getSubscriptions().length === 0) {
            try {
                const stored = await client.fetch(
                    `*[_type == "pushSubscription"]{ endpoint, keys }`
                )
                const subs = stored.map((s: any) => ({
                    endpoint: s.endpoint,
                    keys: typeof s.keys === 'string' ? JSON.parse(s.keys) : s.keys,
                }))
                setSubscriptions(subs)
                console.log(`[Push Send] Loaded ${subs.length} subscriptions from Sanity`)
            } catch (err) {
                console.warn('[Push Send] Could not load subs from Sanity:', err)
            }
        }

        const result = await sendPushToAll(
            title || '🔔 Nowe Zamówienie!',
            body || 'Nowe zamówienie czeka na potwierdzenie w panelu Basma!',
            url
        )

        return NextResponse.json({ success: true, ...result })
    } catch (error: any) {
        console.error('[Push Send] Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
