import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

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
            totalPrice,
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
            totalAmount: totalPrice || 0,
            notes: notes || '',
            orderDate: new Date().toISOString(),
        }

        console.log('Creating document in Sanity...')
        const result = await writeClient.create(doc)
        console.log('Sanity create result ID:', result._id)

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

