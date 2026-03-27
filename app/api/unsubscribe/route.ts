import { NextRequest, NextResponse } from "next/server"
import { writeClient } from "@/lib/sanity"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email } = body

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        // Delete the subscriber document from Sanity
        // We use a query to find the document(s) with this email and delete them
        const query = `*[_type == "subscriber" && email == $email]`
        const subscribers = await writeClient.fetch(query, { email })

        if (subscribers.length === 0) {
            return NextResponse.json({ message: "No such subscriber found" }, { status: 200 })
        }

        // Delete all matching documents (though there should usually be only one)
        const deletions = subscribers.map((s: any) => writeClient.delete(s._id))
        await Promise.all(deletions)

        console.log(`[Unsubscribe] Deleted ${subscribers.length} record(s) for email: ${email}`)

        return NextResponse.json({ success: true, message: "Successfully unsubscribed" }, { status: 200 })
    } catch (error: any) {
        console.error("Unsubscribe error:", error)
        return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
    }
}
