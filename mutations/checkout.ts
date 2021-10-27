/* eslint-disable */
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../node_modules/.keystone/types';

/* eslint-disable */
import { KeystoneContext } from '@keystone-next/keystone/types';
import stripeConfig from '../lib/stripe';

interface Arguments {
  token: string
}


async function checkout(
  root: any,
  { token }: Arguments,
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure they are signed in
  const userId = context.session.itemId;
  if(!userId) {
    throw new Error('Sorry! You must be signed in to create an order!')
  }
  // 1.5 Query the current user
  const user = await context.query.User.findOne({
    where: { id: userId },
    query: `
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `
  });
  console.dir(user, { depth: null })
  // 2. calc the total price for their order
  const cartItems = user.cart.filter((cartItem: { product: any; }) => cartItem.product);
  const amount = cartItems.reduce(function(tally: number, cartItem: CartItemCreateInput) {
    // @ts-ignore
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
  console.log(amount);
  // 3. create the charge with the stripe library
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'USD',
    confirm: true,
    payment_method: token,
  }).catch(err => {
    console.log(err);
    throw new Error(err.message);
  });
  console.log(charge)
  // 4. Convert the cartItems to OrderItems
  // @ts-ignore
  const orderItems = cartItems.map(cartItem => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id }},
    }
    return orderItem;
  })
  console.log('gonna create the order')
  // 5. Create the order and return it
  const order = await context.query.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId }}
    },
    query: `id charge total items { id }`,

  });
  // 6. Clean up any old cart item
  // @ts-ignore
  const cartItemIds = user.cart.map(cartItem => { return {id: cartItem.id}});
  console.log('gonna create delete cartItems')
  await context.query.CartItem.deleteMany({ where: 

    cartItemIds
  
  });
  return order;
}

export default checkout;