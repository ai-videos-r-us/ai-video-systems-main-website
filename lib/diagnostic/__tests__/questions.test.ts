import { describe, expect, it } from 'vitest';
import { CATEGORIES, TOTAL_CATEGORY_WEIGHT } from '../constants';
import { SCORED_QUESTIONS } from '../questions';
import { CONTEXT_QUESTIONS, CTX12_TRIGGERS } from '../context-questions';

const EXPECTED_QUESTION_IDS = [
  'a1', 'a2', 'a3', 'a4',
  'c1', 'c2', 'c3', 'c4',
  'l1', 'l2', 'l3', 'l4',
  'p1', 'p2', 'p3', 'p4',
  'e1', 'e2', 'e3', 'e4',
  'r1', 'r2', 'r3', 'r4',
  'g1', 'g2', 'g3', 'g4',
];

describe('category weights', () => {
  it('total exactly 1.0', () => {
    expect(TOTAL_CATEGORY_WEIGHT).toBeCloseTo(1, 10);
  });

  it('has exactly 7 categories, each with 4 questions', () => {
    expect(CATEGORIES).toHaveLength(7);
    for (const category of CATEGORIES) {
      const questions = SCORED_QUESTIONS.filter((q) => q.categoryKey === category.key);
      expect(questions).toHaveLength(4);
    }
  });
});

describe('scored question bank', () => {
  it('contains exactly the 28 required question ids, each exactly once', () => {
    expect(SCORED_QUESTIONS).toHaveLength(28);
    const ids = SCORED_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(28);
    for (const expectedId of EXPECTED_QUESTION_IDS) {
      expect(ids).toContain(expectedId);
    }
  });

  it('has unique answer ids within each question', () => {
    for (const question of SCORED_QUESTIONS) {
      const optionIds = question.options.map((o) => o.id);
      expect(new Set(optionIds).size).toBe(optionIds.length);
    }
  });

  it('every answer score is one of 0, 25, 50, 75 or 100', () => {
    for (const question of SCORED_QUESTIONS) {
      for (const option of question.options) {
        expect([0, 25, 50, 75, 100]).toContain(option.score);
      }
    }
  });

  it('every question has at least one score-0 and one score-100 option', () => {
    for (const question of SCORED_QUESTIONS) {
      const scores = question.options.map((o) => o.score);
      expect(scores).toContain(0);
      expect(scores).toContain(100);
    }
  });

  it('special zero-score unknown answers match the approved question bank exactly', () => {
    const zeroScoreUnknowns: Record<string, string> = {
      p1: 'p1_unknown',
      e1: 'e1_unknown',
      e4: 'e4_unknown',
      r1: 'r1_unknown',
      r2: 'r2_unknown',
      r3: 'r3_unknown',
    };
    for (const [questionId, answerId] of Object.entries(zeroScoreUnknowns)) {
      const question = SCORED_QUESTIONS.find((q) => q.id === questionId)!;
      const option = question.options.find((o) => o.id === answerId)!;
      expect(option.score).toBe(0);
      expect(option.uncertaintyFlag).toBe(true);
    }
  });

  it('standard uncertain "not sure" answers score 25 with an uncertainty flag', () => {
    const standardUnknowns = SCORED_QUESTIONS.filter((q) =>
      q.options.some((o) => o.id.endsWith('_unknown'))
    )
      .map((q) => ({ q, o: q.options.find((o) => o.id.endsWith('_unknown'))! }))
      .filter(({ o }) => o.score !== 0);

    for (const { o } of standardUnknowns) {
      expect(o.score).toBe(25);
      expect(o.uncertaintyFlag).toBe(true);
    }
    // sanity: there should be several of these (most questions use the 25-point unknown)
    expect(standardUnknowns.length).toBeGreaterThan(15);
  });

  it('solo-founder special answers (g2_solo, g3_solo) score 0 without an uncertainty flag', () => {
    const g2 = SCORED_QUESTIONS.find((q) => q.id === 'g2')!.options.find((o) => o.id === 'g2_solo')!;
    const g3 = SCORED_QUESTIONS.find((q) => q.id === 'g3')!.options.find((o) => o.id === 'g3_solo')!;
    expect(g2.score).toBe(0);
    expect(g2.uncertaintyFlag).toBeFalsy();
    expect(g3.score).toBe(0);
    expect(g3.uncertaintyFlag).toBeFalsy();
  });
});

describe('context questions', () => {
  it('has 12 context questions', () => {
    expect(CONTEXT_QUESTIONS).toHaveLength(12);
  });

  it('CTX12 triggers include exactly one exclusive "none" option', () => {
    const exclusiveOptions = CTX12_TRIGGERS.filter((t) => t.exclusive);
    expect(exclusiveOptions).toHaveLength(1);
    expect(exclusiveOptions[0].id).toBe('trigger_none');
    expect(exclusiveOptions[0].severity).toBe(0);
  });

  it('fit-points questions sum to a maximum possible fit score of 100', () => {
    const maxByQuestion = [
      Math.max(...CONTEXT_QUESTIONS.find((q) => q.id === 'ctx3')!.options.map((o) => o.fitPoints ?? 0)),
      Math.max(...CONTEXT_QUESTIONS.find((q) => q.id === 'ctx5')!.options.map((o) => o.fitPoints ?? 0)),
      Math.max(...CONTEXT_QUESTIONS.find((q) => q.id === 'ctx6')!.options.map((o) => o.fitPoints ?? 0)),
      Math.max(...CONTEXT_QUESTIONS.find((q) => q.id === 'ctx7')!.options.map((o) => o.fitPoints ?? 0)),
      Math.max(...CONTEXT_QUESTIONS.find((q) => q.id === 'ctx8')!.options.map((o) => o.fitPoints ?? 0)),
      Math.max(...CONTEXT_QUESTIONS.find((q) => q.id === 'ctx9')!.options.map((o) => o.fitPoints ?? 0)),
      Math.max(...CONTEXT_QUESTIONS.find((q) => q.id === 'ctx10')!.options.map((o) => o.fitPoints ?? 0)),
      Math.max(...CONTEXT_QUESTIONS.find((q) => q.id === 'ctx11')!.options.map((o) => o.fitPoints ?? 0)),
    ];
    expect(maxByQuestion).toEqual([10, 25, 15, 15, 10, 10, 10, 5]);
    expect(maxByQuestion.reduce((a, b) => a + b, 0)).toBe(100);
  });
});
