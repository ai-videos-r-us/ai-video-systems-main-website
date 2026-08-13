import { describe, expect, it } from 'vitest';
import { SCORED_QUESTIONS } from '../questions';
import type { CategoryKey, ContextAnswers, FinancialInputs, ScoredAnswers } from '../types';
import {
  classifyReadiness,
  computeAcquisitionScenarioBlock,
  computeAgedEnquiryIllustration,
  computeConstraintDiagnosis,
  computeDataConfidence,
  computeFitScore,
  computeNeedScore,
  computeTriggerSeverity,
  getAllCategoryScores,
  getFitBand,
  getNeedBand,
  getOverallReadiness,
  routeCta,
} from '../scoring';
import { toPublicResult } from '../serialize';
import { runFullScoring } from '../scoring';

function buildAnswers(pick: (options: { id: string; score: number }[]) => string): ScoredAnswers {
  const answers: ScoredAnswers = {};
  for (const q of SCORED_QUESTIONS) {
    answers[q.id] = pick(q.options);
  }
  return answers;
}

const MAX_ANSWERS = buildAnswers((options) => options.find((o) => o.score === 100)!.id);
const MIN_ANSWERS = buildAnswers((options) => options.find((o) => o.score === 0)!.id);

describe('category + overall readiness scoring', () => {
  it('all-maximum answers produce category scores of 100 and overall 100', () => {
    const categoryScores = getAllCategoryScores(MAX_ANSWERS);
    for (const key of Object.keys(categoryScores) as CategoryKey[]) {
      expect(categoryScores[key]).toBe(100);
    }
    expect(getOverallReadiness(categoryScores)).toBeCloseTo(100, 10);
  });

  it('all-minimum answers produce category scores of 0 and overall 0', () => {
    const categoryScores = getAllCategoryScores(MIN_ANSWERS);
    for (const key of Object.keys(categoryScores) as CategoryKey[]) {
      expect(categoryScores[key]).toBe(0);
    }
    expect(getOverallReadiness(categoryScores)).toBe(0);
  });

  it('category score is the exact arithmetic mean of its four answers, at full precision', () => {
    // acquisition: a1=100, a2=75, a3=50, a4=0 -> mean 56.25 (not a round number)
    const answers: ScoredAnswers = {
      ...MIN_ANSWERS,
      a1: 'a1_100',
      a2: 'a2_75',
      a3: 'a3_50',
      a4: 'a4_0',
    };
    const categoryScores = getAllCategoryScores(answers);
    expect(categoryScores.acquisition).toBe(56.25);
  });

  it('overall readiness uses the exact published weights', () => {
    const categoryScores: Record<CategoryKey, number> = {
      acquisition: 80,
      resilience: 60,
      readiness: 70,
      performance: 50,
      existing: 90,
      visibility: 40,
      capacity: 100,
    };
    const expected =
      80 * 0.15 + 60 * 0.1 + 70 * 0.15 + 50 * 0.2 + 90 * 0.15 + 40 * 0.15 + 100 * 0.1;
    expect(getOverallReadiness(categoryScores)).toBeCloseTo(expected, 10);
  });
});

describe('classification boundaries', () => {
  const cases: [number, string][] = [
    [0, 'not_scale_ready'],
    [39, 'not_scale_ready'],
    [40, 'growth_constrained'],
    [59, 'growth_constrained'],
    [60, 'conditionally_ready'],
    [74, 'conditionally_ready'],
    [75, 'scale_ready_with_guardrails'],
    [89, 'scale_ready_with_guardrails'],
    [90, 'highly_scale_ready'],
    [100, 'highly_scale_ready'],
  ];

  it.each(cases)('score %i classifies as %s', (score, expected) => {
    expect(classifyReadiness(score)).toBe(expected);
  });
});

describe('trigger severity', () => {
  it('is 0 when no trigger is selected', () => {
    expect(computeTriggerSeverity([])).toBe(0);
    expect(computeTriggerSeverity(undefined)).toBe(0);
    expect(computeTriggerSeverity(['trigger_none'])).toBe(0);
  });

  it('equals the single trigger severity when exactly one is selected', () => {
    expect(computeTriggerSeverity(['trigger_founder_ceiling'])).toBe(60);
    expect(computeTriggerSeverity(['trigger_cpl_cac_deteriorated'])).toBe(100);
  });

  it('is highestSeverity + 10 * (n - 1), capped at 100, for several triggers', () => {
    expect(
      computeTriggerSeverity(['trigger_cpl_cac_deteriorated', 'trigger_dormant_database'])
    ).toBe(100); // 100 + 10*1 = 110 -> capped
    expect(
      computeTriggerSeverity([
        'trigger_founder_ceiling',
        'trigger_hiring_expansion',
        'trigger_creative_deteriorating',
      ])
    ).toBe(90); // highest 70 + 10*2 = 90
  });
});

describe('constraint diagnosis', () => {
  const baseScores: Record<CategoryKey, number> = {
    acquisition: 100,
    resilience: 100,
    readiness: 100,
    performance: 100,
    existing: 100,
    visibility: 100,
    capacity: 100,
  };

  it('picks the highest weighted deficiency with stable category-order tie-break', () => {
    const scores = { ...baseScores, acquisition: 50, readiness: 50 }; // both baseRisk 7.5
    const diagnosis = computeConstraintDiagnosis(scores, []);
    expect(diagnosis.primary.categoryKey).toBe('acquisition'); // declared first
    expect(diagnosis.secondary.categoryKey).toBe('readiness');
    expect(diagnosis.interconnected).toBe(true); // exactly tied
  });

  it('applies a 10% uplift to constraints matched by a selected trigger, which can flip the ranking', () => {
    // acquisition baseRisk = 100*0.15 = 15, boosted 15*1.1 = 16.5
    // performance baseRisk = 80*0.20 = 16 (unboosted) -> acquisition should now win
    const scores = { ...baseScores, acquisition: 0, performance: 20 };
    const withoutTrigger = computeConstraintDiagnosis(scores, []);
    expect(withoutTrigger.primary.categoryKey).toBe('performance');

    const withTrigger = computeConstraintDiagnosis(scores, ['trigger_cpl_cac_deteriorated']);
    expect(withTrigger.primary.categoryKey).toBe('acquisition');
    expect(withTrigger.primary.boosted).toBe(true);
    expect(withTrigger.primary.adjustedRisk).toBeCloseTo(16.5, 10);
    expect(withTrigger.secondary.categoryKey).toBe('performance');
    expect(withTrigger.interconnected).toBe(true); // within 5%: (16.5-16)/16.5 = 3.03%
  });

  it('a trigger alone cannot manufacture risk on a category with a perfect score', () => {
    // acquisition is perfect (score 100 -> baseRisk 0); boosting 0 * 1.1 is still 0.
    const scores = { ...baseScores, performance: 0 };
    const diagnosis = computeConstraintDiagnosis(scores, ['trigger_cpl_cac_deteriorated']);
    expect(diagnosis.primary.categoryKey).toBe('performance');
    const acquisitionRisk = diagnosis.allRisks.find((r) => r.categoryKey === 'acquisition')!;
    expect(acquisitionRisk.adjustedRisk).toBe(0);
  });

  describe('poor-quality-leads trigger resolution', () => {
    it('boosts Buyer Trust and Readiness Gap when readiness scores lower than performance', () => {
      const scores = { ...baseScores, readiness: 50, performance: 90 };
      const diagnosis = computeConstraintDiagnosis(scores, ['trigger_poor_quality_leads']);
      const readinessRisk = diagnosis.allRisks.find((r) => r.categoryKey === 'readiness')!;
      const performanceRisk = diagnosis.allRisks.find((r) => r.categoryKey === 'performance')!;
      expect(readinessRisk.boosted).toBe(true);
      expect(performanceRisk.boosted).toBe(false);
    });

    it('boosts Lead-Handling Leakage when performance scores lower than readiness', () => {
      const scores = { ...baseScores, readiness: 90, performance: 50 };
      const diagnosis = computeConstraintDiagnosis(scores, ['trigger_poor_quality_leads']);
      const readinessRisk = diagnosis.allRisks.find((r) => r.categoryKey === 'readiness')!;
      const performanceRisk = diagnosis.allRisks.find((r) => r.categoryKey === 'performance')!;
      expect(readinessRisk.boosted).toBe(false);
      expect(performanceRisk.boosted).toBe(true);
    });

    it('boosts both when the two categories are within 5 points', () => {
      const scores = { ...baseScores, readiness: 60, performance: 63 };
      const diagnosis = computeConstraintDiagnosis(scores, ['trigger_poor_quality_leads']);
      const readinessRisk = diagnosis.allRisks.find((r) => r.categoryKey === 'readiness')!;
      const performanceRisk = diagnosis.allRisks.find((r) => r.categoryKey === 'performance')!;
      expect(readinessRisk.boosted).toBe(true);
      expect(performanceRisk.boosted).toBe(true);
    });
  });
});

describe('data confidence', () => {
  const fullyAnsweredKnown: ScoredAnswers = buildAnswers((options) =>
    options.find((o) => !o.id.endsWith('_unknown') && o.score !== undefined)!.id
  );

  const alignedFinancial: FinancialInputs = {
    monthlySpendGbp: 10000,
    paidEnquiries: 200,
    completedPlans: 20,
    contributionPerPlanGbp: 1200,
    alignment: 'yes',
  };

  it('is High only when ratio >=85%, all 4 core inputs supplied, alignment yes, and R3 >= 50', () => {
    const answers: ScoredAnswers = { ...fullyAnsweredKnown, r3: 'r3_75' };
    const result = computeDataConfidence(answers, alignedFinancial);
    expect(result.level).toBe('high');
  });

  it('is Low when the known-data ratio is below 65%', () => {
    const answers: ScoredAnswers = buildAnswers((options) => options.find((o) => o.id.endsWith('_unknown'))?.id ?? options[0].id);
    const result = computeDataConfidence(answers, {});
    expect(result.level).toBe('low');
    expect(result.reasons).toContain('known_data_ratio_below_65_percent');
  });

  it('is Low when two or more core exact inputs are missing, even with good question coverage', () => {
    const answers: ScoredAnswers = { ...fullyAnsweredKnown, r3: 'r3_75' };
    const result = computeDataConfidence(answers, { monthlySpendGbp: 10000 });
    expect(result.level).toBe('low');
    expect(result.reasons).toContain('two_or_more_core_inputs_missing');
  });

  it('is Low when R3 is r3_0 or r3_unknown', () => {
    const answers: ScoredAnswers = { ...fullyAnsweredKnown, r3: 'r3_0' };
    const result = computeDataConfidence(answers, alignedFinancial);
    expect(result.level).toBe('low');
    expect(result.reasons).toContain('crm_reliability_untrustworthy_or_unknown');
  });

  it('is Low when plan sales are not attributable to the acquisition cohort', () => {
    const answers: ScoredAnswers = { ...fullyAnsweredKnown, r3: 'r3_75' };
    const result = computeDataConfidence(answers, { ...alignedFinancial, alignment: 'no' });
    expect(result.level).toBe('low');
    expect(result.reasons).toContain('plan_sales_not_attributable_to_cohort');
  });

  it('is Medium when the ratio is 65-84.99%, not otherwise Low', () => {
    // Answer all scored questions with a known value except a handful, to land the ratio in the medium band.
    const answers: ScoredAnswers = { ...fullyAnsweredKnown, r3: 'r3_75' };
    const questionsWithUnknown = SCORED_QUESTIONS.filter((q) =>
      q.options.some((o) => o.id.endsWith('_unknown'))
    ).slice(0, 6);
    for (const q of questionsWithUnknown) {
      answers[q.id] = q.options.find((o) => o.id.endsWith('_unknown'))!.id;
    }
    const result = computeDataConfidence(answers, alignedFinancial);
    expect(result.level).toBe('medium');
  });

  it('is Medium when exactly one core exact input is missing', () => {
    const answers: ScoredAnswers = { ...fullyAnsweredKnown, r3: 'r3_75' };
    const { contributionPerPlanGbp, ...rest } = alignedFinancial;
    const result = computeDataConfidence(answers, rest);
    expect(result.level).toBe('medium');
    expect(result.reasons).toContain('one_core_input_missing');
  });

  it('is Medium when R3 is r3_25', () => {
    const answers: ScoredAnswers = { ...fullyAnsweredKnown, r3: 'r3_25' };
    const result = computeDataConfidence(answers, alignedFinancial);
    expect(result.level).toBe('medium');
  });
});

describe('need score', () => {
  it('matches the published formula', () => {
    const score = computeNeedScore(60, 80, 100);
    expect(score).toBeCloseTo(0.7 * 40 + 0.2 * 80 + 0.1 * 100, 10);
    expect(score).toBeCloseTo(54, 10);
  });

  it('is clamped to [0, 100]', () => {
    expect(computeNeedScore(0, 100, 100)).toBe(100);
    expect(computeNeedScore(100, 0, 0)).toBe(0);
  });

  it.each([
    [10, 'low'],
    [39, 'low'],
    [40, 'meaningful'],
    [64, 'meaningful'],
    [65, 'high'],
    [79, 'high'],
    [80, 'critical'],
    [100, 'critical'],
  ])('need score %i has band %s', (score, band) => {
    expect(getNeedBand(score)).toBe(band);
  });
});

describe('fit score', () => {
  it('sums fit points across the eight fit-bearing context questions', () => {
    const context: ContextAnswers = {
      ctx3: 'final_authority', // 10
      ctx5: 'spend_10000_19999', // 22
      ctx6: 'enq_250_499', // 12
      ctx7: 'econ_consistent_known_cac', // 12
      ctx8: 'cap_two_to_three', // 6
      ctx9: 'crm_partial_outcome', // 6
      ctx10: 'timing_now_90_days', // 10
      ctx11: 'data_sharing_yes', // 5
    };
    expect(computeFitScore(context)).toBe(10 + 22 + 12 + 12 + 6 + 6 + 10 + 5);
  });

  it('treats every option id in every fit question correctly (spot-check max option each)', () => {
    const context: ContextAnswers = {
      ctx3: 'final_authority',
      ctx5: 'spend_20000_plus',
      ctx6: 'enq_500_plus',
      ctx7: 'econ_proven_contribution',
      ctx8: 'cap_four_plus_spare',
      ctx9: 'crm_dependable_exportable',
      ctx10: 'timing_now_90_days',
      ctx11: 'data_sharing_yes',
    };
    expect(computeFitScore(context)).toBe(100);
  });

  it('treats missing answers as 0 fit points', () => {
    expect(computeFitScore({})).toBe(0);
  });

  it.each([
    [10, 'low'],
    [39, 'low'],
    [40, 'developing'],
    [64, 'developing'],
    [65, 'strong'],
    [79, 'strong'],
    [80, 'priority'],
    [100, 'priority'],
  ])('fit score %i has band %s', (score, band) => {
    expect(getFitBand(score)).toBe(band);
  });
});

describe('CTA routing matrix', () => {
  it.each([
    [70, 70, 'primary_deeper_analysis'],
    [70, 50, 'result_review_checklist'],
    [70, 20, 'tailored_action_plan'],
    [30, 70, 'benchmarking_reassessment'],
    [30, 50, 'resources_only'],
    [30, 20, 'resources_only'],
  ])('need=%i fit=%i -> %s', (need, fit, expected) => {
    expect(routeCta(need, fit)).toBe(expected);
  });
});

describe('financial calculation engine', () => {
  const validInput: FinancialInputs = {
    monthlySpendGbp: 10000,
    paidEnquiries: 200,
    completedPlans: 20,
    contributionPerPlanGbp: 1200,
    alignment: 'yes',
  };

  it('computes current performance and the three £10,000 scenarios correctly', () => {
    const result = computeAcquisitionScenarioBlock(validInput);
    expect(result.suppressed).toBe(false);
    expect(result.current!.currentCplGbp).toBeCloseTo(50, 10);
    expect(result.current!.currentLeadToPlanRate).toBeCloseTo(0.1, 10);
    expect(result.current!.currentCacGbp).toBeCloseTo(500, 10);
    expect(result.current!.currentContributionAfterAcquisitionGbp).toBeCloseTo(14000, 10);

    const [holds, plus25, plus50] = result.scenarios!;
    expect(holds.scenarioCplGbp).toBeCloseTo(50, 10);
    expect(holds.additionalEnquiries).toBeCloseTo(200, 10);
    expect(holds.additionalPlans).toBeCloseTo(20, 10);
    expect(holds.illustrativeContributionAfterAcquisitionGbp).toBeCloseTo(14000, 10);

    expect(plus25.scenarioCplGbp).toBeCloseTo(62.5, 10);
    expect(plus25.additionalEnquiries).toBeCloseTo(160, 10);
    expect(plus25.additionalPlans).toBeCloseTo(16, 10);
    expect(plus25.illustrativeContributionAfterAcquisitionGbp).toBeCloseTo(9200, 10);

    expect(plus50.scenarioCplGbp).toBeCloseTo(75, 10);
    expect(plus50.additionalEnquiries).toBeCloseTo(133.333333, 4);
    expect(plus50.additionalPlans).toBeCloseTo(13.333333, 4);
    expect(plus50.illustrativeContributionAfterAcquisitionGbp).toBeCloseTo(6000, 4);
  });

  it('computes conversion-leverage illustration', () => {
    const result = computeAcquisitionScenarioBlock(validInput);
    expect(result.conversionLeverage!.plansAtPlus1Point).toBeCloseTo(22, 10);
    expect(result.conversionLeverage!.plansAtPlus2Points).toBeCloseTo(24, 10);
    expect(result.conversionLeverage!.additionalPlansAtPlus1).toBeCloseTo(2, 10);
    expect(result.conversionLeverage!.additionalPlansAtPlus2).toBeCloseTo(4, 10);
    expect(result.conversionLeverage!.additionalGrossContributionAtPlus1Gbp).toBeCloseTo(2400, 10);
    expect(result.conversionLeverage!.additionalGrossContributionAtPlus2Gbp).toBeCloseTo(4800, 10);
  });

  it('raises a capacity warning only when a scenario would exceed stated spare capacity', () => {
    const tight = computeAcquisitionScenarioBlock({ ...validInput, spareMonthlyCapacity: 150 });
    expect(tight.capacityWarning).toBe(true);

    const roomy = computeAcquisitionScenarioBlock({ ...validInput, spareMonthlyCapacity: 300 });
    expect(roomy.capacityWarning).toBe(false);
  });

  it('protects against zero/missing denominators by suppressing rather than dividing', () => {
    expect(computeAcquisitionScenarioBlock({ ...validInput, paidEnquiries: 0 }).suppressed).toBe(true);
    expect(computeAcquisitionScenarioBlock({ ...validInput, completedPlans: 0 }).suppressed).toBe(true);
    expect(computeAcquisitionScenarioBlock({ ...validInput, monthlySpendGbp: undefined }).suppressed).toBe(true);
  });

  it('suppresses when alignment is not "yes"', () => {
    for (const alignment of ['partly', 'no', 'not_sure'] as const) {
      const result = computeAcquisitionScenarioBlock({ ...validInput, alignment });
      expect(result.suppressed).toBe(true);
      expect(result.missing).toContain('alignment_confirmation');
    }
  });

  it('suppresses when contribution per plan is unknown', () => {
    const result = computeAcquisitionScenarioBlock({ ...validInput, contributionPerPlanGbp: undefined });
    expect(result.suppressed).toBe(true);
    expect(result.missing).toContain('contribution_per_plan');
  });

  it('suppresses when the sample is fewer than 25 paid enquiries', () => {
    const result = computeAcquisitionScenarioBlock({ ...validInput, paidEnquiries: 10, completedPlans: 1 });
    expect(result.suppressed).toBe(true);
    expect(result.missing).toContain('minimum_sample_size_25_paid_enquiries');
  });

  it('computes the aged-enquiry recovery illustration at 0.5%, 1% and 2%', () => {
    const result = computeAgedEnquiryIllustration({
      eligibleAgedEnquiries: 1000,
      contributionPerPlanGbp: 1200,
    });
    expect(result.suppressed).toBe(false);
    const [half, one, two] = result.scenarios!;
    expect(half.recoveredPlans).toBeCloseTo(5, 10);
    expect(half.illustrativeGrossContributionGbp).toBeCloseTo(6000, 10);
    expect(one.recoveredPlans).toBeCloseTo(10, 10);
    expect(one.illustrativeGrossContributionGbp).toBeCloseTo(12000, 10);
    expect(two.recoveredPlans).toBeCloseTo(20, 10);
    expect(two.illustrativeGrossContributionGbp).toBeCloseTo(24000, 10);
  });

  it('suppresses the aged-enquiry illustration independently when its own inputs are missing', () => {
    expect(computeAgedEnquiryIllustration({}).suppressed).toBe(true);
    expect(
      computeAgedEnquiryIllustration({ eligibleAgedEnquiries: 1000 }).suppressed
    ).toBe(true);
  });
});

describe('public result serializer', () => {
  it('never exposes hidden Need/Fit scores or bands', () => {
    const result = runFullScoring({
      scoredAnswers: MAX_ANSWERS,
      context: { ctx3: 'final_authority', ctx10: 'timing_now_90_days' },
      financial: {
        monthlySpendGbp: 10000,
        paidEnquiries: 200,
        completedPlans: 20,
        contributionPerPlanGbp: 1200,
        alignment: 'yes',
      },
    });
    const publicResult = toPublicResult(result);
    const serialized = JSON.stringify(publicResult);
    expect(serialized).not.toMatch(/needScore/i);
    expect(serialized).not.toMatch(/fitScore/i);
    expect(serialized).not.toMatch(/needBand/i);
    expect(serialized).not.toMatch(/fitBand/i);
    expect((publicResult as unknown as Record<string, unknown>).needScore).toBeUndefined();
    expect((publicResult as unknown as Record<string, unknown>).fitScore).toBeUndefined();
  });

  it('still exposes the seven public category scores and overall classification', () => {
    const result = runFullScoring({
      scoredAnswers: MIN_ANSWERS,
      context: {},
      financial: {},
    });
    const publicResult = toPublicResult(result);
    expect(Object.keys(publicResult.categoryScores)).toHaveLength(7);
    expect(publicResult.overallReadinessRounded).toBe(0);
    expect(publicResult.classification).toBe('not_scale_ready');
  });
});
