import { NextRequest, NextResponse } from "next/server"
import { sendSpecialEventRequestConfirmation, sendAdminSpecialEventAlert } from "@/lib/notifications"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, email, phone, eventType, date, guests, message } = body

        // Basic validation
        if (!name || !email || !phone || !eventType || !date || !guests) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Send emails
        await Promise.all([
            sendSpecialEventRequestConfirmation({ name, email, phone, eventType, date, guests, message }),
            sendAdminSpecialEventAlert({ name, email, phone, eventType, date, guests, message })
        ])

        return NextResponse.json({ success: true, message: "Request sent successfully" }, { status: 200 })
    } catch (error: any) {
        console.error("Special event request error:", error)
        return NextResponse.json({ error: "Failed to send request" }, { status: 500 })
    }
}
