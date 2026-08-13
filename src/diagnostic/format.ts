const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });
const number1dp = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 });
const number0dp = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 });

export function formatGBP(value: number): string {
  return gbp.format(Math.round(value));
}

export function formatNumber1dp(value: number): string {
  return number1dp.format(value);
}

export function formatNumber0dp(value: number): string {
  return number0dp.format(Math.round(value));
}
