import type { VercelRequest, VercelResponse } from '@vercel/node';
import { analysisRequestSchema } from '../../lib/server/validation.js';
import { recordAnalysisRequest } from '../../lib/server/repository.js';
import { hashResultToken } from '../../lib/server/token.js';
import { hasSupabaseConfig } from '../../lib/server/env.js';
import { isRateLimited } from '../../lib/server/rate-limit.js';

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (value ?? req.socket?.remoteAddress ?? 'unknown').split(',')[0].trim();
}

// Inline fallback used when DIAGNOSTIC_ANALYSIS_URL is not configured — see section 21 of the spec.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { category: 'method_not_allowed' } });
  }

  if (isRateLimited(getClientIp(req))) {
    return res.status(429).json({ error: { category: 'rate_limited' } });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const parsed = analysisRequestSchema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({ error: { category: 'validation_failed' } });
  }

  if (!hasSupabaseConfig()) {
    return res.status(503).json({ error: { category: 'storage_not_configured' } });
  }

  try {
    const row = await recordAnalysisRequest(hashResultToken(parsed.data.resultToken), {
      phone: parsed.data.phone,
      preferredContactMethod: parsed.data.preferredContactMethod,
      note: parsed.data.note,
    });
    if (!row) {
      return res.status(404).json({ error: { category: 'result_not_found' } });
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('diagnostic_analysis_request_failed', err instanceof Error ? err.message : err);
    return res.status(500).json({ error: { category: 'request_failed' } });
  }
}
