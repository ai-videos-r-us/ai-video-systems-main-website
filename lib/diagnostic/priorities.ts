import { CONSTRAINT_CONTENT, RISK_WARNINGS } from './content.js';
import type { ConstraintKey } from './types.js';
import type { FullScoringResult } from './scoring.js';

export interface Priority {
  order: 1 | 2 | 3;
  action: string;
  reason: string;
  kpi: string;
  timeHorizon: string;
  exitCriterion: string;
}

/** Exactly three ordered priorities, generated from approved deterministic content blocks. */
export function buildPriorities(scoring: FullScoringResult): Priority[] {
  const primary = CONSTRAINT_CONTENT[scoring.constraintDiagnosis.primary.constraintKey];

  return [
    {
      order: 1,
      action: `Fix your primary constraint: ${primary.name}`,
      reason: primary.immediateAction,
      kpi: primary.primaryKpi,
      timeHorizon: '0–30 days',
      exitCriterion: 'The immediate action above is in place and the primary KPI is being tracked weekly.',
    },
    {
      order: 2,
      action: `Install or repair the measurement needed to verify the change: ${primary.primaryKpi}`,
      reason:
        'You cannot safely judge whether the fix above is working without reliable, trustworthy measurement in this area.',
      kpi: primary.primaryKpi,
      timeHorizon: '30–60 days',
      exitCriterion: 'Reporting on this KPI is trusted enough to make a scale / no-scale decision from it.',
    },
    {
      order: 3,
      action: 'Run a controlled scaling test once the guardrail above is achieved',
      reason: 'Validates the fix at low risk before committing full acquisition budget behind it.',
      kpi: 'Performance of the controlled test cohort against the guardrail threshold',
      timeHorizon: '60–90 days',
      exitCriterion: primary.proofBeforeScaling,
    },
  ];
}

const CONSTRAINT_TO_RISK_KEY: Record<ConstraintKey, keyof typeof RISK_WARNINGS> = {
  acquisition_ceiling: 'cpl_alone',
  creative_channel_fragility: 'single_winning_advert',
  buyer_trust_readiness_gap: 'uncontacted_leads',
  lead_handling_leakage: 'automated_followup_ownership',
  dormant_enquiry_opportunity: 'abandon_older_enquiries',
  revenue_blind_spot: 'attribution_reconciliation',
  capacity_founder_bottleneck: 'adviser_capacity',
};

/** Exactly three risk warnings, most relevant to this result first. */
export function buildRisks(scoring: FullScoringResult): string[] {
  const candidateKeys: (keyof typeof RISK_WARNINGS)[] = [];

  candidateKeys.push(CONSTRAINT_TO_RISK_KEY[scoring.constraintDiagnosis.primary.constraintKey]);
  candidateKeys.push(CONSTRAINT_TO_RISK_KEY[scoring.constraintDiagnosis.secondary.constraintKey]);

  if (scoring.financialOutputs.acquisitionScenario.suppressed) {
    candidateKeys.push('roi_unlinked_sales');
  }

  // Deterministic fallback pool for the remaining slots.
  candidateKeys.push('cpl_alone', 'adviser_capacity', 'attribution_reconciliation');

  const unique: string[] = [];
  for (const key of candidateKeys) {
    const text = RISK_WARNINGS[key];
    if (text && !unique.includes(text)) unique.push(text);
    if (unique.length === 3) break;
  }
  return unique;
}
