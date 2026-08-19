// Revenue Leak Calculator — the commercial model.
//
// Attributable revenue = leads x booking rate x show rate x qualification rate
//                        x close rate x average first sale.
//
// Kept free of React and of any server import so it can be unit-tested directly and,
// if we later want a server-rendered PDF of the result, reused as-is.

export type StageKey = 'bookingRate' | 'showRate' | 'qualificationRate' | 'closeRate';

export interface LeakInputs {
  monthlySpend: number;
  leads: number;
  bookingRate: number;
  showRate: number;
  qualificationRate: number;
  closeRate: number;
  averageFirstSale: number;
}

/**
 * Rates a well-run acquisition system should reach, taken from the Attention-to-Revenue
 * System model. These are NOT published industry benchmarks and must never be presented
 * as such — see the footnote rendered on the page.
 */
export const TARGET_RATES: Record<StageKey, number> = {
  bookingRate: 50,
  showRate: 80,
  qualificationRate: 60,
  closeRate: 25,
};

export const STAGE_META: { key: StageKey; label: string; noun: string; from: string }[] = [
  { key: 'bookingRate', label: 'Booked a call', noun: 'your booking rate', from: 'of leads' },
  { key: 'showRate', label: 'Turned up', noun: 'your show-up rate', from: 'of bookings' },
  { key: 'qualificationRate', label: 'Genuinely qualified', noun: 'lead quality', from: 'of attended' },
  { key: 'closeRate', label: 'Became a customer', noun: 'your close rate', from: 'of qualified' },
];

export const STAGE_DIAGNOSIS: Record<StageKey, { layer: string; why: string; fix: string }> = {
  bookingRate: {
    layer: 'Layer 2 — Demand & Retargeting',
    why: 'Prospects are arriving cold. Nothing built familiarity or trust between the advert and the request for a call, so the ask lands on a stranger.',
    fix: 'Warm the audience before the ask — proof-led and objection-led retargeting of people who have already watched.',
  },
  showRate: {
    layer: 'Layer 3 — Qualification & Follow-Up',
    why: 'You are paying for appointments that never happen. Usually slow speed-to-lead, thin reminders, or calls booked too far out.',
    fix: 'Contact inside five minutes, book inside three days, and follow up more than once. This is the cheapest money on the page.',
  },
  qualificationRate: {
    layer: 'Layer 1 — Message & Creative',
    why: 'Your message is attracting the wrong buyer. The leads are cheap and plentiful and your sales team resents them.',
    fix: 'Rebuild the message around the buyer you actually want — attract fewer, better-fitting people on purpose.',
  },
  closeRate: {
    layer: 'Layer 1 — Message & Creative',
    why: 'Sales is starting every conversation from zero — explaining basics, rebuilding credibility, defending price. Your content is not pre-selling.',
    fix: 'Move the first twenty minutes of the sales call upstream, into content the prospect sees before they book.',
  },
};

export interface StageResult {
  key: StageKey;
  label: string;
  noun: string;
  from: string;
  rate: number;
  into: number;
  out: number;
  lost: number;
  isWeakest: boolean;
}

export type LeakState = 'incomplete' | 'leak' | 'no_leak';

export interface LeakResult {
  state: LeakState;
  customers: number;
  revenue: number;
  costPerCustomer: number | null;
  roas: number | null;
  stages: StageResult[];
  weakest: StageKey | null;
  /** Extra monthly revenue from lifting the single weakest stage to its target. */
  singleStageGain: number;
  /** Extra monthly revenue from lifting every below-target stage to its target. */
  fullChainGain: number;
  /** Revenue multiple if the whole chain hits target. 0 when current revenue is 0. */
  fullChainMultiple: number;
}

function clampRate(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value > 100 ? 100 : value;
}

function nonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function chainRevenue(rates: Record<StageKey, number>, leads: number, averageFirstSale: number): number {
  return (
    leads *
    (rates.bookingRate / 100) *
    (rates.showRate / 100) *
    (rates.qualificationRate / 100) *
    (rates.closeRate / 100) *
    averageFirstSale
  );
}

export function calculateLeak(raw: LeakInputs): LeakResult {
  const leads = nonNegative(raw.leads);
  const monthlySpend = nonNegative(raw.monthlySpend);
  const averageFirstSale = nonNegative(raw.averageFirstSale);

  const rates: Record<StageKey, number> = {
    bookingRate: clampRate(raw.bookingRate),
    showRate: clampRate(raw.showRate),
    qualificationRate: clampRate(raw.qualificationRate),
    closeRate: clampRate(raw.closeRate),
  };

  const revenue = chainRevenue(rates, leads, averageFirstSale);
  const customers = averageFirstSale > 0 ? revenue / averageFirstSale : 0;

  // Weakest link. In a multiplied chain the absolute gain from lifting stage i to its
  // target is proportional to the product of every OTHER rate, so the stage furthest
  // below target by value — in practice the lowest rate — always returns the most money.
  let weakest: StageKey | null = null;
  let singleStageGain = 0;
  for (const { key } of STAGE_META) {
    if (rates[key] >= TARGET_RATES[key]) continue;
    const lifted = { ...rates, [key]: TARGET_RATES[key] };
    const gain = chainRevenue(lifted, leads, averageFirstSale) - revenue;
    if (gain > singleStageGain) {
      singleStageGain = gain;
      weakest = key;
    }
  }

  // Walk the funnel to get per-stage counts.
  const stages: StageResult[] = [];
  let running = leads;
  for (const meta of STAGE_META) {
    const into = running;
    const out = into * (rates[meta.key] / 100);
    stages.push({
      key: meta.key,
      label: meta.label,
      noun: meta.noun,
      from: meta.from,
      rate: rates[meta.key],
      into,
      out,
      lost: into - out,
      isWeakest: weakest === meta.key,
    });
    running = out;
  }

  const targetRates: Record<StageKey, number> = {
    bookingRate: Math.max(rates.bookingRate, TARGET_RATES.bookingRate),
    showRate: Math.max(rates.showRate, TARGET_RATES.showRate),
    qualificationRate: Math.max(rates.qualificationRate, TARGET_RATES.qualificationRate),
    closeRate: Math.max(rates.closeRate, TARGET_RATES.closeRate),
  };
  const fullChainRevenue = chainRevenue(targetRates, leads, averageFirstSale);
  const fullChainGain = fullChainRevenue - revenue;

  const state: LeakState = leads <= 0 || averageFirstSale <= 0 ? 'incomplete' : weakest ? 'leak' : 'no_leak';

  return {
    state,
    customers,
    revenue,
    costPerCustomer: customers > 0 && monthlySpend > 0 ? monthlySpend / customers : null,
    roas: monthlySpend > 0 ? revenue / monthlySpend : null,
    stages,
    weakest,
    singleStageGain,
    fullChainGain,
    fullChainMultiple: revenue > 0 ? fullChainRevenue / revenue : 0,
  };
}
