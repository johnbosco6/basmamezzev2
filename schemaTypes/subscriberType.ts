import { defineField, defineType } from 'sanity'

export const subscriberType = defineType({
    name: 'subscriber',
    title: 'Subscribers (Marketing)',
    type: 'document',
    fields: [
        defineField({
            name: 'email',
            title: 'Email Address',
            type: 'string',
            validation: Rule => Rule.required().email(),
        }),
        defineField({
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
            description: 'Optional. Usually collected during checkout.',
        }),
        defineField({
            name: 'firstName',
            title: 'First Name',
            type: 'string',
        }),
        defineField({
            name: 'source',
            title: 'Source',
            type: 'string',
            options: {
                list: [
                    { title: 'Checkout Order', value: 'order' },
                    { title: 'Newsletter Footer', value: 'newsletter' },
                ],
            },
            validation: Rule => Rule.required(),
        }),
        defineField({
            name: 'subscribedAt',
            title: 'Subscribed At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: 'email',
            subtitle: 'source',
        },
    },
})
