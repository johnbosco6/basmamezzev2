import { defineField, defineType } from 'sanity'

export const orderType = defineType({
    name: 'order',
    title: 'Order',
    type: 'document',
    fields: [
        defineField({
            name: 'orderNumber',
            title: 'Order Number',
            type: 'string',
            readOnly: true,
        }),
        defineField({
            name: 'customerName',
            title: 'Customer Name',
            type: 'string',
        }),
        defineField({
            name: 'customerPhone',
            title: 'Customer Phone',
            type: 'string',
            description: 'Used to contact the customer',
        }),
        defineField({
            name: 'customerEmail',
            title: 'Customer Email',
            type: 'string',
        }),
        defineField({
            name: 'orderType',
            title: 'Order Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Delivery', value: 'delivery' },
                    { title: 'Pickup', value: 'pickup' },
                ],
                layout: 'radio',
            },
        }),
        defineField({
            name: 'customerAddress',
            title: 'Delivery Address',
            type: 'object',
            fields: [
                defineField({ name: 'street', title: 'Street', type: 'string' }),
                defineField({ name: 'houseNumber', title: 'House Number', type: 'string' }),
                defineField({ name: 'apartmentNumber', title: 'Apartment Number', type: 'string' }),
                defineField({ name: 'floorNumber', title: 'Floor', type: 'string' }),
                defineField({ name: 'postcode', title: 'Postcode', type: 'string' }),
                defineField({ name: 'city', title: 'City', type: 'string' }),
                defineField({ name: 'distanceKm', title: 'Distance (km)', type: 'string' }),
            ],
        }),
        defineField({
            name: 'paymentStatus',
            title: 'Payment Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Paid', value: 'paid' },
                    { title: 'Failed', value: 'failed' },
                ],
                layout: 'radio',
            },
            initialValue: 'pending',
        }),
        defineField({
            name: 'p24SessionId',
            title: 'P24 Session ID',
            type: 'string',
            readOnly: true,
        }),
        defineField({
            name: 'status',
            title: 'Order Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Confirmed', value: 'confirmed' },
                    { title: 'Preparing', value: 'preparing' },
                    { title: 'Out for Delivery', value: 'out_for_delivery' },
                    { title: 'Delivered', value: 'delivered' },
                    { title: 'Picked Up', value: 'picked_up' },
                    { title: 'Cancelled', value: 'cancelled' },
                ],
                layout: 'radio',
            },
            initialValue: 'pending',
        }),
        defineField({
            name: 'items',
            title: 'Order Items',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'itemId', title: 'Item ID', type: 'string' }),
                        defineField({ name: 'name', title: 'Name', type: 'string' }),
                        defineField({ name: 'description', title: 'Description', type: 'string' }),
                        defineField({ name: 'quantity', title: 'Quantity', type: 'number' }),
                        defineField({ name: 'price', title: 'Price at Order (PLN)', type: 'number' }),
                    ],
                    preview: {
                        select: { title: 'name', subtitle: 'quantity' },
                        prepare({ title, subtitle }) {
                            return { title: title || 'Unknown', subtitle: `Qty: ${subtitle}` }
                        },
                    },
                },
            ],
        }),
        defineField({
            name: 'subtotal',
            title: 'Subtotal (PLN)',
            type: 'number',
        }),
        defineField({
            name: 'deliveryFee',
            title: 'Delivery Fee (PLN)',
            type: 'number',
        }),
        defineField({
            name: 'totalAmount',
            title: 'Total Amount (PLN)',
            type: 'number',
        }),
        defineField({
            name: 'notes',
            title: 'Customer Notes',
            type: 'text',
            rows: 2,
        }),
        defineField({
            name: 'orderDate',
            title: 'Order Date',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
        defineField({
            name: 'completedAt',
            title: 'Completed At (Timestamp)',
            type: 'datetime',
            description: 'Automatically set when order is marked as delivered or picked up',
            readOnly: true,
        }),
        defineField({
            name: 'archived',
            title: 'Archived (Downloaded)',
            type: 'boolean',
            description: 'Hide order from dashboard after CSV export',
            initialValue: false,
        }),
        defineField({
            name: 'actionLog',
            title: 'Action Log',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'staffName', title: 'Waitress Name', type: 'string' }),
                        defineField({ name: 'action', title: 'Action Taken', type: 'string' }),
                        defineField({ name: 'timestamp', title: 'Timestamp', type: 'datetime' }),
                    ],
                },
            ],
            readOnly: true,
        }),
    ],
    preview: {
        select: {
            title: 'customerName',
            subtitle: 'status',
            orderNum: 'orderNumber',
            type: 'orderType',
        },
        prepare({ title, subtitle, orderNum, type }) {
            const icon = type === 'delivery' ? '🚚' : '📦'
            return {
                title: `${icon} #${orderNum || '?'} — ${title || 'No Name'}`,
                subtitle: `Status: ${subtitle ? subtitle.toUpperCase() : 'PENDING'}`,
            }
        },
    },
    orderings: [
        {
            title: 'Newest First',
            name: 'orderDateDesc',
            by: [{ field: 'orderDate', direction: 'desc' }],
        },
    ],
})
