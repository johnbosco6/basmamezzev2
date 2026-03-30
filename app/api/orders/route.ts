import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'
import { sendOrderConfirmation, sendAdminOrderAlert } from '@/lib/notifications'
import { isRestaurantOpenForOrders } from '@/lib/hours'
import { sendPushToAll } from '@/lib/web-push'
import { menuData } from '@/app/menu/menu-data'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    console.log('--- Incoming Order Save Request ---')

    // 0. Check opening hours (Server-side safety)
    const orderStatus = isRestaurantOpenForOrders()
    if (!orderStatus.isOpen) {
        return NextResponse.json({
            error: 'Restaurant is closed for orders',
            status: 'closed'
        }, { status: 403 })
    }

    try {
        const body = await req.json()
        const {
            orderNumber,
            name,
            phone,
            email,
            orderType,
            deliveryAddress,
            notes,
            items,
            subtotal,
            deliveryFee,
            discountAmount,
            promoCode,
            totalPrice,
            paymentMethod,
        } = body

        // 0.1 Check distance (Server-side safety)
        if (orderType === 'delivery' && deliveryAddress && parseFloat(deliveryAddress.distanceKm) >= 10) {
            return NextResponse.json({
                error: 'Delivery location too far (max 10km)',
                status: 'too-far'
            }, { status: 403 })
        }

        console.log(`Processing Order #${orderNumber} for ${name}`)

        const doc = {
            _type: 'order',
            orderNumber,
            customerName: name,
            customerPhone: phone,
            customerEmail: email || '',
            orderType,
            customerAddress: deliveryAddress ? {
                street: deliveryAddress.street || '',
                houseNumber: deliveryAddress.houseNumber || '',
                apartmentNumber: deliveryAddress.apartmentNumber || '',
                floorNumber: deliveryAddress.floorNumber || '',
                postcode: deliveryAddress.postcode || '',
                city: deliveryAddress.city || '',
                distanceKm: deliveryAddress.distanceKm ? String(deliveryAddress.distanceKm) : '',
            } : undefined,
            status: 'pending',
            items: (items || []).map((item: { id: string; name: string; description?: string; price: number; quantity: number }) => {
                let actualDescription = item.description || '';
                // Fallback to searching menuData if description is missing (e.g. old cart in localStorage)
                if (!actualDescription) {
                    for (const section of menuData) {
                        for (const cat of section.categories || []) {
                            for (const mItem of cat.items || []) {
                                if (mItem.id === item.id && mItem.description) {
                                    actualDescription = mItem.description;
                                }
                            }
                        }
                    }
                }
                return {
                    _key: `item-${item.id}-${Date.now()}`,
                    itemId: item.id,
                    name: item.name,
                    description: actualDescription,
                    quantity: item.quantity,
                    price: item.price,
                };
            }),
            subtotal: subtotal || 0,
            deliveryFee: deliveryFee || 0,
            discountAmount: discountAmount || 0,
            promoCode: promoCode || '',
            totalAmount: totalPrice || 0,
            paymentMethod: paymentMethod || 'p24',
            notes: notes || '',
            orderDate: new Date().toISOString(),
        }

        console.log('Creating document in Sanity...')
        const result = await writeClient.create(doc)
        console.log('Sanity create result ID:', result._id)

        // Fire off admin alerts (Non-blocking)
        sendAdminOrderAlert({
            orderNumber,
            customerName: name,
            customerEmail: email || '',
            customerPhone: phone,
            orderType,
            items: doc.items.map((item: any) => ({
                name: item.name,
                description: item.description,
                quantity: item.quantity,
                price: item.price,
            })),
            subtotal: subtotal || 0,
            deliveryFee: deliveryFee || 0,
            discountAmount: discountAmount || 0,
            promoCode: promoCode || null,
            totalAmount: totalPrice || 0,
            customerAddress: deliveryAddress,
        }).catch(err => console.error('[Order API] Admin Email Alert failed:', err))

        // Trigger Web Push Notification to all subscribed devices
        sendPushToAll(
            `🚨 Nowe Zamówienie #${orderNumber}!`,
            `${name} zamówił właśnie ${items.length} potraw za ${(totalPrice || 0).toFixed(2)} zł.`,
            '/admin'
        ).catch(err => console.error('[Order API] Web Push Alert failed:', err))

        // Fire off email notification (non-blocking)
        // We defer this for P24 orders to the webhook, or we can send a "Received" email here.
        // The user said "implement the rest flows after payment is done", so we'll defer.
        if (body.paymentMethod !== 'p24') {
            sendOrderConfirmation({
                orderNumber,
                customerName: name,
                customerEmail: email || '',
                customerPhone: phone,
                orderType,
                items: doc.items.map((item: any) => ({
                    name: item.name,
                    description: item.description,
                    quantity: item.quantity,
                    price: item.price,
                })),
                subtotal: subtotal || 0,
                deliveryFee: deliveryFee || 0,
                discountAmount: discountAmount || 0,
                promoCode: promoCode || null,
                totalAmount: totalPrice || 0,
                customerAddress: deliveryAddress,
            }).catch(err => console.error('[Order API] Notification error:', err))
        }

        // Auto-subscribe customer to marketing collection
        if (email) {
            writeClient.fetch(`*[_type == "subscriber" && email == $email][0]`, { email })
                .then(async (existing) => {
                    if (!existing) {
                        await writeClient.create({
                            _type: 'subscriber',
                            email: email,
                            phone: phone || '',
                            firstName: name || '',
                            source: 'order',
                            subscribedAt: new Date().toISOString()
                        })
                        console.log(`[Marketing] Added new subscriber from order: ${email}`)
                    }
                })
                .catch(err => console.error('[Marketing] Subscriber save error:', err))
        }

        return NextResponse.json({ ok: true, id: result._id, orderNumber })
    } catch (err: any) {
        console.error('Order save error details:', err)
        return NextResponse.json({
            ok: false,
            error: err.message,
            details: err.stack
        }, { status: 500 })
    }
}

export async function GET() {
    return NextResponse.json({
        status: "Diagnostic Mode Active",
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'missing',
        hasToken: !!process.env.SANITY_API_TOKEN,
        tokenLength: process.env.SANITY_API_TOKEN ? process.env.SANITY_API_TOKEN.length : 0,
        time: new Date().toISOString()
    })
}
