import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';
import { validateLead } from '../../lib/server/lead-validation.js';
import { sendLeadWebhook } from '../../lib/server/lead-webhook.js';
import { isRateLimited } from '../../lib/server/rate-limit.js';
import { getFuneralLeadWebhookTarget } from '../../lib/server/env.js';
import { issueAccessToken, HAS_STABLE_ACCESS_SECRET } from '../../lib/server/access-token.js';

/** Set server-side, never taken from the client, so the receiving Zap can trust it to route on. */
const SOURCE = 'funeral-plan-scale-readiness';

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (value ?? req.socket?.remoteAddress ?? 'unknown').split(',')[0].trim();
}

function parseBody(req: VercelRequest): unknown {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return undefined;
    }
  }
  return req.body;
}

/**
 * Gate capture for the Funeral Plan Scale Readiness Diagnostic. Same contract as the Revenue
 * Leak gate — first name, email, required marketing consent — but delivered to the funeral
 * destination (FUNERAL_LEAD_WEBHOOK_URL, falling back to LEAD_WEBHOOK_URL).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { category: 'method_not_allowed' } });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(`funeral-lead:${clientIp}`)) {
    return res.status(429).json({ error: { category: 'rate_limited' } });
  }

  const validation = validateLead(parseBody(req));
  if (!validation.success || !validation.data) {
    return res.status(400).json({ error: { category: 'validation_failed', issues: validation.issues } });
  }

  const lead = { ...validation.data, source: SOURCE };

  // Honeypot: accept and silently discard so the bot sees a success and stops retrying.
  if (lead.company_website && lead.company_website.trim().length > 0) {
    return res.status(200).json({ ok: true, delivery: 'discarded' });
  }

  if (!HAS_STABLE_ACCESS_SECRET) {
    console.warn('lead_access_secret_missing: set LEAD_ACCESS_SECRET so unlocks survive across serverless instances');
  }

  // The lead is captured at this point (delivered below, or logged for replay if delivery
  // fails). That is what earns access — a webhook outage is ours to fix, not a reason to
  // withhold the diagnostic from someone who has just handed over their details.
  const accessToken = issueAccessToken(lead.email);

  const target = getFuneralLeadWebhookTarget();
  if (!target) {
    // No destination configured yet. Log it so the lead is at least recoverable from Vercel's
    // function logs, and still let the visitor through to the diagnostic.
    console.warn(
      'funeral_lead_webhook_not_configured',
      JSON.stringify({ firstName: lead.firstName, email: lead.email })
    );
    return res.status(200).json({ ok: true, delivery: 'not_configured', accessToken });
  }

  const result = await sendLeadWebhook({
    lead,
    capturedAt: new Date().toISOString(),
    clientIpHash: createHash('sha256').update(clientIp).digest('hex').slice(0, 16),
    target,
  });

  if (result.status === 'failed') {
    console.error(
      'funeral_lead_webhook_failed',
      JSON.stringify({ category: result.errorCategory, firstName: lead.firstName, email: lead.email })
    );
    return res.status(200).json({ ok: true, delivery: 'failed', accessToken });
  }

  return res.status(200).json({ ok: true, delivery: result.status, accessToken });
}
