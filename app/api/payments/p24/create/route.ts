import { NextRequest, NextResponse } from "next/server"
import { Przelewy24 } from "@/lib/p24"
import { writeClient } from "@/lib/sanity"

export async function POST(req: NextRequest) {
    try {
        const { orderNumber, totalAmount, email, name, phone, orderType, deliveryAddress } = await req.json()

        if (!orderNumber || !totalAmount || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const sessionId = `basma-${orderNumber}-${Date.now()}`
        const amountInGrosze = Math.round(totalAmount * 100)

        // 1. Update the order in Sanity with the sessionId
        // We assume the order was already created in a previous step, but for reliability 
        // we'll try to find it by orderNumber. 
        // However, the checkout page currently saves the order and then redirects.
        // We can pass the Sanity ID if we have it, or query by orderNumber.
        const orders = await writeClient.fetch(`*[_type == "order" && orderNumber == $orderNumber]`, { orderNumber })

        if (orders.length > 0) {
            await writeClient.patch(orders[0]._id)
                .set({ p24SessionId: sessionId })
                .commit()
        } else {
            console.warn(`Order #${orderNumber} not found in Sanity during payment initialization`)
        }

        // 2. Register transaction in Przelewy24
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

        const p24Response = await Przelewy24.registerTransaction({
            sessionId,
            amount: amountInGrosze,
            currency: "PLN",
            description: `Zamówienie #${orderNumber} - Basma Mezze`,
            email,
            client: name,
            address: deliveryAddress?.street || "",
            zip: deliveryAddress?.postcode || "",
            city: deliveryAddress?.city || "Lublin",
            country: "PL",
            urlReturn: `${baseUrl}/order-confirmation?session=${sessionId}`,
            urlStatus: `${baseUrl}/api/payments/p24/webhook`,
            language: "pl",
        })

        return NextResponse.json({
            ok: true,
            redirectUrl: p24Response.redirectUrl,
            sessionId
        })
    } catch (error: any) {
        console.error("Payment Creation Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
