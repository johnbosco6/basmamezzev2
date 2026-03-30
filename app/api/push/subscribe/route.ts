import { NextRequest, NextResponse } from 'next/server'
import { addSubscription, removeSubscription, getSubscriptions, setSubscriptions } from '@/lib/web-push'
import { createClient } from 'next-sanity'

export const dynamic = 'force-dynamic'

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

// POST: Save a new push subscription
export async function POST(req: NextRequest) {
    try {
        const subscription = await req.json()

        if (!subscription?.endpoint) {
            return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
        }

        // Add to in-memory store
        addSubscription(subscription)

        // Persist to Sanity for durability across server restarts
        try {
            const existing = await client.fetch(
                `*[_type == "pushSubscription" && endpoint == $endpoint][0]`,
                { endpoint: subscription.endpoint }
            )

            if (!existing) {
                await client.create({
                    _type: 'pushSubscription',
                    endpoint: subscription.endpoint,
                    keys: JSON.stringify(subscription.keys),
                    createdAt: new Date().toISOString(),
                })
            }
        } catch (err) {
            // Sanity persistence is best-effort — in-memory is the primary store
            console.warn('[Push Subscribe] Sanity persist failed (non-critical):', err)
        }

        console.log(`[Push Subscribe] ✅ New subscription registered. Total: ${getSubscriptions().length}`)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('[Push Subscribe] Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// DELETE: Remove a push subscription
export async function DELETE(req: NextRequest) {
    try {
        const { endpoint } = await req.json()
        removeSubscription(endpoint)

        // Remove from Sanity too
        try {
            const existing = await client.fetch(
                `*[_type == "pushSubscription" && endpoint == $endpoint][0]{ _id }`,
                { endpoint }
            )
            if (existing) {
                await client.delete(existing._id)
            }
        } catch (err) {
            console.warn('[Push Unsubscribe] Sanity cleanup failed:', err)
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

// GET: Load subscriptions from Sanity into memory (called on server start)
export async function GET() {
    try {
        const stored = await client.fetch(
            `*[_type == "pushSubscription"]{ endpoint, keys, createdAt }`
        )

        const subs = stored.map((s: any) => ({
            endpoint: s.endpoint,
            keys: typeof s.keys === 'string' ? JSON.parse(s.keys) : s.keys,
        }))

        setSubscriptions(subs)
        console.log(`[Push] Loaded ${subs.length} subscriptions from Sanity`)

        return NextResponse.json({ success: true, count: subs.length })
    } catch (error: any) {
        console.error('[Push] Failed to load subscriptions:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
