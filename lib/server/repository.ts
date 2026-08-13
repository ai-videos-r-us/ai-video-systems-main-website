import { getSupabaseClient } from './supabase.js';
import type { FullScoringResult } from '../diagnostic/scoring.js';
import type { PublicResult } from '../diagnostic/serialize.js';
import type { ContextAnswers, FinancialInputs, ScoredAnswers } from '../diagnostic/types.js';
import { ASSESSMENT_VERSION, CONTENT_VERSION, SCORING_VERSION } from '../diagnostic/constants.js';

const TABLE = 'diagnostic_assessments';

export interface AttributionInput {
  partnerSlug?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
}

export interface ContactInput {
  firstName: string;
  surname: string;
  company: string;
  workEmail: string;
  phone?: string;
}

export interface ConsentsInput {
  marketing: boolean;
  research: boolean;
}

export interface CreateAssessmentInput {
  idempotencyKey: string;
  tokenHash: string;
  context: ContextAnswers;
  scoredAnswers: ScoredAnswers;
  financial: FinancialInputs;
  contact: ContactInput;
  consents: ConsentsInput;
  attribution: AttributionInput;
  scoring: FullScoringResult;
  publicResult: PublicResult;
}

export interface AssessmentRow {
  id: string;
  idempotencyKey: string;
  tokenHash: string;
  createdAt: string;
  firstName: string;
  workEmail: string;
  publicResult: PublicResult;
  ctaVariant: string;
  needScore: number;
  needBand: string;
  fitScore: number;
  fitBand: string;
  marketingConsent: boolean;
}

function toRow(input: CreateAssessmentInput) {
  const { scoring } = input;
  return {
    idempotency_key: input.idempotencyKey,
    token_hash: input.tokenHash,
    status: 'completed',
    assessment_version: ASSESSMENT_VERSION,
    scoring_version: SCORING_VERSION,
    content_version: CONTENT_VERSION,
    completed_at: new Date().toISOString(),

    partner_slug: input.attribution.partnerSlug ?? null,
    utm_source: input.attribution.utmSource ?? null,
    utm_medium: input.attribution.utmMedium ?? null,
    utm_campaign: input.attribution.utmCampaign ?? null,
    utm_term: input.attribution.utmTerm ?? null,
    utm_content: input.attribution.utmContent ?? null,
    referrer: input.attribution.referrer ?? null,

    first_name: input.contact.firstName,
    surname: input.contact.surname,
    company: input.contact.company,
    work_email: input.contact.workEmail,
    phone: input.contact.phone ?? null,

    raw_context: input.context,
    raw_scored_answers: input.scoredAnswers,
    raw_financial_inputs: input.financial,

    marketing_consent: input.consents.marketing,
    marketing_consent_at: input.consents.marketing ? new Date().toISOString() : null,
    research_consent: input.consents.research,
    research_consent_at: input.consents.research ? new Date().toISOString() : null,

    category_scores: scoring.categoryScores,
    overall_readiness: scoring.overallReadiness,
    overall_readiness_rounded: scoring.overallReadinessRounded,
    classification: scoring.classification,
    data_confidence_level: scoring.dataConfidence.level,
    data_confidence_reasons: scoring.dataConfidence.reasons,
    primary_constraint_key: scoring.constraintDiagnosis.primary.constraintKey,
    secondary_constraint_key: scoring.constraintDiagnosis.secondary.constraintKey,
    interconnected_constraints: scoring.constraintDiagnosis.interconnected,
    need_score: scoring.needScore,
    need_band: scoring.needBand,
    fit_score: scoring.fitScore,
    fit_band: scoring.fitBand,
    trigger_severity: scoring.triggerSeverity,
    urgency_score: scoring.urgencyScore,
    financial_outputs: scoring.financialOutputs,
    cta_variant: scoring.ctaVariant,
    public_result_snapshot: input.publicResult,

    email_status: 'pending',
    webhook_status: 'pending',
  };
}

function fromRow(row: Record<string, unknown>): AssessmentRow {
  return {
    id: row.id as string,
    idempotencyKey: row.idempotency_key as string,
    tokenHash: row.token_hash as string,
    createdAt: row.created_at as string,
    firstName: row.first_name as string,
    workEmail: row.work_email as string,
    publicResult: row.public_result_snapshot as PublicResult,
    ctaVariant: row.cta_variant as string,
    needScore: row.need_score as number,
    needBand: row.need_band as string,
    fitScore: row.fit_score as number,
    fitBand: row.fit_band as string,
    marketingConsent: row.marketing_consent as boolean,
  };
}

/** Insert a new assessment. Returns the existing row instead if the idempotency key was already used. */
export async function createAssessment(
  input: CreateAssessmentInput
): Promise<{ row: AssessmentRow; alreadyExisted: boolean }> {
  const supabase = getSupabaseClient();

  const existing = await findByIdempotencyKey(input.idempotencyKey);
  if (existing) {
    return { row: existing, alreadyExisted: true };
  }

  const { data, error } = await supabase.from(TABLE).insert(toRow(input)).select().single();
  if (error) {
    // Unique-violation race on idempotency_key: another request beat us to it.
    if (error.code === '23505') {
      const raced = await findByIdempotencyKey(input.idempotencyKey);
      if (raced) return { row: raced, alreadyExisted: true };
    }
    throw new Error(`Failed to persist assessment: ${error.message}`);
  }

  return { row: fromRow(data), alreadyExisted: false };
}

export async function findByIdempotencyKey(idempotencyKey: string): Promise<AssessmentRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('idempotency_key', idempotencyKey)
    .maybeSingle();
  if (error) throw new Error(`Failed to look up assessment: ${error.message}`);
  return data ? fromRow(data) : null;
}

export async function findByTokenHash(tokenHash: string): Promise<AssessmentRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from(TABLE).select('*').eq('token_hash', tokenHash).maybeSingle();
  if (error) throw new Error(`Failed to look up result: ${error.message}`);
  return data ? fromRow(data) : null;
}

export async function updateEmailStatus(
  id: string,
  status: 'sent' | 'failed',
  errorCategory?: string
): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase
    .from(TABLE)
    .update({ email_status: status, email_error: errorCategory ?? null })
    .eq('id', id);
}

export interface AnalysisRequestInput {
  phone?: string;
  preferredContactMethod?: string;
  note?: string;
}

/** Records an inline "Request a Deeper Analysis" submission against its assessment. */
export async function recordAnalysisRequest(
  tokenHash: string,
  input: AnalysisRequestInput
): Promise<AssessmentRow | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      analysis_requested_at: new Date().toISOString(),
      analysis_request_phone: input.phone ?? null,
      analysis_request_contact_method: input.preferredContactMethod ?? null,
      analysis_request_note: input.note ?? null,
    })
    .eq('token_hash', tokenHash)
    .select()
    .maybeSingle();
  if (error) throw new Error(`Failed to record analysis request: ${error.message}`);
  return data ? fromRow(data) : null;
}

export async function updateWebhookStatus(
  id: string,
  status: 'sent' | 'failed' | 'not_configured',
  errorCategory?: string
): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase
    .from(TABLE)
    .update({ webhook_status: status, webhook_error: errorCategory ?? null })
    .eq('id', id);
}
