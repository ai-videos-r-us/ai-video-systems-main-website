import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyAccessToken } from '../../lib/server/access-token.js';
import { isRateLimited } from '../../lib/server/rate-limit.js';

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (value ?? req.socket?.remoteAddress ?? 'unknown').split(',')[0].trim();
}

/**
 * Revalidates a stored access token on page load. Without this the client could unlock
 * itself by writing anything into sessionStorage — the signature has to be checked by
 * the server that issued it.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: { category: 'method_not_allowed' } });
  }

  if (isRateLimited(`verify:${getClientIp(req)}`)) {
    return res.status(429).json({ valid: false });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  const token = (body as { accessToken?: unknown } | undefined)?.accessToken;
  const verdict = verifyAccessToken(token);

  res.setHeader('Cache-Control', 'private, no-store');
  return res.status(200).json({ valid: verdict.valid });
}

function safeParse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch {
    return undefined;
  }
}
