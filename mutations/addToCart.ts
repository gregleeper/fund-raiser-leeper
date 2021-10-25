// eslint-disable

import { KeystoneContext } from '@keystone-next/keystone/types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<any> {
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this.');
  }
  const allCartItems = await context.query.CartItem.findMany({
    where: {
      user: { id: { equals: sesh.itemId } },
      product: { id: { equals: productId } },
    },
    query: `id quantity`,
  });

  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    return context.query.CartItem.updateOne({
      where: { id: existingCartItem.id },

      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }

  return context.query.CartItem.createOne({
    data: {
      product: {
        connect: {
          id: productId,
        },
      },
      user: {
        connect: {
          id: sesh.itemId,
        },
      },
    },
  });
}
