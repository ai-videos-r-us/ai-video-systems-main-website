export type Currency = 'GBP' | 'USD';

export const CURRENCY_SYMBOL: Record<Currency, string> = { GBP: '£', USD: '$' };

export function money(value: number, currency: Currency): string {
  if (!Number.isFinite(value)) return '—';
  return CURRENCY_SYMBOL[currency] + Math.round(value).toLocaleString('en-GB');
}

/** People counts: whole numbers once we're past ten, one decimal below that. */
export function people(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return value >= 10 ? Math.round(value).toLocaleString('en-GB') : String(Math.round(value * 10) / 10);
}
