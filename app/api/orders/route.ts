import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'
import { sendOrderConfirmation } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    console.log('--- Incoming Order Save Request ---')

    // Check for token existence (don't log the token itself for security)
    if (!process.env.SANITY_API_TOKEN) {
        console.error('CRITICAL: SANITY_API_TOKEN is missing in environment variables')
        return NextResponse.json({
            ok: false,
            error: 'Server configuration error: Missing API Token'
        }, { status: 500 })
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
            items: (items || []).map((item: { id: string; name: string; price: number; quantity: number }) => ({
                _key: `item-${item.id}-${Date.now()}`, // Ensure a truly unique key
                itemId: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
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
                items: (items || []).map((item: any) => ({
                    name: item.name,
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
