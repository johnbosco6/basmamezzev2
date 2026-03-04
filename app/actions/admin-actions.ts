'use server'

import { createClient } from 'next-sanity'
import { revalidatePath } from 'next/cache'
import { sendOrderStatusUpdate } from '@/lib/notifications'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset) {
    console.warn('[Admin Actions] Sanity Project ID or Dataset is missing. Check your environment variables.')
}

const client = createClient({
    projectId: projectId || 'placeholder',
    dataset: dataset || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: token, // Critical for write operations
})

export async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
        // First, fetch the order's customer info for the notification
        const order = await client.fetch(
            `*[_type == "order" && _id == $id][0]{ orderNumber, customerName, customerEmail, customerPhone }`,
            { id: orderId }
        )

        const patch = client.patch(orderId).set({ status: newStatus })

        // Record timestamp when the order enters a terminal state
        if (newStatus === 'delivered' || newStatus === 'picked_up') {
            patch.set({ completedAt: new Date().toISOString() })
        }

        await patch.commit()

        // Fire off status update email (non-blocking)
        if (order?.customerEmail) {
            sendOrderStatusUpdate(
                order.orderNumber,
                order.customerName,
                order.customerEmail,
                order.customerPhone,
                newStatus
            ).catch(err => console.error('[Admin] Notification error:', err))
        }

        revalidatePath('/admin')
        return { success: true, message: `Status updated to ${newStatus}` }
    } catch (error) {
        console.error('Failed to update order status:', error)
        return { success: false, message: 'Failed to update status' }
    }
}

export async function getOrders() {
    try {
        const query = `*[_type == "order"] | order(orderDate desc) {
            _id,
            orderNumber,
            customerName,
            customerPhone,
            customerEmail,
            customerAddress,
            status,
            orderType,
            items[]{
                itemId,
                name,
                quantity,
                price
            },
            subtotal,
            deliveryFee,
            totalAmount,
            notes,
            orderDate,
            completedAt
        }`
        return await client.fetch(query, {}, { cache: "no-store" })
    } catch (error) {
        console.error('Failed to fetch orders:', error)
        return []
    }
}
