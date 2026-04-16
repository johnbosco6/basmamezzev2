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
                status: "pending" // Set to 'pending' so staff see it and handle it through their normal flow
            })
            .commit()

        // 4. Send admin email alert now that payment is confirmed
        try {
            const { sendAdminOrderAlert } = await import('@/lib/notifications')
            await sendAdminOrderAlert({
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
                discountAmount: order.discountAmount || 0,
                promoCode: order.promoCode || null,
                totalAmount: order.totalAmount || 0,
                paymentMethod: 'p24',
                customerAddress: order.customerAddress,
            })
            console.log(`P24 Webhook: Admin alert sent for order #${order.orderNumber}`)
        } catch (err) {
            console.error(`P24 Webhook: Admin alert error for order #${order.orderNumber}`, err)
        }

        // 5. Send Web Push Notification to all subscribed devices
        try {
            const { sendPushToAll } = await import('@/lib/web-push')
            await sendPushToAll(
                `🚨 Nowe Zamówienie #${order.orderNumber}! (Opłacone)`,
                `${order.customerName} zamówił ${(order.items || []).length} potraw za ${(order.totalAmount || 0).toFixed(2)} zł.`,
                '/admin'
            )
            console.log(`P24 Webhook: Push notification sent for order #${order.orderNumber}`)
        } catch (err) {
            console.error(`P24 Webhook: Push notification error for order #${order.orderNumber}`, err)
        }

        // 6. Send customer confirmation email now that payment is confirmed
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
            console.log(`P24 Webhook: Customer confirmation sent for order #${order.orderNumber}`)
        } catch (err) {
            console.error(`P24 Webhook: Notification error for order #${order.orderNumber}`, err)
        }

        return NextResponse.json({ ok: true })
    } catch (error: any) {
        console.error("P24 Webhook Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
