import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { env } from './env.js';

/**
 * Short-lived, HMAC-signed proof that a visitor actually completed the lead gate.
 *
 * The token is issued by the capture endpoint and is the ONLY thing that unlocks the
 * calculator. It is signed server-side, so a visitor cannot forge one by editing
 * sessionStorage or replaying a request body.
 */

const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours — long enough to survive a working day.

// Falls back through the secrets most likely to already be set. If none are, we mint a
// per-instance random secret: tokens then stop validating across serverless instances,
// which fails CLOSED (a visitor is re-gated) rather than open. Set LEAD_ACCESS_SECRET
// in production to avoid that.
const SECRET = env.LEAD_ACCESS_SECRET ?? env.LEAD_WEBHOOK_SECRET ?? randomBytes(32).toString('hex');

export const HAS_STABLE_ACCESS_SECRET = !!(env.LEAD_ACCESS_SECRET ?? env.LEAD_WEBHOOK_SECRET);

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(input: string): Buffer {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

function sign(body: string): string {
  return b64url(createHmac('sha256', SECRET).update(body).digest());
}

export function issueAccessToken(email: string, now: number = Date.now()): string {
  const body = b64url(JSON.stringify({ e: email, x: now + TTL_MS }));
  return `${body}.${sign(body)}`;
}

export interface AccessTokenVerdict {
  valid: boolean;
  reason?: 'malformed' | 'bad_signature' | 'expired';
  email?: string;
}

export function verifyAccessToken(token: unknown, now: number = Date.now()): AccessTokenVerdict {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return { valid: false, reason: 'malformed' };
  }
  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false, reason: 'malformed' };

  const [body, signature] = parts;
  const expected = sign(body);

  // Constant-time compare so the signature can't be discovered by timing the response.
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: 'bad_signature' };
  }

  let payload: { e?: unknown; x?: unknown };
  try {
    payload = JSON.parse(fromB64url(body).toString('utf8'));
  } catch {
    return { valid: false, reason: 'malformed' };
  }

  if (typeof payload.x !== 'number' || now > payload.x) {
    return { valid: false, reason: 'expired' };
  }
  return { valid: true, email: typeof payload.e === 'string' ? payload.e : undefined };
}
