import Stripe from 'stripe';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const stripeConfig = new Stripe(process.env.STRIPE_SECRET || '', {
  apiVersion: '2020-08-27',
});

export default stripeConfig;
