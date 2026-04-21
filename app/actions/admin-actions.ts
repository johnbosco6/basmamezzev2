'use server'

import { createClient } from 'next-sanity'
import { revalidatePath } from 'next/cache'
import { sendOrderStatusUpdate } from '@/lib/notifications'
import { cookies } from 'next/headers'
import { ensureAuthenticated } from './auth-actions'

const STAFF_COOKIE = 'current_staff'

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
    await ensureAuthenticated()
    try {
        // First, fetch the order's customer info for the notification
        const order = await client.fetch(
            `*[_type == "order" && _id == $id][0]{ orderNumber, customerName, customerEmail, customerPhone }`,
            { id: orderId }
        )

        const patch = client.patch(orderId).set({ status: newStatus })

        // Record staff action
        const staffName = cookies().get(STAFF_COOKIE)?.value || 'Admin'
        const actionEntry = {
            staffName,
            action: `Zmieniono status na: ${newStatus}`,
            timestamp: new Date().toISOString(),
            _key: `action-${Date.now()}`
        }
        patch.insert('after', 'actionLog[-1]', [actionEntry])

        // Record timestamp and archive when the order enters a terminal state
        if (newStatus === 'delivered' || newStatus === 'picked_up') {
            patch.set({ completedAt: new Date().toISOString(), archived: true })
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

/**
 * Send an email notification for a specific order stage without changing order status.
 * Used by OrderCard buttons (Cooking, On the Way).
 */
export async function sendNotificationEmail(orderId: string, stage: 'preparing' | 'out_for_delivery') {
    await ensureAuthenticated()
    try {
        const order = await client.fetch(
            `*[_type == "order" && _id == $id][0]{ orderNumber, customerName, customerEmail, customerPhone }`,
            { id: orderId }
        )

        if (!order?.customerEmail) {
            return { success: false, message: 'No customer email on file' }
        }

        await sendOrderStatusUpdate(
            order.orderNumber,
            order.customerName,
            order.customerEmail,
            order.customerPhone,
            stage
        )

        // Record staff action for notification
        const staffName = cookies().get(STAFF_COOKIE)?.value || 'Admin'
        const actionLabel = stage === 'preparing' ? 'Wysłano: Gotowanie' : 'Wysłano: W drodze'
        const actionEntry = {
            staffName,
            action: actionLabel,
            timestamp: new Date().toISOString(),
            _key: `notif-${Date.now()}`
        }
        
        const fieldToSet = stage === 'preparing' ? 'cookingEmailSent' : 'onWayEmailSent'
        
        await client.patch(orderId)
            .setIfMissing({ actionLog: [] })
            .set({ [fieldToSet]: true })
            .insert('after', 'actionLog[-1]', [actionEntry])
            .commit()

        revalidatePath('/admin')
        return { success: true, message: `Email sent for stage: ${stage}` }
    } catch (error) {
        console.error('[Admin] sendNotificationEmail error:', error)
        return { success: false, message: 'Failed to send email' }
    }
}

export async function getOrders() {
    await ensureAuthenticated()
    try {
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)
        const todayStr = todayStart.toISOString()

        const query = `*[_type == "order" && (
            (status != "delivered" && status != "picked_up" && status != "cancelled") || 
            (orderDate >= "${todayStr}" || completedAt >= "${todayStr}")
        ) && !(paymentMethod == "p24" && paymentStatus != "paid")] | order(orderDate desc) {
            _id,
            orderNumber,
            customerName,
            customerPhone,
            customerEmail,
            customerAddress,
            status,
            orderType,
            paymentStatus,
            items[]{
                itemId,
                name,
                description,
                quantity,
                price
            },
            subtotal,
            deliveryFee,
            totalAmount,
            paymentMethod,
            notes,
            cookingEmailSent,
            onWayEmailSent,
            orderDate,
            completedAt,
            actionLog[]{
                staffName,
                action,
                timestamp
            }
        }`
        return await client.fetch(query, {}, { cache: "no-store" })
    } catch (error) {
        console.error('Failed to fetch orders:', error)
        return []
    }
}

export async function getActiveOrders() {
    await ensureAuthenticated()
    try {
        const query = `*[_type == "order" && status != "delivered" && status != "picked_up" && status != "cancelled" && !(paymentMethod == "p24" && paymentStatus != "paid")] | order(orderDate desc) {
            _id,
            status,
            orderDate
        }`
        return await client.fetch(query, {}, { cache: "no-store" })
    } catch (error) {
        console.error('Failed to fetch active orders:', error)
        return []
    }
}

/**
 * Marks all completed (delivered/picked_up) orders as archived
 * so they disappear from the dashboard.
 */
export async function archiveCompletedOrders() {
    await ensureAuthenticated()
    try {
        // Find all completed orders that are not yet archived
        const completedOrders = await client.fetch(
            `*[_type == "order" && (status == "delivered" || status == "picked_up") && (!defined(archived) || archived == false)] { _id }`
        )

        if (completedOrders.length === 0) return { success: true, count: 0 }

        const transaction = client.transaction()
        completedOrders.forEach((order: any) => {
            transaction.patch(order._id, p => p.set({ archived: true }))
        })

        await transaction.commit()
        revalidatePath('/admin')
        return { success: true, count: completedOrders.length }
    } catch (error) {
        console.error('Failed to archive orders:', error)
        return { success: false, message: 'Nie udało się zarchiwizować zamówień' }
    }
}

export async function getHistoryOrders(dateStr?: string) {
    await ensureAuthenticated()
    try {
        let dateFilter = ''
        if (dateStr) {
            // dateStr format: YYYY-MM-DD
            const startOfDay = new Date(dateStr)
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date(dateStr)
            endOfDay.setHours(23, 59, 59, 999)
            
            dateFilter = `&& (orderDate >= "${startOfDay.toISOString()}" && orderDate <= "${endOfDay.toISOString()}")`
        }

        const query = `*[_type == "order" && (status == "delivered" || status == "picked_up" || status == "cancelled") && !(paymentMethod == "p24" && paymentStatus != "paid") ${dateFilter}] | order(orderDate desc)[0...500] {
            _id,
            orderNumber,
            customerName,
            customerPhone,
            customerEmail,
            customerAddress,
            status,
            orderType,
            paymentStatus,
            items[]{
                itemId,
                name,
                description,
                quantity,
                price
            },
            subtotal,
            deliveryFee,
            totalAmount,
            paymentMethod,
            notes,
            cookingEmailSent,
            onWayEmailSent,
            orderDate,
            completedAt,
            archived,
            actionLog[]{
                staffName,
                action,
                timestamp
            }
        }`
        return await client.fetch(query, {}, { cache: "no-store" })
    } catch (error) {
        console.error('Failed to fetch history orders:', error)
        return []
    }
}

/**
 * Fetches all orders for the current calendar month,
 * including archived ones, for analytics purposes.
 */
export async function getMonthlyOrders() {
    await ensureAuthenticated()
    try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        
        const query = `*[_type == "order" && orderDate >= $startOfMonth && !(paymentMethod == "p24" && paymentStatus != "paid")] | order(orderDate desc) {
            _id,
            totalAmount,
            orderDate,
            completedAt,
            status,
            paymentStatus,
            items[]{
                quantity
            }
        }`
        
        return await client.fetch(query, { startOfMonth }, { cache: "no-store" })
    } catch (error) {
        console.error('Failed to fetch monthly orders:', error)
        return []
    }
}
