import {
  CATEGORIES,
  CATEGORY_TO_CONSTRAINT,
  CLASSIFICATION_BANDS,
  CORE_FINANCIAL_INPUT_KEYS,
  MIN_STABLE_SAMPLE_PAID_ENQUIRIES,
} from './constants';
import {
  CTX3_DECISION_AUTHORITY,
  CTX5_SPEND,
  CTX6_ENQUIRY_VOLUME,
  CTX7_ECONOMICS_MATURITY,
  CTX8_CAPACITY,
  CTX9_CRM,
  CTX10_TIMING,
  CTX11_DATA_SHARING,
  CTX12_TRIGGERS,
} from './context-questions';
import { SCORED_QUESTION_MAP, SCORED_QUESTIONS } from './questions';
import type {
  Alignment,
  CategoryKey,
  ConstraintKey,
  ContextAnswers,
  CtaVariant,
  DataConfidenceLevel,
  FinancialInputs,
  FitBand,
  NeedBand,
  ReadinessClassification,
  ScoredAnswers,
} from './types';

// ---------------------------------------------------------------------------
// Category + overall readiness scoring
// ---------------------------------------------------------------------------

/** Score for a single answered scored-question. Throws if the answer id is unknown. */
export function getAnswerScore(questionId: string, answerId: string): number {
  const question = SCORED_QUESTION_MAP[questionId];
  if (!question) throw new Error(`Unknown scored question: ${questionId}`);
  const option = question.options.find((o) => o.id === answerId);
  if (!option) throw new Error(`Unknown answer "${answerId}" for question "${questionId}"`);
  return option.score;
}

/** Arithmetic mean of the four answer scores for a category. Full precision, not rounded. */
export function getCategoryScore(answers: ScoredAnswers, categoryKey: CategoryKey): number {
  const questions = SCORED_QUESTIONS.filter((q) => q.categoryKey === categoryKey);
  const scores = questions.map((q) => {
    const answerId = answers[q.id];
    if (!answerId) throw new Error(`Missing answer for question "${q.id}"`);
    return getAnswerScore(q.id, answerId);
  });
  return scores.reduce((sum, s) => sum + s, 0) / scores.length;
}

export function getAllCategoryScores(answers: ScoredAnswers): Record<CategoryKey, number> {
  const result = {} as Record<CategoryKey, number>;
  for (const category of CATEGORIES) {
    result[category.key] = getCategoryScore(answers, category.key);
  }
  return result;
}

/** Full-precision weighted overall readiness score, 0–100. */
export function getOverallReadiness(categoryScores: Record<CategoryKey, number>): number {
  return CATEGORIES.reduce((sum, category) => sum + categoryScores[category.key] * category.weight, 0);
}

/** Round only for display. */
export function roundScore(score: number): number {
  return Math.round(score);
}

export function classifyReadiness(score: number): ReadinessClassification {
  const rounded = roundScore(score);
  const band = CLASSIFICATION_BANDS.find((b) => rounded >= b.min && rounded <= b.max);
  if (!band) throw new Error(`Score ${score} did not match any classification band`);
  return band.key;
}

export function getClassificationBand(classification: ReadinessClassification) {
  const band = CLASSIFICATION_BANDS.find((b) => b.key === classification);
  if (!band) throw new Error(`Unknown classification: ${classification}`);
  return band;
}

// ---------------------------------------------------------------------------
// Data Confidence
// ---------------------------------------------------------------------------

export interface DataConfidenceResult {
  level: DataConfidenceLevel;
  reasons: string[];
  knownDataRatio: number;
}

function isSuppliedNumber(value: number | null | undefined): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function computeDataConfidence(
  answers: ScoredAnswers,
  financial: FinancialInputs
): DataConfidenceResult {
  const totalQuestions = SCORED_QUESTIONS.length;
  const answeredWithoutUncertainty = SCORED_QUESTIONS.filter((q) => {
    const answerId = answers[q.id];
    if (!answerId) return false;
    const option = q.options.find((o) => o.id === answerId);
    return !!option && !option.uncertaintyFlag;
  }).length;

  const coreKeys = CORE_FINANCIAL_INPUT_KEYS;
  const suppliedCore = coreKeys.filter((k) => isSuppliedNumber(financial[k])).length;
  const missingCore = coreKeys.length - suppliedCore;

  const knownDataRatio =
    (answeredWithoutUncertainty + suppliedCore) / (totalQuestions + coreKeys.length);

  const r3AnswerId = answers['r3'];
  const r3Low = r3AnswerId === 'r3_0' || r3AnswerId === 'r3_unknown';
  const r3Medium = r3AnswerId === 'r3_25';
  const r3AtLeast50 = r3AnswerId === 'r3_50' || r3AnswerId === 'r3_75' || r3AnswerId === 'r3_100';

  const notAttributable = financial.alignment === 'no';

  const lowReasons: string[] = [];
  if (knownDataRatio < 0.65) lowReasons.push('known_data_ratio_below_65_percent');
  if (missingCore >= 2) lowReasons.push('two_or_more_core_inputs_missing');
  if (r3Low) lowReasons.push('crm_reliability_untrustworthy_or_unknown');
  if (notAttributable) lowReasons.push('plan_sales_not_attributable_to_cohort');

  if (lowReasons.length > 0) {
    return { level: 'low', reasons: lowReasons, knownDataRatio };
  }

  const mediumReasons: string[] = [];
  if (knownDataRatio >= 0.65 && knownDataRatio < 0.85) mediumReasons.push('known_data_ratio_65_to_85_percent');
  if (missingCore === 1) mediumReasons.push('one_core_input_missing');
  if (r3Medium) mediumReasons.push('crm_reliability_has_gaps');

  if (mediumReasons.length > 0) {
    return { level: 'medium', reasons: mediumReasons, knownDataRatio };
  }

  const highOk =
    knownDataRatio >= 0.85 && missingCore === 0 && financial.alignment === 'yes' && r3AtLeast50;

  if (highOk) {
    return { level: 'high', reasons: [], knownDataRatio };
  }

  return { level: 'medium', reasons: ['does_not_meet_high_confidence_criteria'], knownDataRatio };
}

// ---------------------------------------------------------------------------
// Trigger severity
// ---------------------------------------------------------------------------

export function computeTriggerSeverity(selectedTriggerIds: string[] | undefined): number {
  const selected = (selectedTriggerIds ?? []).filter((id) => id !== 'trigger_none');
  if (selected.length === 0) return 0;
  const severities = selected.map((id) => CTX12_TRIGGERS.find((t) => t.id === id)?.severity ?? 0);
  const highest = Math.max(...severities);
  return Math.min(100, highest + 10 * (selected.length - 1));
}

export function getUrgencyScore(ctx10AnswerId: string | undefined): number {
  if (!ctx10AnswerId) return 0;
  return CTX10_TIMING.options.find((o) => o.id === ctx10AnswerId)?.urgency ?? 0;
}

// ---------------------------------------------------------------------------
// Constraint diagnosis
// ---------------------------------------------------------------------------

export interface ConstraintRisk {
  categoryKey: CategoryKey;
  constraintKey: ConstraintKey;
  categoryScore: number;
  baseRisk: number;
  adjustedRisk: number;
  boosted: boolean;
}

export interface ConstraintDiagnosis {
  primary: ConstraintRisk;
  secondary: ConstraintRisk;
  interconnected: boolean;
  allRisks: ConstraintRisk[];
}

function getBoostedConstraints(
  selectedTriggerIds: string[] | undefined,
  categoryScores: Record<CategoryKey, number>
): Set<ConstraintKey> {
  const boosted = new Set<ConstraintKey>();
  for (const id of selectedTriggerIds ?? []) {
    if (id === 'trigger_none') continue;
    const trigger = CTX12_TRIGGERS.find((t) => t.id === id);
    if (!trigger) continue;

    if (trigger.id === 'trigger_poor_quality_leads') {
      const readinessScore = categoryScores.readiness;
      const performanceScore = categoryScores.performance;
      const diff = Math.abs(readinessScore - performanceScore);
      if (diff <= 5) {
        boosted.add('buyer_trust_readiness_gap');
        boosted.add('lead_handling_leakage');
      } else if (readinessScore < performanceScore) {
        boosted.add('buyer_trust_readiness_gap');
      } else {
        boosted.add('lead_handling_leakage');
      }
      continue;
    }

    trigger.constraintKeys.forEach((k) => boosted.add(k));
  }
  return boosted;
}

export function computeConstraintDiagnosis(
  categoryScores: Record<CategoryKey, number>,
  selectedTriggerIds: string[] | undefined
): ConstraintDiagnosis {
  const boosted = getBoostedConstraints(selectedTriggerIds, categoryScores);

  const risks: ConstraintRisk[] = CATEGORIES.map((category) => {
    const constraintKey = CATEGORY_TO_CONSTRAINT[category.key];
    const categoryScore = categoryScores[category.key];
    const baseRisk = (100 - categoryScore) * category.weight;
    const isBoosted = boosted.has(constraintKey);
    const adjustedRisk = isBoosted ? baseRisk * 1.1 : baseRisk;
    return { categoryKey: category.key, constraintKey, categoryScore, baseRisk, adjustedRisk, boosted: isBoosted };
  });

  // Sort by adjusted risk descending; ties broken by stable category order (as declared in CATEGORIES).
  const sorted = [...risks].sort((a, b) => {
    if (b.adjustedRisk !== a.adjustedRisk) return b.adjustedRisk - a.adjustedRisk;
    return CATEGORIES.findIndex((c) => c.key === a.categoryKey) - CATEGORIES.findIndex((c) => c.key === b.categoryKey);
  });

  const primary = sorted[0];
  const secondary = sorted[1];
  const maxRisk = Math.max(primary.adjustedRisk, secondary.adjustedRisk);
  const interconnected =
    maxRisk === 0 ? true : Math.abs(primary.adjustedRisk - secondary.adjustedRisk) / maxRisk <= 0.05;

  return { primary, secondary, interconnected, allRisks: sorted };
}

// ---------------------------------------------------------------------------
// Hidden Need Score
// ---------------------------------------------------------------------------

export function computeNeedScore(
  overallReadiness: number,
  triggerSeverity: number,
  urgencyScore: number
): number {
  const raw = 0.7 * (100 - overallReadiness) + 0.2 * triggerSeverity + 0.1 * urgencyScore;
  return Math.min(100, Math.max(0, raw));
}

export function getNeedBand(needScore: number): NeedBand {
  if (needScore >= 80) return 'critical';
  if (needScore >= 65) return 'high';
  if (needScore >= 40) return 'meaningful';
  return 'low';
}

export const isHighNeed = (needScore: number) => needScore >= 65;

// ---------------------------------------------------------------------------
// Hidden Commercial Fit Score
// ---------------------------------------------------------------------------

const FIT_QUESTIONS: { key: keyof ContextAnswers; question: { options: { id: string; fitPoints?: number }[] } }[] = [
  { key: 'ctx3', question: CTX3_DECISION_AUTHORITY },
  { key: 'ctx5', question: CTX5_SPEND },
  { key: 'ctx6', question: CTX6_ENQUIRY_VOLUME },
  { key: 'ctx7', question: CTX7_ECONOMICS_MATURITY },
  { key: 'ctx8', question: CTX8_CAPACITY },
  { key: 'ctx9', question: CTX9_CRM },
  { key: 'ctx10', question: CTX10_TIMING },
  { key: 'ctx11', question: CTX11_DATA_SHARING },
];

export function computeFitScore(context: ContextAnswers): number {
  let total = 0;
  for (const { key, question } of FIT_QUESTIONS) {
    const answerId = context[key] as string | undefined;
    if (!answerId) continue;
    const option = question.options.find((o) => o.id === answerId);
    total += option?.fitPoints ?? 0;
  }
  return Math.min(100, Math.max(0, total));
}

export function getFitBand(fitScore: number): FitBand {
  if (fitScore >= 80) return 'priority';
  if (fitScore >= 65) return 'strong';
  if (fitScore >= 40) return 'developing';
  return 'low';
}

// ---------------------------------------------------------------------------
// CTA routing
// ---------------------------------------------------------------------------

export function routeCta(needScore: number, fitScore: number): CtaVariant {
  const highNeed = isHighNeed(needScore);
  const fitBand = getFitBand(fitScore);
  const strongOrPriority = fitBand === 'strong' || fitBand === 'priority';

  if (highNeed) {
    if (strongOrPriority) return 'primary_deeper_analysis';
    if (fitBand === 'developing') return 'result_review_checklist';
    return 'tailored_action_plan';
  }

  if (strongOrPriority) return 'benchmarking_reassessment';
  return 'resources_only';
}

// ---------------------------------------------------------------------------
// Financial calculation engine
// ---------------------------------------------------------------------------

function isPositive(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

export interface FinancialScenario {
  multiplier: number;
  scenarioCplGbp: number;
  additionalEnquiries: number;
  additionalPlans: number;
  additionalGrossContributionGbp: number;
  illustrativeContributionAfterAcquisitionGbp: number;
}

export interface CurrentPerformance {
  currentCplGbp: number;
  currentLeadToPlanRate: number;
  currentCacGbp: number;
  currentContributionAfterAcquisitionGbp: number;
}

export interface ConversionLeverage {
  plansAtPlus1Point: number;
  plansAtPlus2Points: number;
  additionalPlansAtPlus1: number;
  additionalPlansAtPlus2: number;
  additionalGrossContributionAtPlus1Gbp?: number;
  additionalGrossContributionAtPlus2Gbp?: number;
}

export interface AgedEnquiryScenario {
  recoveryRate: number;
  recoveredPlans: number;
  illustrativeGrossContributionGbp: number;
}

export interface AgedEnquiryIllustration {
  suppressed: boolean;
  missing: string[];
  scenarios?: AgedEnquiryScenario[];
}

export interface AcquisitionScenarioBlock {
  suppressed: boolean;
  missing: string[];
  current?: CurrentPerformance;
  scenarios?: FinancialScenario[];
  capacityWarning?: boolean;
  conversionLeverage?: ConversionLeverage;
}

export interface FinancialOutputs {
  acquisitionScenario: AcquisitionScenarioBlock;
  agedEnquiryIllustration: AgedEnquiryIllustration;
}

export function computeAcquisitionScenarioBlock(financial: FinancialInputs): AcquisitionScenarioBlock {
  const { monthlySpendGbp, paidEnquiries, completedPlans, contributionPerPlanGbp, spareMonthlyCapacity, alignment } =
    financial;

  const missing: string[] = [];
  const aligned: Alignment = alignment ?? 'not_sure';

  if (aligned !== 'yes') missing.push('alignment_confirmation');
  if (!isPositive(monthlySpendGbp)) missing.push('monthly_acquisition_spend');
  if (!isPositive(paidEnquiries)) missing.push('paid_enquiries');
  if (!isPositive(completedPlans)) missing.push('completed_plan_sales');
  if (!isPositive(contributionPerPlanGbp)) missing.push('contribution_per_plan');
  if (isPositive(paidEnquiries) && paidEnquiries < MIN_STABLE_SAMPLE_PAID_ENQUIRIES) {
    missing.push('minimum_sample_size_25_paid_enquiries');
  }

  if (missing.length > 0) {
    return { suppressed: true, missing };
  }

  const spend = monthlySpendGbp as number;
  const enquiries = paidEnquiries as number;
  const plans = completedPlans as number;
  const contribution = contributionPerPlanGbp as number;

  const currentCplGbp = spend / enquiries;
  const currentLeadToPlanRate = plans / enquiries;
  const currentCacGbp = spend / plans;
  const currentContributionAfterAcquisitionGbp = plans * contribution - spend;

  const scenarios: FinancialScenario[] = [1, 1.25, 1.5].map((multiplier) => {
    const scenarioCplGbp = currentCplGbp * multiplier;
    const additionalEnquiries = 10_000 / scenarioCplGbp;
    const additionalPlans = additionalEnquiries * currentLeadToPlanRate;
    const additionalGrossContributionGbp = additionalPlans * contribution;
    const illustrativeContributionAfterAcquisitionGbp = additionalGrossContributionGbp - 10_000;
    return {
      multiplier,
      scenarioCplGbp,
      additionalEnquiries,
      additionalPlans,
      additionalGrossContributionGbp,
      illustrativeContributionAfterAcquisitionGbp,
    };
  });

  const capacityWarning = isPositive(spareMonthlyCapacity)
    ? scenarios.some((s) => s.additionalEnquiries > (spareMonthlyCapacity as number))
    : false;

  const additionalPlansAtPlus1 = enquiries * 0.01;
  const additionalPlansAtPlus2 = enquiries * 0.02;
  const conversionLeverage: ConversionLeverage = {
    plansAtPlus1Point: enquiries * (currentLeadToPlanRate + 0.01),
    plansAtPlus2Points: enquiries * (currentLeadToPlanRate + 0.02),
    additionalPlansAtPlus1,
    additionalPlansAtPlus2,
    additionalGrossContributionAtPlus1Gbp: additionalPlansAtPlus1 * contribution,
    additionalGrossContributionAtPlus2Gbp: additionalPlansAtPlus2 * contribution,
  };

  return {
    suppressed: false,
    missing: [],
    current: {
      currentCplGbp,
      currentLeadToPlanRate,
      currentCacGbp,
      currentContributionAfterAcquisitionGbp,
    },
    scenarios,
    capacityWarning,
    conversionLeverage,
  };
}

export function computeAgedEnquiryIllustration(financial: FinancialInputs): AgedEnquiryIllustration {
  const { eligibleAgedEnquiries, contributionPerPlanGbp } = financial;
  const missing: string[] = [];
  if (!isPositive(eligibleAgedEnquiries)) missing.push('eligible_aged_enquiries');
  if (!isPositive(contributionPerPlanGbp)) missing.push('contribution_per_plan');

  if (missing.length > 0) {
    return { suppressed: true, missing };
  }

  const enquiries = eligibleAgedEnquiries as number;
  const contribution = contributionPerPlanGbp as number;

  const scenarios: AgedEnquiryScenario[] = [0.005, 0.01, 0.02].map((recoveryRate) => {
    const recoveredPlans = enquiries * recoveryRate;
    const illustrativeGrossContributionGbp = recoveredPlans * contribution;
    return { recoveryRate, recoveredPlans, illustrativeGrossContributionGbp };
  });

  return { suppressed: false, missing: [], scenarios };
}

export function computeFinancialOutputs(financial: FinancialInputs): FinancialOutputs {
  return {
    acquisitionScenario: computeAcquisitionScenarioBlock(financial),
    agedEnquiryIllustration: computeAgedEnquiryIllustration(financial),
  };
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

export interface FullScoringInput {
  scoredAnswers: ScoredAnswers;
  context: ContextAnswers;
  financial: FinancialInputs;
}

export interface FullScoringResult {
  categoryScores: Record<CategoryKey, number>;
  overallReadiness: number;
  overallReadinessRounded: number;
  classification: ReadinessClassification;
  dataConfidence: DataConfidenceResult;
  constraintDiagnosis: ConstraintDiagnosis;
  triggerSeverity: number;
  urgencyScore: number;
  needScore: number;
  needBand: NeedBand;
  fitScore: number;
  fitBand: FitBand;
  ctaVariant: CtaVariant;
  financialOutputs: FinancialOutputs;
}

export function runFullScoring(input: FullScoringInput): FullScoringResult {
  const categoryScores = getAllCategoryScores(input.scoredAnswers);
  const overallReadiness = getOverallReadiness(categoryScores);
  const overallReadinessRounded = roundScore(overallReadiness);
  const classification = classifyReadiness(overallReadiness);
  const dataConfidence = computeDataConfidence(input.scoredAnswers, input.financial);
  const triggerSeverity = computeTriggerSeverity(input.context.ctx12);
  const urgencyScore = getUrgencyScore(input.context.ctx10);
  const constraintDiagnosis = computeConstraintDiagnosis(categoryScores, input.context.ctx12);
  const needScore = computeNeedScore(overallReadiness, triggerSeverity, urgencyScore);
  const needBand = getNeedBand(needScore);
  const fitScore = computeFitScore(input.context);
  const fitBand = getFitBand(fitScore);
  const ctaVariant = routeCta(needScore, fitScore);
  const financialOutputs = computeFinancialOutputs(input.financial);

  return {
    categoryScores,
    overallReadiness,
    overallReadinessRounded,
    classification,
    dataConfidence,
    constraintDiagnosis,
    triggerSeverity,
    urgencyScore,
    needScore,
    needBand,
    fitScore,
    fitBand,
    ctaVariant,
    financialOutputs,
  };
}
