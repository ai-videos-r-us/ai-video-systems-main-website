import { describe, expect, it } from 'vitest';
import { validateSubmission } from '../validation';
import { SCORED_QUESTIONS } from '../../diagnostic/questions';

function validScoredAnswers(): Record<string, string> {
  return Object.fromEntries(SCORED_QUESTIONS.map((q) => [q.id, q.options[0].id]));
}

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    idempotencyKey: 'a'.repeat(16),
    scoredAnswers: validScoredAnswers(),
    context: { ctx3: 'final_authority' },
    financial: { alignment: 'yes' },
    contact: {
      firstName: 'Jo',
      surname: 'Bloggs',
      company: 'Test Funeral Plans Ltd',
      workEmail: 'jo@example.com',
    },
    consents: { marketing: false, research: false },
    attribution: {},
    ...overrides,
  };
}

describe('validateSubmission', () => {
  it('accepts a fully valid payload', () => {
    const result = validateSubmission(validPayload());
    expect(result.success).toBe(true);
  });

  it('rejects a payload missing a required scored answer', () => {
    const answers = validScoredAnswers();
    delete (answers as Record<string, string>).a1;
    const result = validateSubmission(validPayload({ scoredAnswers: answers }));
    expect(result.success).toBe(false);
    expect(result.issues?.some((i) => i.path === 'scoredAnswers.a1')).toBe(true);
  });

  it('rejects an unknown answer id', () => {
    const answers = { ...validScoredAnswers(), a1: 'not_a_real_answer' };
    const result = validateSubmission(validPayload({ scoredAnswers: answers }));
    expect(result.success).toBe(false);
    expect(result.issues?.some((i) => i.path === 'scoredAnswers.a1')).toBe(true);
  });

  it('rejects an unknown context option id', () => {
    const result = validateSubmission(validPayload({ context: { ctx3: 'made_up_option' } }));
    expect(result.success).toBe(false);
  });

  it('rejects an invalid work email', () => {
    const result = validateSubmission(
      validPayload({ contact: { firstName: 'Jo', surname: 'B', company: 'X', workEmail: 'not-an-email' } })
    );
    expect(result.success).toBe(false);
  });

  it('rejects numeric financial values outside the documented limits', () => {
    const result = validateSubmission(validPayload({ financial: { monthlySpendGbp: -5, alignment: 'yes' } }));
    expect(result.success).toBe(false);
  });

  it('rejects completed plans greater than paid enquiries when alignment is confirmed', () => {
    const result = validateSubmission(
      validPayload({ financial: { alignment: 'yes', paidEnquiries: 10, completedPlans: 20 } })
    );
    expect(result.success).toBe(false);
  });

  it('rejects tampered/extraneous scored-answer keys', () => {
    const answers = { ...validScoredAnswers(), z99: 'z99_0' };
    const result = validateSubmission(validPayload({ scoredAnswers: answers }));
    expect(result.success).toBe(false);
  });
});
