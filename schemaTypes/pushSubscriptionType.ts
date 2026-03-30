import { defineField, defineType } from 'sanity'

export const pushSubscriptionType = defineType({
    name: 'pushSubscription',
    title: 'Push Subscriptions (Admin)',
    type: 'document',
    fields: [
        defineField({
            name: 'endpoint',
            title: 'Endpoint',
            type: 'string',
        }),
        defineField({
            name: 'keys',
            title: 'Keys (JSON String)',
            type: 'text',
        }),
        defineField({
            name: 'deviceName',
            title: 'Device Name',
            type: 'string',
        }),
        defineField({
            name: 'createdAt',
            title: 'Created At',
            type: 'datetime',
        }),
    ],
    preview: {
        select: {
            title: 'endpoint',
            subtitle: 'createdAt',
        },
    },
})
