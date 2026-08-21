import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * env.ts reads process.env once at module load, so each case has to reset the module
 * registry and re-import. Guards the money path: which destination a gate capture is
 * delivered to, and which secret signs it.
 */
async function loadEnv(vars: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(vars)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  return import('../env.js');
}

const KEYS = [
  'LEAD_WEBHOOK_URL',
  'LEAD_WEBHOOK_SECRET',
  'FUNERAL_LEAD_WEBHOOK_URL',
  'FUNERAL_LEAD_WEBHOOK_SECRET',
];

afterEach(() => {
  for (const key of KEYS) delete process.env[key];
  vi.resetModules();
});

describe('getFuneralLeadWebhookTarget', () => {
  it('uses the funeral destination when one is configured', async () => {
    const { getFuneralLeadWebhookTarget } = await loadEnv({
      FUNERAL_LEAD_WEBHOOK_URL: 'https://hooks.example/funeral',
      FUNERAL_LEAD_WEBHOOK_SECRET: 'funeral-secret',
      LEAD_WEBHOOK_URL: 'https://hooks.example/revenue-leak',
      LEAD_WEBHOOK_SECRET: 'revenue-secret',
    });
    expect(getFuneralLeadWebhookTarget()).toEqual({
      url: 'https://hooks.example/funeral',
      secret: 'funeral-secret',
    });
  });

  it('never signs the funeral destination with the revenue-leak secret', async () => {
    const { getFuneralLeadWebhookTarget } = await loadEnv({
      FUNERAL_LEAD_WEBHOOK_URL: 'https://hooks.example/funeral',
      FUNERAL_LEAD_WEBHOOK_SECRET: undefined,
      LEAD_WEBHOOK_URL: 'https://hooks.example/revenue-leak',
      LEAD_WEBHOOK_SECRET: 'revenue-secret',
    });
    expect(getFuneralLeadWebhookTarget()).toEqual({ url: 'https://hooks.example/funeral', secret: undefined });
  });

  it('falls back to the shared lead destination when no funeral URL is set', async () => {
    const { getFuneralLeadWebhookTarget } = await loadEnv({
      FUNERAL_LEAD_WEBHOOK_URL: undefined,
      FUNERAL_LEAD_WEBHOOK_SECRET: undefined,
      LEAD_WEBHOOK_URL: 'https://hooks.example/revenue-leak',
      LEAD_WEBHOOK_SECRET: 'revenue-secret',
    });
    expect(getFuneralLeadWebhookTarget()).toEqual({
      url: 'https://hooks.example/revenue-leak',
      secret: 'revenue-secret',
    });
  });

  it('returns null when nothing is configured, so the handler logs instead of posting', async () => {
    const { getFuneralLeadWebhookTarget, getLeadWebhookTarget } = await loadEnv({
      FUNERAL_LEAD_WEBHOOK_URL: undefined,
      FUNERAL_LEAD_WEBHOOK_SECRET: undefined,
      LEAD_WEBHOOK_URL: undefined,
      LEAD_WEBHOOK_SECRET: undefined,
    });
    expect(getFuneralLeadWebhookTarget()).toBeNull();
    expect(getLeadWebhookTarget()).toBeNull();
  });

  it('leaves the revenue-leak destination alone when a funeral URL is set', async () => {
    const { getLeadWebhookTarget } = await loadEnv({
      FUNERAL_LEAD_WEBHOOK_URL: 'https://hooks.example/funeral',
      LEAD_WEBHOOK_URL: 'https://hooks.example/revenue-leak',
      LEAD_WEBHOOK_SECRET: 'revenue-secret',
    });
    expect(getLeadWebhookTarget()).toEqual({
      url: 'https://hooks.example/revenue-leak',
      secret: 'revenue-secret',
    });
  });
});

describe('sendLeadWebhook', () => {
  const lead = { firstName: 'Sean', email: 'sean@example.com', marketingConsent: true as const, attribution: {} };

  it('posts to the target it is given, signed with that target\'s secret', async () => {
    await loadEnv({ LEAD_WEBHOOK_URL: 'https://hooks.example/revenue-leak', LEAD_WEBHOOK_SECRET: 'revenue-secret' });
    const { sendLeadWebhook } = await import('../lead-webhook.js');

    const fetchMock = vi.fn().mockResolvedValue({ ok: true } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendLeadWebhook({
      lead: { ...lead, source: 'funeral-plan-scale-readiness' },
      capturedAt: '2026-01-01T00:00:00.000Z',
      target: { url: 'https://hooks.example/funeral', secret: 'funeral-secret' },
    });

    expect(result.status).toBe('sent');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://hooks.example/funeral');
    expect((init.headers as Record<string, string>)['X-Lead-Signature']).toMatch(/^sha256=[0-9a-f]{64}$/);
    expect(JSON.parse(init.body as string).source).toBe('funeral-plan-scale-readiness');

    vi.unstubAllGlobals();
  });

  it('reports not_configured rather than posting when the target is null', async () => {
    await loadEnv({ LEAD_WEBHOOK_URL: 'https://hooks.example/revenue-leak' });
    const { sendLeadWebhook } = await import('../lead-webhook.js');

    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await sendLeadWebhook({ lead, capturedAt: '2026-01-01T00:00:00.000Z', target: null });

    expect(result.status).toBe('not_configured');
    expect(fetchMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
