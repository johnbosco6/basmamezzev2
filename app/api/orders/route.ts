import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity'

export async function POST(req: NextRequest) {
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
                _key: item.id,
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

        const result = await writeClient.create(doc)

        return NextResponse.json({ ok: true, id: result._id, orderNumber })
    } catch (err: any) {
        console.error('Order save error:', err)
        return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
    }
}
