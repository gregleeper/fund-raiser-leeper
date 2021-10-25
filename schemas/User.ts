import { list } from '@keystone-next/keystone';
import { text, password, relationship } from '@keystone-next/keystone/fields';
import { permissions } from '../access';

export const User = list({
  // Here are the fields that `User` will have. We want an email and password so they can log in
  // a name so we can refer to them, and a way to connect users to posts.
  access: {
    operation: {
      create: () => true,
      // query: () => true,
      update: permissions.canManageUsers,
      // only people with the permission can delete themselves!
      // You can't delete yourself
      delete: permissions.canManageUsers,
    },
    filter: {
      query: () =>
        // const user = session.data;
        // const user = await context.prisma.User.findUnique({
        //   where: {
        //     id: session.itemId,
        //   },
        // });
        // // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        // return user;
        // const myUser = await context.query.User.findOne({
        //   where: {
        //     id: user.id,
        //   },
        //   query: `id name email`,
        // });
        // console.log(myUser);
        true,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    phone: text({
      validation: {
        isRequired: true,
        length: { min: 10, max: 10 },
      },
    }),
    email: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
      isFilterable: true,
    }),
    // The password field takes care of hiding details and hashing values
    password: password({ validation: { isRequired: true } }),
    products: relationship({
      ref: 'Product.user',
      many: true,
    }),
    role: relationship({
      ref: 'Role.assignedTo',
    }),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    orders: relationship({
      ref: 'Order.user',
      many: true,
    }),
  },
  // Here we can configure the Admin UI. We want to show a user's name and posts in the Admin UI
  ui: {
    listView: {
      initialColumns: ['name', 'products'],
    },
  },
});
