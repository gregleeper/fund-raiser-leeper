import { integer, relationship } from '@keystone-next/keystone/fields';
import { list } from '@keystone-next/keystone';
import { isSignedIn, permissions } from '../access';

export const CartItem = list({
  access: {
    operation: {
      create: isSignedIn,
      query: permissions.canOrder,
      update: permissions.canOrder,
      delete: permissions.canOrder,
    },
  },

  ui: {
    listView: {
      initialColumns: ['product', 'quantity', 'user'],
    },
  },
  fields: {
    // TODO: Custom Label in here
    quantity: integer({
      defaultValue: 1,
      validation: {
        isRequired: true,
      },
    }),
    product: relationship({ ref: 'Product' }),
    user: relationship({ ref: 'User.cart' }),
  },
});
