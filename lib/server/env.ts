// Central place that reads server-only env vars. Never imported from src/ (frontend) code.

function readEnv(name: string): string | undefined {
  const value = typeof process !== 'undefined' ? process.env[name] : undefined;
  return value && value.length > 0 ? value : undefined;
}

export const env = {
  SUPABASE_URL: readEnv('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: readEnv('SUPABASE_SERVICE_ROLE_KEY'),
  RESEND_API_KEY: readEnv('RESEND_API_KEY'),
  DIAGNOSTIC_EMAIL_FROM: readEnv('DIAGNOSTIC_EMAIL_FROM') ?? 'AI Video Systems <diagnostics@aivideosystems.org>',
  DIAGNOSTIC_INTERNAL_RECIPIENTS: readEnv('DIAGNOSTIC_INTERNAL_RECIPIENTS'),
  DIAGNOSTIC_ANALYSIS_URL: readEnv('DIAGNOSTIC_ANALYSIS_URL'),
  DIAGNOSTIC_WEBHOOK_URL: readEnv('DIAGNOSTIC_WEBHOOK_URL'),
  DIAGNOSTIC_WEBHOOK_SECRET: readEnv('DIAGNOSTIC_WEBHOOK_SECRET'),
  LEAD_WEBHOOK_URL: readEnv('LEAD_WEBHOOK_URL'),
  LEAD_WEBHOOK_SECRET: readEnv('LEAD_WEBHOOK_SECRET'),
  FUNERAL_LEAD_WEBHOOK_URL: readEnv('FUNERAL_LEAD_WEBHOOK_URL'),
  FUNERAL_LEAD_WEBHOOK_SECRET: readEnv('FUNERAL_LEAD_WEBHOOK_SECRET'),
  LEAD_ACCESS_SECRET: readEnv('LEAD_ACCESS_SECRET'),
  NEXT_PUBLIC_SITE_URL: readEnv('NEXT_PUBLIC_SITE_URL') ?? 'https://www.aivideosystems.org',
  PRIVACY_POLICY_URL: readEnv('PRIVACY_POLICY_URL') ?? '/privacy',
  TERMS_URL: readEnv('TERMS_URL') ?? '/terms',
};

export function hasSupabaseConfig(): boolean {
  return !!env.SUPABASE_URL && !!env.SUPABASE_SERVICE_ROLE_KEY;
}

export function hasResendConfig(): boolean {
  return !!env.RESEND_API_KEY;
}

export function hasWebhookConfig(): boolean {
  return !!env.DIAGNOSTIC_WEBHOOK_URL;
}

export function hasLeadWebhookConfig(): boolean {
  return !!env.LEAD_WEBHOOK_URL;
}

export interface LeadWebhookTarget {
  url: string;
  secret?: string;
}

/** Destination for Revenue Leak Calculator gate captures. */
export function getLeadWebhookTarget(): LeadWebhookTarget | null {
  return env.LEAD_WEBHOOK_URL ? { url: env.LEAD_WEBHOOK_URL, secret: env.LEAD_WEBHOOK_SECRET } : null;
}

/**
 * Destination for Funeral Plan Scale Readiness gate captures.
 *
 * Its own variable so funeral leads can go to a different Zap/CRM without disturbing the
 * Revenue Leak calculator. Falls back to the shared lead webhook when unset, so setting
 * only LEAD_WEBHOOK_URL still delivers both (the payload's `source` field tells them apart).
 * A secret always belongs to the URL it was configured with — never signed with the other
 * destination's key.
 */
export function getFuneralLeadWebhookTarget(): LeadWebhookTarget | null {
  if (env.FUNERAL_LEAD_WEBHOOK_URL) {
    return { url: env.FUNERAL_LEAD_WEBHOOK_URL, secret: env.FUNERAL_LEAD_WEBHOOK_SECRET };
  }
  return getLeadWebhookTarget();
}
