const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function formatMoney(cents: number) {
  const dollars = cents / 100;
  return formatter.format(dollars);
}
