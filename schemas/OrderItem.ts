import { list } from '@keystone-next/keystone';
import { text, relationship, integer } from '@keystone-next/keystone/fields';

export const OrderItem = list({
  fields: {
    name: text(),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    photo: relationship({
      ref: 'ProductImage',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),

    price: integer(),
    quantity: integer(),
    order: relationship({
      ref: 'Order.items',
    }),
  },
});
