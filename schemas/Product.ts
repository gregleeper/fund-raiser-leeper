import { list } from '@keystone-next/keystone';
import {
  text,
  select,
  relationship,
  integer,
} from '@keystone-next/keystone/fields';
import { permissions, isSignedIn } from '../access';

export const Product = list({
  access: {
    operation: {
      create: isSignedIn,
      query: permissions.canReadProducts,
      update: permissions.canManageProducts,
      delete: permissions.canManageProducts,
    },
  },
  fields: {
    name: text(),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    photo: relationship({
      ref: 'ProductImage.product',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
    status: select({
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Unavailable', value: 'UNAVAILABLE' },
      ],
      defaultValue: 'DRAFT',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    price: integer(),
    user: relationship({
      ref: 'User.products',
      // defaultValue: ({context}) => ({
      //   connect: {id: context.session.itemId}
      // })
    }),
  },
});
