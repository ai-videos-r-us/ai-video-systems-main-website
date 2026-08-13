import type { CategoryDefinition, CategoryKey, ConstraintKey, ReadinessClassification } from './types.js';

export const ASSESSMENT_VERSION = '1.0.0';
export const SCORING_VERSION = '1.0.0';
export const CONTENT_VERSION = '1.0.0';

export const DRAFT_STORAGE_KEY = 'fpsrd:v1:draft';

export const CATEGORIES: CategoryDefinition[] = [
  { key: 'acquisition', name: 'Acquisition Economics and Scalability', weight: 0.15, order: 1 },
  { key: 'resilience', name: 'Creative and Channel Resilience', weight: 0.1, order: 2 },
  { key: 'readiness', name: 'Lead Quality and Buyer Readiness', weight: 0.15, order: 3 },
  { key: 'performance', name: 'Contact and Lead-to-Plan Performance', weight: 0.2, order: 4 },
  { key: 'existing', name: 'Existing Enquiry Monetisation', weight: 0.15, order: 5 },
  { key: 'visibility', name: 'Revenue Visibility', weight: 0.15, order: 6 },
  { key: 'capacity', name: 'Growth Capacity and Founder Independence', weight: 0.1, order: 7 },
];

export const CATEGORY_MAP: Record<CategoryKey, CategoryDefinition> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<CategoryKey, CategoryDefinition>;

export const TOTAL_CATEGORY_WEIGHT = CATEGORIES.reduce((sum, c) => sum + c.weight, 0);

export const CATEGORY_TO_CONSTRAINT: Record<CategoryKey, ConstraintKey> = {
  acquisition: 'acquisition_ceiling',
  resilience: 'creative_channel_fragility',
  readiness: 'buyer_trust_readiness_gap',
  performance: 'lead_handling_leakage',
  existing: 'dormant_enquiry_opportunity',
  visibility: 'revenue_blind_spot',
  capacity: 'capacity_founder_bottleneck',
};

export const CONSTRAINT_TO_CATEGORY: Record<ConstraintKey, CategoryKey> = Object.fromEntries(
  Object.entries(CATEGORY_TO_CONSTRAINT).map(([cat, constraint]) => [constraint, cat])
) as Record<ConstraintKey, CategoryKey>;

interface ClassificationBand {
  key: ReadinessClassification;
  min: number;
  max: number;
  label: string;
  meaning: string;
}

export const CLASSIFICATION_BANDS: ClassificationBand[] = [
  {
    key: 'not_scale_ready',
    min: 0,
    max: 39,
    label: 'Not Scale-Ready',
    meaning: 'Additional spend is likely to magnify serious weaknesses or invisible leakage.',
  },
  {
    key: 'growth_constrained',
    min: 40,
    max: 59,
    label: 'Growth-Constrained',
    meaning:
      'The business has a functioning acquisition operation, but one or more major constraints should be fixed before material expansion.',
  },
  {
    key: 'conditionally_ready',
    min: 60,
    max: 74,
    label: 'Conditionally Ready',
    meaning: 'Growth is possible, but it should be staged around clearly identified guardrails and improvements.',
  },
  {
    key: 'scale_ready_with_guardrails',
    min: 75,
    max: 89,
    label: 'Scale-Ready with Guardrails',
    meaning: 'Most foundations are in place; scaling should proceed through controlled tests and ongoing measurement.',
  },
  {
    key: 'highly_scale_ready',
    min: 90,
    max: 100,
    label: 'Highly Scale-Ready',
    meaning: 'The acquisition-to-revenue system is mature, measurable and operationally prepared for controlled expansion.',
  },
];

export const CORE_FINANCIAL_INPUT_KEYS = [
  'monthlySpendGbp',
  'paidEnquiries',
  'completedPlans',
  'contributionPerPlanGbp',
] as const;

export const NUMERIC_LIMITS = {
  monthlySpendGbp: { min: 0, max: 10_000_000 },
  paidEnquiries: { min: 0, max: 10_000_000 },
  completedPlans: { min: 0, max: 1_000_000 },
  contributionPerPlanGbp: { min: 0, max: 1_000_000 },
  eligibleAgedEnquiries: { min: 0, max: 100_000_000 },
  spareMonthlyCapacity: { min: 0, max: 10_000_000 },
};

export const MIN_STABLE_SAMPLE_PAID_ENQUIRIES = 25;
