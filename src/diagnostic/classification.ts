import { CLASSIFICATION_BANDS } from '../../lib/diagnostic/constants';
import type { ReadinessClassification } from '../../lib/diagnostic/types';

const COLOR_CLASS: Record<ReadinessClassification, string> = {
  not_scale_ready: 'text-score-critical',
  growth_constrained: 'text-score-constrained',
  conditionally_ready: 'text-score-conditional',
  scale_ready_with_guardrails: 'text-score-ready',
  highly_scale_ready: 'text-score-high',
};

const BG_CLASS: Record<ReadinessClassification, string> = {
  not_scale_ready: 'bg-score-critical',
  growth_constrained: 'bg-score-constrained',
  conditionally_ready: 'bg-score-conditional',
  scale_ready_with_guardrails: 'bg-score-ready',
  highly_scale_ready: 'bg-score-high',
};

export function classificationLabel(classification: ReadinessClassification): string {
  return CLASSIFICATION_BANDS.find((b) => b.key === classification)?.label ?? classification;
}

export function classificationMeaning(classification: ReadinessClassification): string {
  return CLASSIFICATION_BANDS.find((b) => b.key === classification)?.meaning ?? '';
}

export function classificationColorClass(classification: ReadinessClassification): string {
  return COLOR_CLASS[classification];
}

export function classificationBgClass(classification: ReadinessClassification): string {
  return BG_CLASS[classification];
}
