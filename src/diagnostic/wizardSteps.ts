import { SCORED_QUESTIONS } from '../../lib/diagnostic/questions';
import { CATEGORIES } from '../../lib/diagnostic/constants';
import type { CategoryKey } from '../../lib/diagnostic/types';

export type StepDef =
  | { type: 'context'; key: string; title: string; questionIds: string[] }
  | { type: 'scored'; key: string; questionId: string; categoryKey: CategoryKey }
  | { type: 'financial'; key: string; group: 'core' | 'extra' }
  | { type: 'contact'; key: 'contact' };

const CONTEXT_GROUPS: { title: string; questionIds: string[] }[] = [
  { title: 'About your business', questionIds: ['ctx1', 'ctx2'] },
  { title: 'Your growth plans', questionIds: ['ctx3', 'ctx10', 'ctx11'] },
  { title: 'Your acquisition today', questionIds: ['ctx4', 'ctx5', 'ctx6'] },
  { title: 'Your sales and data today', questionIds: ['ctx7', 'ctx8', 'ctx9'] },
  { title: 'Recent changes', questionIds: ['ctx12'] },
];

export const WIZARD_STEPS: StepDef[] = [
  ...CONTEXT_GROUPS.map((group, i) => ({
    type: 'context' as const,
    key: `context-${i}`,
    title: group.title,
    questionIds: group.questionIds,
  })),
  ...SCORED_QUESTIONS.map((q) => ({
    type: 'scored' as const,
    key: q.id,
    questionId: q.id,
    categoryKey: q.categoryKey,
  })),
  { type: 'financial', key: 'financial-core', group: 'core' },
  { type: 'financial', key: 'financial-extra', group: 'extra' },
  { type: 'contact', key: 'contact' },
];

export function getCategoryProgress(stepIndex: number): { sectionNumber: number; sectionName: string } | null {
  const step = WIZARD_STEPS[stepIndex];
  if (!step || step.type !== 'scored') return null;
  const categoryIndex = CATEGORIES.findIndex((c) => c.key === step.categoryKey);
  return { sectionNumber: categoryIndex + 1, sectionName: CATEGORIES[categoryIndex].name };
}

export const TOTAL_STEPS = WIZARD_STEPS.length;
