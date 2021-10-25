/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  integer,
  text,
  relationship,
  virtual,
} from '@keystone-next/keystone/fields';
import { list, graphql } from '@keystone-next/keystone';
import { isSignedIn, permissions } from '../access';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  access: {
    operation: {
      create: isSignedIn,
      update: () => false,
      delete: () => false,
    },
    filter: {
      query: permissions.canOrder,
    },
  },

  fields: {
    label: virtual({
      // @ts-ignore
      field: graphql.field({
        type: graphql.String,
        resolve({ total }: { total: number }) {
          return `${formatMoney(total)}`;
        },
      }),
    }),

    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});
