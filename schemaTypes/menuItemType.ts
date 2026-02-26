import { defineField, defineType } from 'sanity'

export const menuItemType = defineType({
    name: 'menuItem',
    title: 'Menu Item',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'name' },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'price',
            title: 'Price (PLN)',
            type: 'number',
            validation: (rule) => rule.required().min(0),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Śniadania', value: 'sniadania' },
                    { title: 'Mezze - Talerzyki', value: 'mezze-talerzyki' },
                    { title: 'Mezze - Talerze', value: 'mezze-talerze' },
                    { title: 'Grill', value: 'grill' },
                    { title: 'Sałatki', value: 'salatki' },
                    { title: 'Desery', value: 'desery' },
                    { title: 'Dodatki', value: 'dodatki' },
                    { title: 'Napoje', value: 'napoje' },
                    { title: 'Alkohole', value: 'alkohole' },
                    { title: 'Specjalne Okazje', value: 'specjalne-okazje' },
                ],
                layout: 'dropdown',
            },
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'allergens',
            title: 'Allergens (EU numbers)',
            type: 'array',
            of: [{ type: 'number' }],
            description: '1=Gluten 2=Crustaceans 3=Eggs 4=Fish 5=Peanuts 6=Soy 7=Milk 8=Nuts 9=Celery 10=Mustard 11=SesameSeeds 12=SO2 13=Lupin 14=Molluscs',
        }),
        defineField({
            name: 'available',
            title: 'Available',
            type: 'boolean',
            initialValue: true,
            description: 'Toggle off to hide from the menu without deleting',
        }),
        defineField({
            name: 'order',
            title: 'Sort Order',
            type: 'number',
            description: 'Lower numbers appear first within the category',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'category',
            media: 'image',
            price: 'price',
        },
        prepare({ title, subtitle, media, price }) {
            return {
                title: title || 'Unnamed Item',
                subtitle: `${subtitle || 'No category'} · ${price ? price + ' zł' : 'No price'}`,
                media,
            }
        },
    },
    orderings: [
        {
            title: 'Category',
            name: 'categoryAsc',
            by: [
                { field: 'category', direction: 'asc' },
                { field: 'order', direction: 'asc' },
            ],
        },
    ],
})
