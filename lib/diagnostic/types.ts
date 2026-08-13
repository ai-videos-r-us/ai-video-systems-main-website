// Funeral Plan Scale Readiness Diagnostic — shared domain types.
// Imported by both the frontend (src/) and the Vercel serverless functions (api/).

export type CategoryKey =
  | 'acquisition'
  | 'resilience'
  | 'readiness'
  | 'performance'
  | 'existing'
  | 'visibility'
  | 'capacity';

export type ConstraintKey =
  | 'acquisition_ceiling'
  | 'creative_channel_fragility'
  | 'buyer_trust_readiness_gap'
  | 'lead_handling_leakage'
  | 'dormant_enquiry_opportunity'
  | 'revenue_blind_spot'
  | 'capacity_founder_bottleneck';

export type AnswerScore = 0 | 25 | 50 | 75 | 100;

export interface AnswerOption {
  id: string;
  label: string;
  score: AnswerScore;
  /** This answer represents missing/unmeasured data and should count against Data Confidence. */
  uncertaintyFlag?: boolean;
}

export interface ScoredQuestion {
  /** Stable short id, e.g. "a1". */
  id: string;
  /** Display code shown in copy/tests, e.g. "A1". */
  code: string;
  categoryKey: CategoryKey;
  prompt: string;
  helpText?: string;
  options: AnswerOption[];
}

export interface CategoryDefinition {
  key: CategoryKey;
  name: string;
  weight: number; // decimal, e.g. 0.15
  order: number;
}

export interface ContextOption {
  id: string;
  label: string;
  fitPoints?: number;
  urgency?: number;
  uncertaintyFlag?: boolean;
}

export interface TriggerOption extends ContextOption {
  severity: number;
  constraintKeys: ConstraintKey[];
  exclusive?: boolean;
}

export interface ContextQuestion {
  id: string;
  prompt: string;
  helpText?: string;
  multiSelect?: boolean;
  options: ContextOption[];
}

export type Alignment = 'yes' | 'partly' | 'no' | 'not_sure';

export interface FinancialInputs {
  monthlySpendGbp?: number | null;
  paidEnquiries?: number | null;
  completedPlans?: number | null;
  contributionPerPlanGbp?: number | null;
  eligibleAgedEnquiries?: number | null;
  spareMonthlyCapacity?: number | null;
  alignment?: Alignment | null;
}

export interface ContextAnswers {
  ctx1?: string;
  ctx2?: string;
  ctx3?: string;
  ctx4?: string;
  ctx5?: string;
  ctx6?: string;
  ctx7?: string;
  ctx8?: string;
  ctx9?: string;
  ctx10?: string;
  ctx11?: string;
  ctx12?: string[];
}

/** Map of scored-question id -> selected answer option id. */
export type ScoredAnswers = Record<string, string>;

export type DataConfidenceLevel = 'low' | 'medium' | 'high';

export type ReadinessClassification =
  | 'not_scale_ready'
  | 'growth_constrained'
  | 'conditionally_ready'
  | 'scale_ready_with_guardrails'
  | 'highly_scale_ready';

export type NeedBand = 'low' | 'meaningful' | 'high' | 'critical';
export type FitBand = 'low' | 'developing' | 'strong' | 'priority';

export type CtaVariant =
  | 'primary_deeper_analysis'
  | 'result_review_checklist'
  | 'tailored_action_plan'
  | 'benchmarking_reassessment'
  | 'resources_only';
