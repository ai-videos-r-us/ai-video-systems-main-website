import type { VercelRequest, VercelResponse } from '@vercel/node';
import { findByTokenHash } from '../../../lib/server/repository';
import { hashResultToken } from '../../../lib/server/token';
import { env, hasSupabaseConfig } from '../../../lib/server/env';
import { DIAGNOSTIC_ANALYSIS_URL_LABEL } from '../../../lib/diagnostic/cta-copy';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: { category: 'method_not_allowed' } });
  }

  // Results are confidential and never indexable — belt-and-braces alongside the vercel.json header rule.
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Cache-Control', 'private, no-store');

  const token = typeof req.query.token === 'string' ? req.query.token : undefined;
  if (!token) {
    return res.status(400).json({ error: { category: 'missing_token' } });
  }

  if (!hasSupabaseConfig()) {
    return res.status(404).json({ error: { category: 'results_storage_not_configured' } });
  }

  try {
    const row = await findByTokenHash(hashResultToken(token));
    if (!row) {
      return res.status(404).json({ error: { category: 'result_not_found' } });
    }

    const ctaUrl = row.ctaVariant === 'primary_deeper_analysis' ? env.DIAGNOSTIC_ANALYSIS_URL : undefined;

    return res.status(200).json({
      firstName: row.firstName,
      result: row.publicResult,
      ctaUrl,
      ctaLabel: DIAGNOSTIC_ANALYSIS_URL_LABEL,
    });
  } catch (err) {
    console.error('diagnostic_result_lookup_failed', err instanceof Error ? err.message : err);
    return res.status(500).json({ error: { category: 'lookup_failed' } });
  }
}
