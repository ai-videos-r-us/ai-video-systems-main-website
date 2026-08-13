import type { CategoryKey, ConstraintKey } from './types.js';

export interface ConstraintContent {
  key: ConstraintKey;
  name: string;
  diagnosis: string;
  whyDangerous: string;
  immediateAction: string;
  primaryKpi: string;
  proofBeforeScaling: string;
}

export const CONSTRAINT_CONTENT: Record<ConstraintKey, ConstraintContent> = {
  acquisition_ceiling: {
    key: 'acquisition_ceiling',
    name: 'Acquisition Ceiling',
    diagnosis:
      'Your current acquisition economics have not yet proved that additional spend will produce proportional additional plan sales. The business may be able to buy more enquiries, but the evidence does not yet show that CPL, CAC and contribution will remain commercially acceptable at the next spend level.',
    whyDangerous:
      'A small deterioration in CPL or lead-to-plan conversion becomes expensive when applied to a much larger budget.',
    immediateAction:
      'Define maximum allowable CAC from contribution economics, then test budget increases in controlled stages rather than making one large jump.',
    primaryKpi: 'Cost per completed plan and contribution after acquisition by cohort.',
    proofBeforeScaling:
      'At least two controlled budget increases with validated downstream plan-sale economics and no unresolved capacity issue.',
  },
  creative_channel_fragility: {
    key: 'creative_channel_fragility',
    name: 'Creative/Channel Fragility',
    diagnosis:
      'Too much acquisition depends on a small number of adverts, messages, channels or suppliers. Performance could deteriorate quickly if a winning asset fatigues or the dominant channel becomes more expensive or restricted.',
    whyDangerous: 'Increasing spend accelerates creative fatigue and increases exposure to a single point of failure.',
    immediateAction:
      'Build a rolling research, production and testing pipeline with tested replacements before pushing the control harder.',
    primaryKpi: 'Percentage of acquisition contributed by the top two adverts and the top channel, alongside creative replacement cadence.',
    proofBeforeScaling: 'Several viable creatives and at least one additional dependable demand source or owned follow-up asset.',
  },
  buyer_trust_readiness_gap: {
    key: 'buyer_trust_readiness_gap',
    name: 'Buyer Trust and Readiness Gap',
    diagnosis:
      'Too many prospects arrive unfamiliar, poorly informed or unsure why the company is contacting them. The adviser must create recognition, education and trust from the beginning of the call.',
    whyDangerous:
      'More cold enquiries create more missed calls, denial of enquiry, repeated objections and pressure on advisers without necessarily producing more qualified conversations.',
    immediateAction:
      'Align the advert, lead form, confirmation, immediate acknowledgement and pre-call education so prospects remember the message and expect the conversation.',
    primaryKpi: 'Percentage of the last 20 enquiries who remember the source message, expect contact and progress to a meaningful conversation.',
    proofBeforeScaling: 'A stable improvement in recognition, contact and qualification by source — not simply a lower CPL.',
  },
  lead_handling_leakage: {
    key: 'lead_handling_leakage',
    name: 'Lead-Handling Leakage',
    diagnosis:
      'The business is generating demand, but value is being lost between enquiry, ownership, first contact, quote, follow-up and completed plan sale.',
    whyDangerous:
      'Additional volume reaches the same inconsistent process, creating a larger backlog and more paid enquiries without clear outcomes.',
    immediateAction:
      'Establish immediate acknowledgement, clear ownership, response-time standards, defined stages, escalation and structured long-term follow-up.',
    primaryKpi: 'Contact rate, time to first human attempt, quote rate and completed plan rate by acquisition source.',
    proofBeforeScaling: 'Consistent service-level compliance and complete outcomes across recent lead cohorts.',
  },
  dormant_enquiry_opportunity: {
    key: 'dormant_enquiry_opportunity',
    name: 'Dormant-Enquiry Opportunity',
    diagnosis:
      'The company has already paid to acquire people who did not buy during the initial sales period, but older enquiries are not being segmented, nurtured, reactivated or measured systematically.',
    whyDangerous:
      'The business repeatedly pays for new attention while allowing previously acquired demand to lose visibility and value.',
    immediateAction:
      'Quantify the aged database by status and age, confirm consent and eligibility, segment it and build relevant long-term follow-up with measurable outcomes.',
    primaryKpi: 'Completed plan sales, contribution and response generated from eligible reactivated segments.',
    proofBeforeScaling: 'Reliable aged counts, a structured nurture/reactivation process and attributable outcomes.',
  },
  revenue_blind_spot: {
    key: 'revenue_blind_spot',
    name: 'Revenue Blind Spot',
    diagnosis:
      'The business cannot reliably connect acquisition activity to completed plan sales and commercial return. Platform lead metrics and CRM outcomes are operating as different versions of the truth.',
    whyDangerous:
      'More budget is allocated using incomplete evidence, so apparently cheap campaigns may receive spend without proving customer value.',
    immediateAction:
      'Standardise source data, CRM stages and completed-sale outcomes, then reconcile them in cohort-based reporting.',
    primaryKpi: 'Percentage of completed plan sales attributable to channel, campaign and advert, plus dependable CAC.',
    proofBeforeScaling: 'The majority of plan sales can be reconciled to acquisition source and delayed conversions are included.',
  },
  capacity_founder_bottleneck: {
    key: 'capacity_founder_bottleneck',
    name: 'Capacity/Founder Bottleneck',
    diagnosis:
      "Growth relies too heavily on limited adviser capacity, individual behaviour or the founder's direct involvement. The current operation may work at today's volume but is not independently prepared for a material increase.",
    whyDangerous: 'More enquiries create slower response, inconsistent handling, management intervention and service deterioration.',
    immediateAction:
      'Model capacity, document ownership and service standards, assign operational responsibility and build adviser-level visibility before increasing volume.',
    primaryKpi: 'Lead load, response-time compliance, contact, quote and conversion by adviser.',
    proofBeforeScaling: 'The operation can handle a controlled volume increase while maintaining service levels without founder intervention.',
  },
};

export const STRENGTH_CONTENT: Record<CategoryKey, string> = {
  acquisition:
    'You already use downstream commercial evidence rather than lead volume alone to guide acquisition decisions. This supports controlled growth — but it does not cancel out a separate weak constraint elsewhere.',
  resilience:
    'Your acquisition is less exposed to a single advert or source than many founder-led operations. This gives you more room to scale demand without a single point of failure — but it does not cancel out a separate weak constraint elsewhere.',
  readiness:
    'Prospects generally understand the enquiry and arrive better prepared for an adviser conversation. That makes each conversation more efficient to run at higher volume — but it does not cancel out a separate weak constraint elsewhere.',
  performance:
    'Ownership, response and follow-up are sufficiently structured to preserve more of the demand you generate. That structure should hold under additional volume — but it does not cancel out a separate weak constraint elsewhere.',
  existing:
    'Previously acquired enquiries remain an owned commercial asset rather than disappearing after the initial sales period. That is a genuine source of low-cost additional plan sales — but it does not cancel out a separate weak constraint elsewhere.',
  visibility:
    'Your reporting gives leadership a clearer link between acquisition decisions and completed plan sales. That evidence should make scaling decisions safer — but it does not cancel out a separate weak constraint elsewhere.',
  capacity:
    'The operation has a stronger chance of absorbing growth without depending on constant founder intervention. That independence matters most at higher volume — but it does not cancel out a separate weak constraint elsewhere.',
};

export const RISK_WARNINGS: Record<string, string> = {
  cpl_alone: 'Do not scale based on CPL alone.',
  adviser_capacity: 'Do not double volume before confirming adviser capacity.',
  uncontacted_leads: 'Do not treat uncontacted leads as proof of poor targeting.',
  abandon_older_enquiries: 'Do not abandon older enquiries solely because they did not buy immediately.',
  single_winning_advert: 'Do not rely on a single winning advert without tested replacements.',
  attribution_reconciliation: 'Do not trust attribution that cannot reconcile with completed plan sales.',
  roi_unlinked_sales: 'Do not publish an ROI scenario based on sales that cannot be linked to the acquisition cohort.',
  automated_followup_ownership: 'Do not automate follow-up without clear ownership, consent and outcome stages.',
};

export const CLASSIFICATION_DISCLAIMER =
  'These classifications indicate operational readiness, not guaranteed financial performance.';

export const FINANCIAL_DISCLAIMER =
  'These figures are an illustrative scenario based on the information you provided. They are not a forecast, a projection, a guarantee, or financial advice.';

export const LOW_CONFIDENCE_MESSAGE =
  'Before deciding whether to scale, improve the visibility required to judge the decision.';

export const SUPPRESSED_FINANCIAL_MESSAGE =
  'We could not responsibly calculate this opportunity from the information available. The missing figures are themselves part of your Revenue Visibility constraint.';
