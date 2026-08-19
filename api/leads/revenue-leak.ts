import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'node:crypto';
import { validateLead } from '../../lib/server/lead-validation.js';
import { sendLeadWebhook } from '../../lib/server/lead-webhook.js';
import { isRateLimited } from '../../lib/server/rate-limit.js';
import { hasLeadWebhookConfig } from '../../lib/server/env.js';
import { issueAccessToken, HAS_STABLE_ACCESS_SECRET } from '../../lib/server/access-token.js';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { category: 'method_not_allowed' } });
  }

  const clientIp = getClientIp(req);
  if (isRateLimited(`lead:${clientIp}`)) {
    return res.status(429).json({ error: { category: 'rate_limited' } });
  }

  const validation = validateLead(parseBody(req));
  if (!validation.success || !validation.data) {
    return res.status(400).json({ error: { category: 'validation_failed', issues: validation.issues } });
  }

  const lead = validation.data;

  // Honeypot: accept and silently discard so the bot sees a success and stops retrying.
  if (lead.company_website && lead.company_website.trim().length > 0) {
    return res.status(200).json({ ok: true, delivery: 'discarded' });
  }

  if (!HAS_STABLE_ACCESS_SECRET) {
    console.warn('lead_access_secret_missing: set LEAD_ACCESS_SECRET so unlocks survive across serverless instances');
  }

  // The lead has been validated and is now recorded (delivered below, or logged for
  // replay if delivery fails). That is what earns access — downstream delivery problems
  // are ours to fix, not a reason to withhold what the visitor just paid for with contact details.
  const accessToken = issueAccessToken(lead.email);

  if (!hasLeadWebhookConfig()) {
    // No destination configured yet. Log it so the lead is at least recoverable from
    // Vercel's function logs, and still let the visitor through to the calculator.
    console.warn('lead_webhook_not_configured', JSON.stringify({ firstName: lead.firstName, email: lead.email }));
    return res.status(200).json({ ok: true, delivery: 'not_configured', accessToken });
  }

  const result = await sendLeadWebhook({
    lead,
    capturedAt: new Date().toISOString(),
    clientIpHash: createHash('sha256').update(clientIp).digest('hex').slice(0, 16),
  });

  if (result.status === 'failed') {
    // Never lose the lead silently — logged so it can be replayed by hand if the
    // destination was down. The visitor is still let through; see the client for why.
    console.error(
      'lead_webhook_failed',
      JSON.stringify({ category: result.errorCategory, firstName: lead.firstName, email: lead.email })
    );
    return res.status(200).json({ ok: true, delivery: 'failed', accessToken });
  }

  return res.status(200).json({ ok: true, delivery: result.status, accessToken });
}
