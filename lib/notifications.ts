import { Resend } from 'resend'

// Initialize Resend client (safe at module level — no side effects)
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build')

// ─── Types ───────────────────────────────────────────────
interface OrderItem {
    name: string
    description?: string
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
    discountAmount?: number
    promoCode?: string
    totalAmount: number
    paymentMethod?: string
    customerAddress?: {
        street?: string
        houseNumber?: string
        apartmentNumber?: string
        city?: string
        postcode?: string
    }
}

// ─── Escape HTML Helper ──────────────────────────────────
function escapeHTML(str: string): string {
    if (!str) return ''
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

// ─── Format Address Helper ───────────────────────────────
function formatAddress(address: any): string {
    if (!address) return ''
    if (typeof address === 'string') return escapeHTML(address)
    const parts = []
    if (address.street) {
        let s = address.street
        if (address.houseNumber) s += ` ${address.houseNumber}`
        if (address.apartmentNumber) s += `/${address.apartmentNumber}`
        parts.push(s)
    }
    if (address.city) parts.push(`${address.postcode || ''} ${address.city}`.trim())
    return parts.map(p => escapeHTML(p)).join(', ')
}

// ─── HTML Email Builder ──────────────────────────────────
function buildOrderConfirmationHTML(order: OrderDetails): string {
    const paymentLabels: { [key: string]: string } = {
        p24: '💳 Płatność Online (Przelewy24)',
        cash: '💵 Gotówka przy odbiorze',
        card_on_delivery: '💳 Karta przy odbiorze',
    }
    const paymentLabel = paymentLabels[order.paymentMethod || ''] || order.paymentMethod || 'Nieznana'

    const itemRows = order.items.map(item => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                ${escapeHTML(item.name)}
                ${item.description ? `<br/><span style="font-size: 12px; color: #999; font-style: italic;">${escapeHTML(item.description)}</span>` : ''}
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

    const paymentBlock = `<p style="margin: 8px 0; font-size: 14px; color: #555;">💳 <strong>Metoda płatności:</strong> ${paymentLabel}</p>`

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
                                    Dzień dobry <strong>${escapeHTML(order.customerName)}</strong>,
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
                                    ${order.discountAmount && order.discountAmount > 0 ? `
                                    <tr>
                                        <td style="padding: 6px 0; font-family: Arial, sans-serif; font-size: 14px; color: #4ade80; font-weight: bold;">Zniżka ${order.promoCode ? `(${escapeHTML(order.promoCode)})` : ''}</td>
                                        <td style="padding: 6px 0; font-family: Arial, sans-serif; font-size: 14px; color: #4ade80; text-align: right; font-weight: bold;">-${order.discountAmount.toFixed(2)} zł</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 12px 0 6px; font-family: Arial, sans-serif; font-size: 18px; color: #333; font-weight: 700; border-top: 2px solid #BA9D76;">RAZEM</td>
                                        <td style="padding: 12px 0 6px; font-family: Arial, sans-serif; font-size: 18px; color: #BA9D76; font-weight: 700; text-align: right; border-top: 2px solid #BA9D76;">${order.totalAmount.toFixed(2)} zł</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Address / Pickup Info + Payment Method -->
                        <tr>
                            <td style="padding: 10px 30px 20px;">
                                ${addressBlock}
                                ${paymentBlock}
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
                                <p style="margin: 15px 0 0; font-family: Arial, sans-serif; font-size: 10px; color: rgba(255,255,255,0.3);">
                                    Zgodnie z Twoim prawem do bycia zapomnianym, możesz w każdej chwili <a href="https://www.basmamezze.pl/unsubscribe?email=${encodeURIComponent(order.customerEmail)}" style="color: #BA9D76; text-decoration: underline;">usunąć swoje dane</a> z naszej bazy marketingowej.
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
function buildStatusUpdateHTML(orderNumber: string, customerName: string, newStatus: string, customerEmail: string): string {
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
                                <p style="margin: 12px 0 0; font-family: Arial, sans-serif; font-size: 10px; color: rgba(255,255,255,0.3);">
                                    Możesz w każdej chwili <a href="https://www.basmamezze.pl/unsubscribe?email=${encodeURIComponent(customerEmail)}" style="color: #BA9D76; text-decoration: underline;">usunąć swoje dane</a> z naszej bazy marketingowej.
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
 * Send order confirmation email via Resend.
 * Called from /api/orders after saving to Sanity.
 */
export async function sendOrderConfirmation(order: OrderDetails) {
    if (process.env.RESEND_API_KEY && order.customerEmail) {
        try {
            await resend.emails.send({
                from: 'Basma Mezze & Grill <zamowienia@basmamezze.pl>',
                replyTo: 'basmalublin@gmail.com',
                to: order.customerEmail,
                bcc: ['basmalublin@gmail.com', 'basmamezzestaff@gmail.com'],
                subject: `Potwierdzenie zamówienia #${order.orderNumber} — Basma Mezze`,
                html: buildOrderConfirmationHTML(order),
            })
            console.log(`[Notifications] ✅ Confirmation email sent to ${order.customerEmail}`)
            return { resend: true }
        } catch (err) {
            console.error('[Notifications] ❌ Resend email failed:', err)
        }
    }
    return { resend: false }
}

/**
 * Send order status update email via Resend for specific priority statuses.
 * Called from admin-actions when staff change order status.
 */
export async function sendOrderStatusUpdate(
    orderNumber: string,
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    newStatus: string
) {
    // Only send Resend notifications for specific required statuses
    const priorityStatuses = ['confirmed', 'preparing', 'out_for_delivery']
    if (!priorityStatuses.includes(newStatus)) {
        return { resend: false, skipped: true }
    }

    if (process.env.RESEND_API_KEY && customerEmail) {
        try {
            const statusLabels: { [key: string]: string } = {
                confirmed: 'Potwierdzone',
                preparing: 'W przygotowaniu',
                out_for_delivery: 'W drodze',
            }
            await resend.emails.send({
                from: 'Basma Mezze & Grill <zamowienia@basmamezze.pl>',
                replyTo: 'basmalublin@gmail.com',
                to: customerEmail,
                subject: `Zamówienie #${orderNumber} — ${statusLabels[newStatus] || newStatus}`,
                html: buildStatusUpdateHTML(orderNumber, customerName, newStatus, customerEmail),
            })
            console.log(`[Notifications] ✅ Status update email sent for #${orderNumber} (${newStatus})`)
            return { resend: true }
        } catch (err) {
            console.error('[Notifications] ❌ Resend status email failed:', err)
        }
    }

    return { resend: false }
}
/**
 * Send a dedicated NEW ORDER ALERT email to admin (basmalublin@gmail.com).
 * This ensures staff get a direct email for every incoming order.
 */
export async function sendAdminOrderAlert(order: OrderDetails) {
    if (process.env.RESEND_API_KEY) {
        try {
            const itemsList = order.items.map(i => {
                let line = `${i.quantity}x ${i.name}`
                if (i.description) line += ` <span style="color: #999; font-style: italic;">(${escapeHTML(i.description)})</span>`
                return line
            }).join('<br/>')
            const addressInfo = order.orderType === 'delivery' 
                ? `Adres: ${formatAddress(order.customerAddress)}` 
                : 'Odbiór osobisty'
            
            const paymentLabels: { [key: string]: string } = {
                p24: 'Online (Przelewy24) 💳',
                cash: 'Gotówka przy odbiorze 💵',
                card_on_delivery: 'Karta przy odbiorze 📟',
            }
            const paymentLabel = paymentLabels[order.paymentMethod || ''] || order.paymentMethod || 'Nieznana'

            await resend.emails.send({
                from: 'Basma Admin <zamowienia@basmamezze.pl>',
                to: ['basmalublin@gmail.com', 'basmamezzestaff@gmail.com'],
                subject: `🚨 NOWE ZAMÓWIENIE #${order.orderNumber} — ${order.totalAmount.toFixed(2)} zł`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 2px solid #BA9D76; border-radius: 12px; background-color: #fff;">
                        <h1 style="color: #BA9D76; margin-top: 0; font-size: 24px;">🚨 Nowe Zamówienie!</h1>
                        <div style="background: #fdfaf6; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 5px solid #BA9D76;">
                            <p style="font-size: 18px; margin: 0;"><strong>Numer:</strong> #${order.orderNumber}</p>
                            <p style="margin: 5px 0 0;"><strong>Metoda płatności:</strong> <span style="color: #BA9D76; font-weight: bold;">${paymentLabel}</span></p>
                        </div>

                        <p><strong>Klient:</strong> ${order.customerName} (${order.customerPhone})</p>
                        <p><strong>Typ:</strong> ${order.orderType === 'delivery' ? 'Dostawa 🚚' : 'Odbiór 📦'}</p>
                        <p><strong>${addressInfo}</strong></p>
                        
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        
                        <p style="font-weight: bold; text-transform: uppercase; font-size: 12px; color: #999; margin-bottom: 10px;">Produkty:</p>
                        <p style="font-size: 15px; line-height: 1.6;">${itemsList}</p>
                        
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #555;">
                            <tr>
                                <td style="padding-bottom: 5px;">Suma częściowa:</td>
                                <td style="text-align: right; padding-bottom: 5px;">${order.subtotal.toFixed(2)} zł</td>
                            </tr>
                            ${order.deliveryFee > 0 ? `
                            <tr>
                                <td style="padding-bottom: 5px;">Dostawa:</td>
                                <td style="text-align: right; padding-bottom: 5px;">${order.deliveryFee.toFixed(2)} zł</td>
                            </tr>
                            ` : ''}
                            ${order.discountAmount && order.discountAmount > 0 ? `
                            <tr>
                                <td style="padding-bottom: 5px; color: #4ade80;">Zniżka:</td>
                                <td style="text-align: right; padding-bottom: 5px; color: #4ade80;">-${order.discountAmount.toFixed(2)} zł</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="padding-top: 10px; font-size: 20px; font-weight: bold; color: #333;">RAZEM:</td>
                                <td style="padding-top: 10px; font-size: 20px; font-weight: bold; color: #BA9D76; text-align: right;">${order.totalAmount.toFixed(2)} zł</td>
                            </tr>
                        </table>

                        <div style="margin-top: 30px; text-align: center;">
                            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.basmamezze.pl'}/admin" 
                               style="display: inline-block; background: #BA9D76; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 10px rgba(186,157,118,0.3);">
                               OTWÓRZ PANEL ADMINA
                            </a>
                        </div>
                    </div>
                `,
            })
            console.log(`[Notifications] ✅ Admin alert email sent for #${order.orderNumber}`)
            return { resend: true }
        } catch (err) {
            console.error('[Notifications] ❌ Admin alert email failed:', err)
        }
    }
    return { resend: false }
}
