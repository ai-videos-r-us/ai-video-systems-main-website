import { describe, expect, it } from 'vitest';
import { validateLead } from '../lead-validation.js';

const VALID = { firstName: 'Sean', email: 'sean@example.com', marketingConsent: true };

describe('validateLead', () => {
  it('accepts a complete submission', () => {
    const r = validateLead(VALID);
    expect(r.success).toBe(true);
    expect(r.data?.email).toBe('sean@example.com');
  });

  it('rejects a submission without the consent box ticked', () => {
    expect(validateLead({ ...VALID, marketingConsent: false }).success).toBe(false);
    expect(validateLead({ firstName: 'Sean', email: 'sean@example.com' }).success).toBe(false);
  });

  it('rejects a missing or malformed email', () => {
    expect(validateLead({ ...VALID, email: 'not-an-email' }).success).toBe(false);
    expect(validateLead({ firstName: 'Sean', marketingConsent: true }).success).toBe(false);
  });

  it('rejects a blank first name', () => {
    expect(validateLead({ ...VALID, firstName: '   ' }).success).toBe(false);
  });

  it('keeps the honeypot value so the handler can discard bots', () => {
    const r = validateLead({ ...VALID, company_website: 'http://spam.example' });
    expect(r.success).toBe(true);
    expect(r.data?.company_website).toBe('http://spam.example');
  });

  it('carries attribution through when present', () => {
    const r = validateLead({ ...VALID, attribution: { utmSource: 'instagram', utmCampaign: 'leak' } });
    expect(r.data?.attribution?.utmSource).toBe('instagram');
  });
});
