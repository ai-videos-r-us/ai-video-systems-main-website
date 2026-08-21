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
 * Sean's Zapier catch hook for funeral-plan gate captures. Checked in deliberately so the
 * page delivers leads the moment it deploys, with no environment-variable step.
 *
 * This repository is public, so the URL is not a secret: anyone can read it and POST junk
 * straight to the Zap, bypassing our validation and per-IP rate limiting. The capture
 * endpoint in front of it is also public, so this raises the noise ceiling rather than
 * opening a new door — but if the Zap ever starts eating task quota, rotate the hook in
 * Zapier and set FUNERAL_LEAD_WEBHOOK_URL in Vercel to the new one instead of committing it.
 */
export const DEFAULT_FUNERAL_LEAD_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/8612096/4tfd8l6/';

/**
 * Destination for Funeral Plan Scale Readiness gate captures.
 *
 * Its own variable so funeral leads can go somewhere different from the Revenue Leak
 * calculator. FUNERAL_LEAD_WEBHOOK_URL wins when set; otherwise the checked-in default
 * above is used, so this never silently stops delivering. A secret always belongs to the
 * URL it was configured with — never signed with the other destination's key, and the
 * default Zapier hook is sent unsigned because a catch hook cannot verify a signature.
 */
export function getFuneralLeadWebhookTarget(): LeadWebhookTarget {
  if (env.FUNERAL_LEAD_WEBHOOK_URL) {
    return { url: env.FUNERAL_LEAD_WEBHOOK_URL, secret: env.FUNERAL_LEAD_WEBHOOK_SECRET };
  }
  return { url: DEFAULT_FUNERAL_LEAD_WEBHOOK_URL };
}
