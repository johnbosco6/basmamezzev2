import { Resend } from 'resend'
import { Novu } from '@novu/node'

// Initialize Resend client (safe at module level — no side effects)
const resend = new Resend(process.env.RESEND_API_KEY)

// Novu is initialized lazily inside each function to avoid crashing during Vercel build
// when env vars aren't yet available
function getNovu() {
    return new Novu(process.env.NOVU_API_KEY || '')
}

// ─── Types ───────────────────────────────────────────────
interface OrderItem {
    name: string
    quantity: number
    price: number
}

interface OrderDetails {
    orderNumber: string
    customerName: string
    customerEmail: string
    customerPhone: string
    orderType: 'delivery' | 'pickup'
    items: OrderItem[]
    subtotal: number
    deliveryFee: number
    totalAmount: number
    customerAddress?: {
        street?: string
        houseNumber?: string
        apartmentNumber?: string
        city?: string
        postcode?: string
    }
}

// ─── Format Address Helper ───────────────────────────────
function formatAddress(address: any): string {
    if (!address) return ''
    if (typeof address === 'string') return address
    const parts = []
    if (address.street) {
        let s = address.street
        if (address.houseNumber) s += ` ${address.houseNumber}`
        if (address.apartmentNumber) s += `/${address.apartmentNumber}`
        parts.push(s)
    }
    if (address.city) parts.push(`${address.postcode || ''} ${address.city}`.trim())
    return parts.join(', ')
}

// ─── HTML Email Builder ──────────────────────────────────
function buildOrderConfirmationHTML(order: OrderDetails): string {
    const itemRows = order.items.map(item => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                ${item.name}
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-family: Arial, sans-serif; font-size: 14px; color: #666; text-align: center;">
                ${item.quantity}
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-family: Arial, sans-serif; font-size: 14px; color: #333; text-align: right; font-weight: 600;">
                ${(item.price * item.quantity).toFixed(2)} zł
            </td>
        </tr>
    `).join('')

    const addressBlock = order.orderType === 'delivery'
        ? `<p style="margin: 8px 0; font-size: 14px; color: #555;">📍 <strong>Adres dostawy:</strong> ${formatAddress(order.customerAddress)}</p>`
        : `<p style="margin: 8px 0; font-size: 14px; color: #555;">📦 <strong>Odbiór osobisty</strong> w restauracji</p>`

    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #597FB1, #326096); padding: 40px 30px; text-align: center;">
                                <h1 style="margin: 0; font-family: Arial, sans-serif; font-size: 28px; color: #BA9D76; letter-spacing: 2px;">
                                    BASMA MEZZE & GRILL
                                </h1>
                                <p style="margin: 8px 0 0; font-family: Arial, sans-serif; font-size: 13px; color: rgba(255,255,255,0.7); letter-spacing: 1px;">
                                    POTWIERDZENIE ZAMÓWIENIA
                                </p>
                            </td>
                        </tr>

                        <!-- Greeting -->
                        <tr>
                            <td style="padding: 30px 30px 10px;">
                                <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; margin: 0;">
                                    Dzień dobry <strong>${order.customerName}</strong>,
                                </p>
                                <p style="font-family: Arial, sans-serif; font-size: 14px; color: #666; margin: 10px 0 0;">
                                    Dziękujemy za Twoje zamówienie! Oto szczegóły:
                                </p>
                            </td>
                        </tr>

                        <!-- Order Number Badge -->
                        <tr>
                            <td style="padding: 15px 30px;">
                                <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f6f3; border-radius: 12px; border-left: 4px solid #BA9D76;">
                                    <tr>
                                        <td style="padding: 16px 20px;">
                                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Numer zamówienia</p>
                                            <p style="margin: 4px 0 0; font-family: Arial, sans-serif; font-size: 22px; color: #BA9D76; font-weight: 700;">#${order.orderNumber}</p>
                                        </td>
                                        <td style="padding: 16px 20px; text-align: right;">
                                            <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Typ</p>
                                            <p style="margin: 4px 0 0; font-family: Arial, sans-serif; font-size: 16px; color: #333; font-weight: 600;">
                                                ${order.orderType === 'delivery' ? '🚚 Dostawa' : '📦 Odbiór'}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Items Table -->
                        <tr>
                            <td style="padding: 10px 30px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <th style="padding: 10px 0; border-bottom: 2px solid #BA9D76; font-family: Arial, sans-serif; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; text-align: left;">Produkt</th>
                                        <th style="padding: 10px 0; border-bottom: 2px solid #BA9D76; font-family: Arial, sans-serif; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; text-align: center;">Ilość</th>
                                        <th style="padding: 10px 0; border-bottom: 2px solid #BA9D76; font-family: Arial, sans-serif; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; text-align: right;">Cena</th>
                                    </tr>
                                    ${itemRows}
                                </table>
                            </td>
                        </tr>

                        <!-- Totals -->
                        <tr>
                            <td style="padding: 15px 30px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 6px 0; font-family: Arial, sans-serif; font-size: 14px; color: #666;">Suma częściowa</td>
                                        <td style="padding: 6px 0; font-family: Arial, sans-serif; font-size: 14px; color: #333; text-align: right;">${order.subtotal.toFixed(2)} zł</td>
                                    </tr>
                                    ${order.deliveryFee > 0 ? `
                                    <tr>
                                        <td style="padding: 6px 0; font-family: Arial, sans-serif; font-size: 14px; color: #666;">Dostawa</td>
                                        <td style="padding: 6px 0; font-family: Arial, sans-serif; font-size: 14px; color: #333; text-align: right;">${order.deliveryFee.toFixed(2)} zł</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 12px 0 6px; font-family: Arial, sans-serif; font-size: 18px; color: #333; font-weight: 700; border-top: 2px solid #BA9D76;">RAZEM</td>
                                        <td style="padding: 12px 0 6px; font-family: Arial, sans-serif; font-size: 18px; color: #BA9D76; font-weight: 700; text-align: right; border-top: 2px solid #BA9D76;">${order.totalAmount.toFixed(2)} zł</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Address / Pickup Info -->
                        <tr>
                            <td style="padding: 10px 30px 20px;">
                                ${addressBlock}
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background: #2B2B2B; padding: 25px 30px; text-align: center;">
                                <p style="margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #BA9D76;">
                                    Basma Mezze & Grill — Smacznego! 🥙
                                </p>
                                <p style="margin: 6px 0 0; font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.4);">
                                    Ta wiadomość została wysłana automatycznie. Nie odpowiadaj na ten e-mail.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `
}

// ─── Status Update Email Builder ─────────────────────────
function buildStatusUpdateHTML(orderNumber: string, customerName: string, newStatus: string): string {
    const statusMessages: { [key: string]: { emoji: string; title: string; message: string } } = {
        confirmed: { emoji: '✅', title: 'Zamówienie Potwierdzone', message: 'Twoje zamówienie zostało potwierdzone i wkrótce zaczniemy je przygotowywać.' },
        preparing: { emoji: '👨‍🍳', title: 'Przygotowujemy Zamówienie', message: 'Nasz szef kuchni rozpoczął przygotowywanie Twojego zamówienia!' },
        out_for_delivery: { emoji: '🚗', title: 'Zamówienie W Drodze', message: 'Twoje zamówienie jest już w drodze do Ciebie! Smacznego!' },
        delivered: { emoji: '🎉', title: 'Zamówienie Dostarczone', message: 'Twoje zamówienie zostało dostarczone. Dziękujemy i smacznego!' },
        picked_up: { emoji: '📦', title: 'Zamówienie Odebrane', message: 'Twoje zamówienie zostało odebrane. Dziękujemy i smacznego!' },
    }

    const info = statusMessages[newStatus] || { emoji: '📋', title: 'Aktualizacja Zamówienia', message: `Status Twojego zamówienia został zaktualizowany na: ${newStatus}` }

    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                        <tr>
                            <td style="background: linear-gradient(135deg, #597FB1, #326096); padding: 30px; text-align: center;">
                                <h1 style="margin: 0; font-family: Arial, sans-serif; font-size: 24px; color: #BA9D76; letter-spacing: 2px;">BASMA MEZZE & GRILL</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 30px; text-align: center;">
                                <p style="font-size: 48px; margin: 0;">${info.emoji}</p>
                                <h2 style="font-family: Arial, sans-serif; font-size: 22px; color: #333; margin: 15px 0 5px;">${info.title}</h2>
                                <p style="font-family: Arial, sans-serif; font-size: 14px; color: #BA9D76; margin: 0 0 20px;">Zamówienie #${orderNumber}</p>
                                <p style="font-family: Arial, sans-serif; font-size: 15px; color: #666; margin: 0; line-height: 1.6;">
                                    Dzień dobry ${customerName},<br/>${info.message}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #2B2B2B; padding: 20px 30px; text-align: center;">
                                <p style="margin: 0; font-family: Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.4);">
                                    Basma Mezze & Grill — Ta wiadomość została wysłana automatycznie.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `
}

// ═══════════════════════════════════════════════════════════
//  PUBLIC API
// ═══════════════════════════════════════════════════════════

/**
 * Send order confirmation email via Resend + trigger Novu workflow.
 * Called from /api/orders after saving to Sanity.
 */
export async function sendOrderConfirmation(order: OrderDetails) {
    const results = { resend: false, novu: false }

    // 1) Send email via Resend
    if (process.env.RESEND_API_KEY && order.customerEmail) {
        try {
            await resend.emails.send({
                from: 'Basma Mezze & Grill <onboarding@resend.dev>',
                to: order.customerEmail,
                subject: `Potwierdzenie zamówienia #${order.orderNumber} — Basma Mezze`,
                html: buildOrderConfirmationHTML(order),
            })
            results.resend = true
            console.log(`[Notifications] ✅ Confirmation email sent to ${order.customerEmail}`)
        } catch (err) {
            console.error('[Notifications] ❌ Resend email failed:', err)
        }
    }

    // 2) Trigger Novu workflow (for multi-channel orchestration)
    if (process.env.NOVU_API_KEY) {
        try {
            const novu = getNovu()
            await novu.trigger('order-confirmation', {
                to: {
                    subscriberId: order.customerEmail || order.customerPhone,
                    email: order.customerEmail,
                    phone: order.customerPhone,
                },
                payload: {
                    orderNumber: order.orderNumber,
                    customerName: order.customerName,
                    totalAmount: order.totalAmount,
                    items: order.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
                },
            })
            results.novu = true
            console.log(`[Notifications] ✅ Novu workflow triggered for order ${order.orderNumber}`)
        } catch (err) {
            console.error('[Notifications] ❌ Novu trigger failed:', err)
        }
    }

    return results
}

/**
 * Send order status update email via Resend + trigger Novu workflow.
 * Called from admin-actions when staff change order status.
 */
export async function sendOrderStatusUpdate(
    orderNumber: string,
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    newStatus: string
) {
    const results = { resend: false, novu: false }

    // 1) Send status update email via Resend
    if (process.env.RESEND_API_KEY && customerEmail) {
        try {
            const statusLabels: { [key: string]: string } = {
                confirmed: 'Potwierdzone',
                preparing: 'W przygotowaniu',
                out_for_delivery: 'W drodze',
                delivered: 'Dostarczone',
                picked_up: 'Odebrane',
            }
            await resend.emails.send({
                from: 'Basma Mezze & Grill <onboarding@resend.dev>',
                to: customerEmail,
                subject: `Zamówienie #${orderNumber} — ${statusLabels[newStatus] || newStatus}`,
                html: buildStatusUpdateHTML(orderNumber, customerName, newStatus),
            })
            results.resend = true
            console.log(`[Notifications] ✅ Status update email sent for #${orderNumber}`)
        } catch (err) {
            console.error('[Notifications] ❌ Resend status email failed:', err)
        }
    }

    // 2) Trigger Novu workflow
    if (process.env.NOVU_API_KEY) {
        try {
            const novu = getNovu()
            await novu.trigger('order-status-update', {
                to: {
                    subscriberId: customerEmail || customerPhone,
                    email: customerEmail,
                    phone: customerPhone,
                },
                payload: {
                    orderNumber,
                    customerName,
                    newStatus,
                },
            })
            results.novu = true
            console.log(`[Notifications] ✅ Novu status workflow triggered for #${orderNumber}`)
        } catch (err) {
            console.error('[Notifications] ❌ Novu status trigger failed:', err)
        }
    }

    return results
}
