import { CATEGORIES, CATEGORY_MAP } from './constants';
import { STRENGTH_CONTENT } from './content';
import type { CategoryKey } from './types';

export interface Strength {
  categoryKey: CategoryKey;
  categoryName: string;
  score: number;
  copy: string;
}

/** The two highest-scoring categories, ties broken by stable declared category order. */
export function buildStrengths(categoryScores: Record<CategoryKey, number>): Strength[] {
  const ordered = [...CATEGORIES].sort((a, b) => {
    const diff = categoryScores[b.key] - categoryScores[a.key];
    if (diff !== 0) return diff;
    return a.order - b.order;
  });

  return ordered.slice(0, 2).map((category) => ({
    categoryKey: category.key,
    categoryName: CATEGORY_MAP[category.key].name,
    score: Math.round(categoryScores[category.key]),
    copy: STRENGTH_CONTENT[category.key],
  }));
}
