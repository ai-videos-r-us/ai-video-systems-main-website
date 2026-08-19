import { createHmac } from 'node:crypto';
import { env, hasLeadWebhookConfig } from './env.js';
import type { LeadInput } from './lead-validation.js';

export interface LeadWebhookResult {
  status: 'sent' | 'failed' | 'not_configured';
  errorCategory?: string;
}

export interface LeadWebhookInput {
  lead: LeadInput;
  capturedAt: string;
  clientIpHash?: string;
}

/**
 * Flat, predictable payload — Zapier, Make, n8n and GoHighLevel all map this shape
 * without a code step. Signed with HMAC-SHA256 when LEAD_WEBHOOK_SECRET is set, in the
 * same X-Signature style the diagnostic webhook already uses.
 */
export function buildLeadPayload(input: LeadWebhookInput) {
  const { lead } = input;
  return {
    event: 'lead.captured',
    source: lead.source ?? 'revenue-leak-calculator',
    capturedAt: input.capturedAt,
    firstName: lead.firstName,
    email: lead.email,
    marketingConsent: lead.marketingConsent ?? false,
    utmSource: lead.attribution?.utmSource ?? null,
    utmMedium: lead.attribution?.utmMedium ?? null,
    utmCampaign: lead.attribution?.utmCampaign ?? null,
    utmTerm: lead.attribution?.utmTerm ?? null,
    utmContent: lead.attribution?.utmContent ?? null,
    referrer: lead.attribution?.referrer ?? null,
    landingPath: lead.attribution?.landingPath ?? null,
  };
}

export async function sendLeadWebhook(input: LeadWebhookInput): Promise<LeadWebhookResult> {
  if (!hasLeadWebhookConfig()) return { status: 'not_configured' };

  try {
    const body = JSON.stringify(buildLeadPayload(input));
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (env.LEAD_WEBHOOK_SECRET) {
      const signature = createHmac('sha256', env.LEAD_WEBHOOK_SECRET).update(body).digest('hex');
      headers['X-Lead-Signature'] = `sha256=${signature}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let response: Response;
    try {
      response = await fetch(env.LEAD_WEBHOOK_URL!, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) return { status: 'failed', errorCategory: `http_${response.status}` };
    return { status: 'sent' };
  } catch {
    return { status: 'failed', errorCategory: 'request_exception' };
  }
}
