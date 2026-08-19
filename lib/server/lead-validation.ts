import { z } from 'zod';

// Gate capture for the Revenue Leak Calculator. Deliberately minimal: first name and
// email are the only required fields, because every extra field costs completions and
// the calculator itself is what qualifies the lead, not the form.
const leadSchema = z.object({
  firstName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  // Required. The gate makes ticking this a condition of access, so the server enforces
  // it rather than trusting the client — otherwise the requirement is cosmetic.
  marketingConsent: z.literal(true),
  source: z.string().trim().max(80).optional(),
  attribution: z
    .object({
      utmSource: z.string().trim().max(200).optional(),
      utmMedium: z.string().trim().max(200).optional(),
      utmCampaign: z.string().trim().max(200).optional(),
      utmTerm: z.string().trim().max(200).optional(),
      utmContent: z.string().trim().max(200).optional(),
      referrer: z.string().trim().max(2000).optional(),
      landingPath: z.string().trim().max(500).optional(),
    })
    .partial()
    .optional()
    .default({}),
  // Honeypot. Real browsers leave this empty; most naive bots fill every input they find.
  company_website: z.string().max(200).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export interface LeadValidationResult {
  success: boolean;
  data?: LeadInput;
  issues?: { path: string; message: string }[];
}

export function validateLead(body: unknown): LeadValidationResult {
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return {
      success: false,
      issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    };
  }
  return { success: true, data: parsed.data };
}
