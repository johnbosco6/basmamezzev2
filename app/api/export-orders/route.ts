import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Fetch only completed orders (Delivered or Picked Up)
        const query = `*[_type == "order" && status in ["delivered", "picked_up"]] | order(completedAt desc) {
            orderNumber,
            customerName,
            customerPhone,
            orderType,
            totalAmount,
            deliveryFee,
            orderDate,
            completedAt,
            status,
            items[]{
                name,
                quantity,
                price
            }
        }`

        const orders = await client.fetch(query)

        // Generate CSV Header
        const headers = [
            'Numer Zamówienia',
            'Klient',
            'Telefon',
            'Typ',
            'Status',
            'Data Złożenia',
            'Data Zakończenia',
            'Produkty',
            'Kwota (PLN)',
            'Koszt Dostawy (PLN)'
        ].join(',')

        // Generate CSV Rows
        const rows = orders.map((order: any) => {
            const itemsSummary = order.items
                ?.map((item: any) => `${item.quantity}x ${item.name}`)
                .join('; ') || ''

            // Wrap fields in quotes to handle commas in data
            return [
                order.orderNumber,
                `"${order.customerName || ''}"`,
                `"${order.customerPhone || ''}"`,
                order.orderType === 'delivery' ? 'Dostawa' : 'Odbiór',
                order.status === 'delivered' ? 'Dostarczone' : 'Odbiór Osobisty',
                new Date(order.orderDate).toLocaleString('pl-PL'),
                order.completedAt ? new Date(order.completedAt).toLocaleString('pl-PL') : '',
                `"${itemsSummary}"`,
                order.totalAmount?.toFixed(2) || '0.00',
                order.deliveryFee?.toFixed(2) || '0.00'
            ].join(',')
        })

        const csvContent = [headers, ...rows].join('\n')

        // Return CSV file
        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="zamowienia_historia_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        })

    } catch (error) {
        console.error('CSV Export Error:', error)
        return NextResponse.json({ error: 'Failed to generate CSV' }, { status: 500 })
    }
}
