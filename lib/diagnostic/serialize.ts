import { CLASSIFICATION_DISCLAIMER, CONSTRAINT_CONTENT } from './content.js';
import { buildPriorities, buildRisks, type Priority } from './priorities.js';
import { buildStrengths, type Strength } from './strengths.js';
import type { FullScoringResult } from './scoring.js';
import type { CategoryKey } from './types.js';

/**
 * The subset of a FullScoringResult that is safe to return from a public API /
 * render on the results page. Hidden Need/Fit scores and bands are deliberately
 * excluded — only the CTA variant they select is exposed. This snapshot is
 * computed once at submission time and stored verbatim for later revisits.
 */
export interface PublicResult {
  overallReadinessRounded: number;
  classification: FullScoringResult['classification'];
  classificationDisclaimer: string;
  dataConfidenceLevel: FullScoringResult['dataConfidence']['level'];
  categoryScores: Record<CategoryKey, number>;
  primaryConstraint: { key: string; name: string; categoryKey: CategoryKey } & (typeof CONSTRAINT_CONTENT)[keyof typeof CONSTRAINT_CONTENT];
  secondaryConstraint: { key: string; name: string; categoryKey: CategoryKey } & (typeof CONSTRAINT_CONTENT)[keyof typeof CONSTRAINT_CONTENT];
  interconnectedConstraints: boolean;
  strengths: Strength[];
  priorities: Priority[];
  risks: string[];
  ctaVariant: FullScoringResult['ctaVariant'];
  financialOutputs: FullScoringResult['financialOutputs'];
}

export function toPublicResult(result: FullScoringResult): PublicResult {
  const roundedCategoryScores = Object.fromEntries(
    Object.entries(result.categoryScores).map(([key, value]) => [key, Math.round(value)])
  ) as Record<CategoryKey, number>;

  const primaryContent = CONSTRAINT_CONTENT[result.constraintDiagnosis.primary.constraintKey];
  const secondaryContent = CONSTRAINT_CONTENT[result.constraintDiagnosis.secondary.constraintKey];

  return {
    overallReadinessRounded: result.overallReadinessRounded,
    classification: result.classification,
    classificationDisclaimer: CLASSIFICATION_DISCLAIMER,
    dataConfidenceLevel: result.dataConfidence.level,
    categoryScores: roundedCategoryScores,
    primaryConstraint: {
      ...primaryContent,
      key: result.constraintDiagnosis.primary.constraintKey,
      categoryKey: result.constraintDiagnosis.primary.categoryKey,
    },
    secondaryConstraint: {
      ...secondaryContent,
      key: result.constraintDiagnosis.secondary.constraintKey,
      categoryKey: result.constraintDiagnosis.secondary.categoryKey,
    },
    interconnectedConstraints: result.constraintDiagnosis.interconnected,
    strengths: buildStrengths(result.categoryScores),
    priorities: buildPriorities(result),
    risks: buildRisks(result),
    ctaVariant: result.ctaVariant,
    financialOutputs: result.financialOutputs,
  };
}
