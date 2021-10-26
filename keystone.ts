/*
Welcome to Keystone! This file is what keystone uses to start the app.

It looks at the default export, and expects a Keystone config object.

You can find all the config options in our docs here: https://keystonejs.com/docs/apis/config
*/

import { config } from '@keystone-next/keystone';
import 'dotenv';

// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI

// Keystone auth is configured separately - check out the basic auth setup we are importing from our auth file.
import { withAuth, session } from './auth';
import { ProductImage } from './schemas/ProductImage';
import { Product } from './schemas/Product';
import { User } from './schemas/User';
import { Role } from './schemas/Role';
import { CartItem } from './schemas/CartItem';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { extendGraphqlSchema } from './mutations';

export default withAuth(
  // Using the config function helps typescript guide you to the available options.

  config({
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    db: {
      provider: 'postgresql',
      url: process.env.DATABASE_URL,
    },
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL, 'https://studio.apollographql.com'],
        credentials: true,
      },
    },
    graphql: {
      cors: {
        origin: [process.env.FRONTEND_URL, 'https://studio.apollographql.com'],
        credentials: true,
      },
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      isAccessAllowed: (context) => !!context?.session?.data,
    },

    lists: {
      User,
      Product,
      ProductImage,
      Role,
      CartItem,
      OrderItem,
      Order,
    },
    extendGraphqlSchema,
    session,
  })
);
