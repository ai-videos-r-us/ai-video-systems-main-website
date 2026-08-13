import { randomBytes, createHash } from 'node:crypto';

/** Cryptographically random, non-sequential, unguessable public result token (256 bits). */
export function generateResultToken(): string {
  return randomBytes(32).toString('base64url');
}

/** One-way hash of a presented token, used for storage/lookup. Raw tokens are never stored. */
export function hashResultToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Assessment id used as an idempotency key when the client did not supply one. */
export function generateAssessmentId(): string {
  return randomBytes(16).toString('hex');
}
