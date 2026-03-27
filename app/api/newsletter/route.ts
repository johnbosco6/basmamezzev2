import { NextRequest, NextResponse } from "next/server"
import { writeClient } from "@/lib/sanity"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email } = body

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
        }

        // Check if subscriber already exists
        const existingQuery = `*[_type == "subscriber" && email == $email][0]`
        const existingSubscriber = await writeClient.fetch(existingQuery, { email })

        if (existingSubscriber) {
            return NextResponse.json({ message: "Already subscribed" }, { status: 200 })
        }

        // Create new subscriber
        await writeClient.create({
            _type: 'subscriber',
            email,
            source: 'newsletter',
            subscribedAt: new Date().toISOString()
        })

        return NextResponse.json({ success: true, message: "Successfully subscribed" }, { status: 201 })
    } catch (error: any) {
        console.error("Newsletter subscription error:", error)
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }
}
