import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * IndexNow: tells Bing (and other IndexNow engines) which pages are new or changed, so they are
 * crawled in hours instead of weeks. The key below is public by design: it must be readable at
 * https://www.aivideosystems.org/<key>.txt (public/<key>.txt) so engines can verify ownership.
 *
 * Runs daily from a Vercel cron (vercel.json). It reads the live sitemap and submits URLs whose
 * lastmod is within the last 2 days. Manual full submit: GET /api/indexnow?all=1
 * If CRON_SECRET is set in the Vercel project, the request must carry "Authorization: Bearer <secret>"
 * (Vercel cron sends it automatically).
 */
const HOST = 'www.aivideosystems.org';
const KEY = '84e6279b94c9176c49ae2526ee7c1309';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const RECENT_DAYS = 2;

export function parseSitemap(xml: string): { loc: string; lastmod?: string }[] {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: /<loc>([^<]+)<\/loc>/.exec(m[1])?.[1].trim() ?? '',
    lastmod: /<lastmod>([^<]+)<\/lastmod>/.exec(m[1])?.[1].trim(),
  })).filter((u) => u.loc.startsWith(`https://${HOST}/`));
}

export function pickUrls(entries: { loc: string; lastmod?: string }[], all: boolean, now = Date.now()): string[] {
  const cutoff = now - RECENT_DAYS * 24 * 60 * 60 * 1000;
  return entries
    .filter((u) => all || (u.lastmod !== undefined && Date.parse(u.lastmod) >= cutoff))
    .map((u) => u.loc);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  try {
    const all = req.query.all === '1';
    const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
    const urls = pickUrls(parseSitemap(xml), all);
    if (urls.length === 0) {
      res.status(200).json({ submitted: 0, note: 'no recently changed URLs' });
      return;
    }
    if (process.env.INDEXNOW_DRY_RUN === '1') {
      res.status(200).json({ dryRun: true, urls });
      return;
    }
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls.slice(0, 10000) }),
    });
    // 200 and 202 both mean accepted.
    res.status(r.ok ? 200 : 502).json({ submitted: urls.length, indexnowStatus: r.status });
  } catch (err) {
    console.error('[indexnow]', err);
    res.status(500).json({ error: 'failed' });
  }
}
