// Best-effort in-memory rate limiter, scoped to a single warm serverless instance.
// This is a defence-in-depth layer, not the primary control — see docs for enabling
// Vercel's platform-level (Firewall / Attack Challenge) rate limiting in production.

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now: number = Date.now()): boolean {
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);

  // Opportunistically bound memory growth for long-lived warm instances.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}
