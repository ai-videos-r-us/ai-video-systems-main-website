import { describe, expect, it } from 'vitest';
import { calculateLeak, TARGET_RATES, type LeakInputs } from '../model.js';

const BASE: LeakInputs = {
  monthlySpend: 10000,
  leads: 100,
  bookingRate: 40,
  showRate: 70,
  qualificationRate: 50,
  closeRate: 20,
  averageFirstSale: 6000,
};

describe('calculateLeak', () => {
  it('reproduces the worked example from the Attention-to-Revenue System model', () => {
    // 100 leads at 40/70/50/20 -> 2.8 customers.
    const r = calculateLeak(BASE);
    expect(r.customers).toBeCloseTo(2.8, 6);
    expect(r.revenue).toBeCloseTo(16800, 6);
  });

  it('reaches 6 customers when every stage hits target, from the same leads', () => {
    const atTarget = calculateLeak({ ...BASE, ...TARGET_RATES });
    expect(atTarget.customers).toBeCloseTo(6, 6);
    expect(atTarget.revenue).toBeCloseTo(36000, 6);
  });

  it('reports the full-chain gain and multiple against the current chain', () => {
    const r = calculateLeak(BASE);
    expect(r.fullChainGain).toBeCloseTo(36000 - 16800, 6);
    expect(r.fullChainMultiple).toBeCloseTo(36000 / 16800, 6);
  });

  it('flags booking rate as the weakest link on the base case', () => {
    const r = calculateLeak(BASE);
    expect(r.weakest).toBe('bookingRate');
    // 100 x 50% x 70% x 50% x 20% x 6000 = 21000, so the gain is 4200.
    expect(r.singleStageGain).toBeCloseTo(4200, 6);
  });

  it('moves the weakest link when another stage drops further below target', () => {
    const r = calculateLeak({ ...BASE, closeRate: 5 });
    expect(r.weakest).toBe('closeRate');
  });

  it('always picks the stage with the largest absolute gain', () => {
    const r = calculateLeak(BASE);
    const gains = r.stages
      .filter((s) => s.rate < TARGET_RATES[s.key])
      .map((s) => {
        const lifted = calculateLeak({ ...BASE, [s.key]: TARGET_RATES[s.key] });
        return { key: s.key, gain: lifted.revenue - r.revenue };
      });
    const best = gains.reduce((a, b) => (b.gain > a.gain ? b : a));
    expect(r.weakest).toBe(best.key);
    expect(r.singleStageGain).toBeCloseTo(best.gain, 6);
  });

  it('returns the no_leak state when every stage is at or above target', () => {
    const r = calculateLeak({ ...BASE, bookingRate: 60, showRate: 90, qualificationRate: 70, closeRate: 30 });
    expect(r.state).toBe('no_leak');
    expect(r.weakest).toBeNull();
    expect(r.singleStageGain).toBe(0);
    expect(r.fullChainGain).toBeCloseTo(0, 6);
  });

  it('returns the incomplete state without leads or a sale value', () => {
    expect(calculateLeak({ ...BASE, leads: 0 }).state).toBe('incomplete');
    expect(calculateLeak({ ...BASE, averageFirstSale: 0 }).state).toBe('incomplete');
  });

  it('carries stage counts through the funnel', () => {
    const r = calculateLeak(BASE);
    expect(r.stages.map((s) => Math.round(s.out))).toEqual([40, 28, 14, 3]);
    expect(r.stages[0].lost).toBeCloseTo(60, 6);
  });

  it('clamps nonsense input rather than producing NaN', () => {
    const r = calculateLeak({ ...BASE, bookingRate: 900, showRate: -20, closeRate: Number.NaN });
    expect(Number.isFinite(r.revenue)).toBe(true);
    expect(r.stages[0].rate).toBe(100);
    expect(r.stages[1].rate).toBe(0);
    expect(r.stages[3].rate).toBe(0);
  });

  it('omits cost per customer and ROAS when there is no spend', () => {
    const r = calculateLeak({ ...BASE, monthlySpend: 0 });
    expect(r.costPerCustomer).toBeNull();
    expect(r.roas).toBeNull();
  });
});
