-- Funeral Plan Scale Readiness Diagnostic — persistence.
-- Run via `supabase db push`, the Supabase SQL editor, or your own migration runner.

create extension if not exists pgcrypto;

create table if not exists diagnostic_assessments (
  id uuid primary key default gen_random_uuid(),

  -- Idempotency + secure result access. Raw tokens are never stored — only their hash.
  idempotency_key text not null,
  token_hash text not null,

  status text not null default 'completed' check (status in ('started', 'completed', 'failed')),
  assessment_version text not null,
  scoring_version text not null,
  content_version text not null,

  created_at timestamptz not null default now(),
  completed_at timestamptz,

  -- Attribution
  partner_slug text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,

  -- Respondent (never rendered in URLs, logs, or the public result payload)
  first_name text not null,
  surname text not null,
  company text not null,
  work_email text not null,
  phone text,
  respondent_role text,
  business_type text,
  market text,

  -- Immutable raw submission. Never overwritten by a future rescore — see docs on versioning.
  raw_context jsonb not null default '{}'::jsonb,
  raw_scored_answers jsonb not null default '{}'::jsonb,
  raw_financial_inputs jsonb not null default '{}'::jsonb,

  -- Consent (separate, timestamped)
  marketing_consent boolean not null default false,
  marketing_consent_at timestamptz,
  research_consent boolean not null default false,
  research_consent_at timestamptz,

  -- Scoring output (server-calculated, full precision retained)
  category_scores jsonb not null,
  overall_readiness numeric not null,
  overall_readiness_rounded int not null,
  classification text not null,
  data_confidence_level text not null,
  data_confidence_reasons jsonb not null default '[]'::jsonb,
  primary_constraint_key text not null,
  secondary_constraint_key text not null,
  interconnected_constraints boolean not null default false,

  -- Hidden — never returned by the public result API/serializer.
  need_score numeric not null,
  need_band text not null,
  fit_score numeric not null,
  fit_band text not null,
  trigger_severity numeric not null default 0,
  urgency_score numeric not null default 0,

  financial_outputs jsonb not null default '{}'::jsonb,
  cta_variant text not null,

  -- Precomputed public-safe result payload (see lib/diagnostic/serialize.ts), served verbatim
  -- on secure-token revisits so the public API never needs to touch hidden Need/Fit fields.
  public_result_snapshot jsonb not null default '{}'::jsonb,

  -- Deeper-analysis request (inline fallback CTA — see api/diagnostic/analysis-request.ts)
  analysis_requested_at timestamptz,
  analysis_request_phone text,
  analysis_request_contact_method text,
  analysis_request_note text,

  -- Delivery status (failures never block the on-screen result)
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_error text,
  webhook_status text not null default 'pending' check (webhook_status in ('pending', 'sent', 'failed', 'not_configured')),
  webhook_error text,

  updated_at timestamptz not null default now()
);

create unique index if not exists diagnostic_assessments_idempotency_key_idx
  on diagnostic_assessments (idempotency_key);

create unique index if not exists diagnostic_assessments_token_hash_idx
  on diagnostic_assessments (token_hash);

create index if not exists diagnostic_assessments_created_at_idx
  on diagnostic_assessments (created_at desc);

create index if not exists diagnostic_assessments_partner_slug_idx
  on diagnostic_assessments (partner_slug);

create index if not exists diagnostic_assessments_work_email_idx
  on diagnostic_assessments (work_email);

create or replace function diagnostic_assessments_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists diagnostic_assessments_updated_at on diagnostic_assessments;
create trigger diagnostic_assessments_updated_at
  before update on diagnostic_assessments
  for each row execute function diagnostic_assessments_set_updated_at();

-- Row Level Security: this table is only ever read/written via the service-role key from
-- server-side Vercel functions (lib/server/repository.ts). No anon/public policies are
-- defined, so RLS blocks all access from the browser's anon key by default.
alter table diagnostic_assessments enable row level security;
