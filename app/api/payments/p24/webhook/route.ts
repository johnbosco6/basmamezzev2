import { NextRequest, NextResponse } from "next/server"
import { Przelewy24 } from "@/lib/p24"
import { writeClient } from "@/lib/sanity"

export async function POST(req: NextRequest) {
    try {
        const data = await req.json()
        console.log("P24 Webhook received:", data)

        // 1. Verify notification signature
        const isValid = Przelewy24.verifyNotificationSign(data)
        if (!isValid) {
            console.error("P24 Webhook: Invalid Signature")
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
        }

        // 2. Verify transaction with P24
        const verification = await Przelewy24.verifyTransaction({
            sessionId: data.sessionId,
            amount: data.amount,
            currency: data.currency,
            orderId: data.orderId,
        })

        if (!verification.ok) {
            console.error("P24 Webhook: Transaction verification failed", verification.error)
            return NextResponse.json({ error: "Verification failed" }, { status: 400 })
        }

        // 3. Update order in Sanity
        const query = `*[_type == "order" && p24SessionId == $sessionId][0]`
        const order = await writeClient.fetch(query, { sessionId: data.sessionId })

        if (!order) {
            console.error(`P24 Webhook: Order not found for session ${data.sessionId}`)
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        console.log(`P24 Webhook: Marking order #${order.orderNumber} as PAID`)

        await writeClient.patch(order._id)
            .set({
                paymentStatus: "paid",
                status: "confirmed" // Automatically confirm order when paid
            })
            .commit()

        // 4. Trigger notifications here now that payment is confirmed
        try {
            const { sendOrderConfirmation } = await import('@/lib/notifications')
            await sendOrderConfirmation({
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                customerEmail: order.customerEmail || '',
                customerPhone: order.customerPhone,
                orderType: order.orderType,
                items: (order.items || []).map((item: any) => ({
                    name: item.name,
                    description: item.description,
                    quantity: item.quantity,
                    price: item.price,
                })),
                subtotal: order.subtotal || 0,
                deliveryFee: order.deliveryFee || 0,
                totalAmount: order.totalAmount || 0,
                paymentMethod: 'p24',
                customerAddress: order.customerAddress,
            })
            console.log(`P24 Webhook: Notification sent for order #${order.orderNumber}`)
        } catch (err) {
            console.error(`P24 Webhook: Notification error for order #${order.orderNumber}`, err)
        }

        return NextResponse.json({ ok: true })
    } catch (error: any) {
        console.error("P24 Webhook Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
