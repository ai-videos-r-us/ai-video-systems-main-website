import { z } from 'zod';
import { NUMERIC_LIMITS } from '../diagnostic/constants.js';
import { CONTEXT_QUESTIONS } from '../diagnostic/context-questions.js';
import { SCORED_QUESTIONS } from '../diagnostic/questions.js';

const REQUIRED_QUESTION_IDS = SCORED_QUESTIONS.map((q) => q.id);
const VALID_ANSWER_IDS_BY_QUESTION: Record<string, Set<string>> = Object.fromEntries(
  SCORED_QUESTIONS.map((q) => [q.id, new Set(q.options.map((o) => o.id))])
);
const VALID_CONTEXT_OPTION_IDS: Record<string, Set<string>> = Object.fromEntries(
  CONTEXT_QUESTIONS.map((q) => [q.id, new Set(q.options.map((o) => o.id))])
);

const numeric = (limits: { min: number; max: number }) =>
  z.number().finite().min(limits.min).max(limits.max).nullable().optional();

const financialSchema = z.object({
  monthlySpendGbp: numeric(NUMERIC_LIMITS.monthlySpendGbp),
  paidEnquiries: numeric(NUMERIC_LIMITS.paidEnquiries),
  completedPlans: numeric(NUMERIC_LIMITS.completedPlans),
  contributionPerPlanGbp: numeric(NUMERIC_LIMITS.contributionPerPlanGbp),
  eligibleAgedEnquiries: numeric(NUMERIC_LIMITS.eligibleAgedEnquiries),
  spareMonthlyCapacity: numeric(NUMERIC_LIMITS.spareMonthlyCapacity),
  alignment: z.enum(['yes', 'partly', 'no', 'not_sure']).nullable().optional(),
});

const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(120),
  surname: z.string().trim().min(1).max(120),
  company: z.string().trim().min(1).max(200),
  workEmail: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional(),
});

const consentsSchema = z.object({
  marketing: z.boolean(),
  research: z.boolean(),
});

const attributionSchema = z.object({
  partnerSlug: z.string().trim().max(80).optional(),
  utmSource: z.string().trim().max(200).optional(),
  utmMedium: z.string().trim().max(200).optional(),
  utmCampaign: z.string().trim().max(200).optional(),
  utmTerm: z.string().trim().max(200).optional(),
  utmContent: z.string().trim().max(200).optional(),
  referrer: z.string().trim().max(2000).optional(),
});

const contextSchema = z
  .object({
    ctx1: z.string().max(80).optional(),
    ctx2: z.string().max(80).optional(),
    ctx3: z.string().max(80).optional(),
    ctx4: z.string().max(80).optional(),
    ctx5: z.string().max(80).optional(),
    ctx6: z.string().max(80).optional(),
    ctx7: z.string().max(80).optional(),
    ctx8: z.string().max(80).optional(),
    ctx9: z.string().max(80).optional(),
    ctx10: z.string().max(80).optional(),
    ctx11: z.string().max(80).optional(),
    ctx12: z.array(z.string().max(80)).max(20).optional(),
  })
  .partial();

export const submissionSchema = z.object({
  idempotencyKey: z.string().trim().min(8).max(100),
  scoredAnswers: z.record(z.string(), z.string()),
  context: contextSchema,
  financial: financialSchema,
  contact: contactSchema,
  consents: consentsSchema,
  attribution: attributionSchema.optional().default({}),
});

export type SubmissionPayload = z.infer<typeof submissionSchema>;

export const analysisRequestSchema = z.object({
  resultToken: z.string().trim().min(20).max(200),
  phone: z.string().trim().max(40).optional(),
  preferredContactMethod: z.enum(['phone', 'email', 'either']).optional(),
  note: z.string().trim().max(1000).optional(),
});

export type AnalysisRequestPayload = z.infer<typeof analysisRequestSchema>;

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult {
  success: boolean;
  data?: SubmissionPayload;
  issues?: ValidationIssue[];
}

/** Validates structure/ranges via zod, then checks every answer id is one of the known stable ids. */
export function validateSubmission(payload: unknown): ValidationResult {
  const parsed = submissionSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      success: false,
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };
  }

  const data = parsed.data;
  const issues: ValidationIssue[] = [];

  for (const questionId of REQUIRED_QUESTION_IDS) {
    const answerId = data.scoredAnswers[questionId];
    if (!answerId) {
      issues.push({ path: `scoredAnswers.${questionId}`, message: 'Missing required answer' });
      continue;
    }
    if (!VALID_ANSWER_IDS_BY_QUESTION[questionId].has(answerId)) {
      issues.push({ path: `scoredAnswers.${questionId}`, message: 'Unknown answer id' });
    }
  }

  // Reject any scored-answer keys that are not part of the approved question bank.
  for (const key of Object.keys(data.scoredAnswers)) {
    if (!VALID_ANSWER_IDS_BY_QUESTION[key]) {
      issues.push({ path: `scoredAnswers.${key}`, message: 'Unknown question id' });
    }
  }

  for (const [key, value] of Object.entries(data.context)) {
    if (value === undefined) continue;
    const validIds = VALID_CONTEXT_OPTION_IDS[key];
    if (!validIds) {
      issues.push({ path: `context.${key}`, message: 'Unknown context question id' });
      continue;
    }
    const values = Array.isArray(value) ? value : [value];
    for (const v of values) {
      if (!validIds.has(v)) {
        issues.push({ path: `context.${key}`, message: `Unknown option id "${v}"` });
      }
    }
  }

  if (
    data.financial.alignment === 'yes' &&
    typeof data.financial.completedPlans === 'number' &&
    typeof data.financial.paidEnquiries === 'number' &&
    data.financial.completedPlans > data.financial.paidEnquiries
  ) {
    issues.push({
      path: 'financial.completedPlans',
      message: 'Completed plans cannot exceed paid enquiries when the cohort is confirmed aligned',
    });
  }

  if (issues.length > 0) {
    return { success: false, issues };
  }

  return { success: true, data };
}
