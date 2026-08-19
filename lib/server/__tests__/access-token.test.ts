import { describe, expect, it } from 'vitest';
import { issueAccessToken, verifyAccessToken } from '../access-token.js';

describe('access token', () => {
  it('accepts a token it just issued', () => {
    const v = verifyAccessToken(issueAccessToken('sean@example.com'));
    expect(v.valid).toBe(true);
    expect(v.email).toBe('sean@example.com');
  });

  it('rejects a tampered payload', () => {
    const token = issueAccessToken('sean@example.com');
    const [, sig] = token.split('.');
    const forged = `${Buffer.from(JSON.stringify({ e: 'attacker@example.com', x: Date.now() + 10_000 }))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')}.${sig}`;
    expect(verifyAccessToken(forged).valid).toBe(false);
    expect(verifyAccessToken(forged).reason).toBe('bad_signature');
  });

  it('rejects an expired token', () => {
    const issuedLongAgo = issueAccessToken('sean@example.com', Date.now() - 1000 * 60 * 60 * 24);
    const v = verifyAccessToken(issuedLongAgo);
    expect(v.valid).toBe(false);
    expect(v.reason).toBe('expired');
  });

  it('rejects the values someone would actually try in sessionStorage', () => {
    for (const junk of ['true', '1', 'unlocked', '', 'a.b', '{}', 'null']) {
      expect(verifyAccessToken(junk).valid).toBe(false);
    }
  });

  it('rejects non-string input', () => {
    expect(verifyAccessToken(undefined).valid).toBe(false);
    expect(verifyAccessToken(null).valid).toBe(false);
    expect(verifyAccessToken({ accessToken: 'x' }).valid).toBe(false);
    expect(verifyAccessToken(12345).valid).toBe(false);
  });

  it('rejects a signature from a different payload', () => {
    const a = issueAccessToken('a@example.com');
    const b = issueAccessToken('b@example.com');
    const mixed = `${a.split('.')[0]}.${b.split('.')[1]}`;
    expect(verifyAccessToken(mixed).valid).toBe(false);
  });
});
