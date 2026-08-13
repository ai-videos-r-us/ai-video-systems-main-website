import type { ContextQuestion, TriggerOption } from './types';

// CTX1–CTX11: single-select commercial-context questions.
// These personalise the result and drive hidden Fit/Need — they never change the public Readiness Score.

export const CTX1_BUSINESS_TYPE: ContextQuestion = {
  id: 'ctx1',
  prompt: 'What type of business are you?',
  options: [
    { id: 'funeral_plan_provider', label: 'Funeral-plan provider' },
    { id: 'funeral_group', label: 'Funeral group selling plans' },
    { id: 'independent_fd', label: 'Independent funeral director selling plans' },
    { id: 'broker_distributor', label: 'Broker, distributor or intermediary' },
    { id: 'other_funeral_business', label: 'Other funeral-sector business' },
  ],
};

export const CTX2_ROLE: ContextQuestion = {
  id: 'ctx2',
  prompt: 'What is your role?',
  options: [
    { id: 'founder_owner_ceo_md', label: 'Founder, owner, chief executive or managing director' },
    { id: 'commercial_marketing_sales_director', label: 'Commercial, marketing or sales director' },
    { id: 'marketing_acquisition_manager', label: 'Marketing or acquisition manager' },
    { id: 'sales_manager', label: 'Sales manager' },
    { id: 'adviser_operational', label: 'Adviser or operational team member' },
    { id: 'external_consultant', label: 'External consultant or supplier' },
    { id: 'other_role', label: 'Other' },
  ],
};

export const CTX3_DECISION_AUTHORITY: ContextQuestion = {
  id: 'ctx3',
  prompt: 'What is your authority over the relevant acquisition budget?',
  options: [
    { id: 'final_authority', label: 'I have final authority over the relevant budget', fitPoints: 10 },
    { id: 'share_decision', label: 'I share the final decision', fitPoints: 7 },
    { id: 'research_recommend', label: 'I research and recommend the decision', fitPoints: 4 },
    { id: 'not_involved', label: 'I am not involved in the decision', fitPoints: 0 },
  ],
};

export const CTX4_MARKET: ContextQuestion = {
  id: 'ctx4',
  prompt: 'What is your primary operating market?',
  options: [
    { id: 'uk', label: 'United Kingdom' },
    { id: 'spain', label: 'Spain' },
    { id: 'other_europe', label: 'Other European market' },
    { id: 'multiple_markets', label: 'Multiple markets' },
    { id: 'other_market', label: 'Other' },
  ],
};

export const CTX5_SPEND: ContextQuestion = {
  id: 'ctx5',
  prompt: 'Approximately what is your monthly paid-acquisition spend?',
  options: [
    { id: 'spend_none', label: 'None', fitPoints: 0 },
    { id: 'spend_lt_2000', label: 'Less than £2,000', fitPoints: 4 },
    { id: 'spend_2000_4999', label: '£2,000–£4,999', fitPoints: 8 },
    { id: 'spend_5000_9999', label: '£5,000–£9,999', fitPoints: 15 },
    { id: 'spend_10000_19999', label: '£10,000–£19,999', fitPoints: 22 },
    { id: 'spend_20000_plus', label: '£20,000 or more', fitPoints: 25 },
    { id: 'spend_not_sure', label: 'Not sure', fitPoints: 0, uncertaintyFlag: true },
  ],
};

export const CTX6_ENQUIRY_VOLUME: ContextQuestion = {
  id: 'ctx6',
  prompt: 'Approximately what is your monthly paid enquiry volume?',
  options: [
    { id: 'enq_lt_25', label: 'Fewer than 25', fitPoints: 0 },
    { id: 'enq_25_99', label: '25–99', fitPoints: 4 },
    { id: 'enq_100_249', label: '100–249', fitPoints: 8 },
    { id: 'enq_250_499', label: '250–499', fitPoints: 12 },
    { id: 'enq_500_plus', label: '500 or more', fitPoints: 15 },
    { id: 'enq_not_sure', label: 'Not sure', fitPoints: 0, uncertaintyFlag: true },
  ],
};

export const CTX7_ECONOMICS_MATURITY: ContextQuestion = {
  id: 'ctx7',
  prompt: 'What is your current plan-sale/economics maturity?',
  options: [
    { id: 'econ_none', label: 'No proven plan sales yet', fitPoints: 0 },
    { id: 'econ_occasional', label: 'Occasional sales with little dependable data', fitPoints: 4 },
    { id: 'econ_consistent_limited_cac', label: 'Consistent sales but limited CAC visibility', fitPoints: 8 },
    { id: 'econ_consistent_known_cac', label: 'Consistent sales with broadly known CAC', fitPoints: 12 },
    {
      id: 'econ_proven_contribution',
      label: 'Proven contribution economics with reliable reporting',
      fitPoints: 15,
    },
    { id: 'econ_not_sure', label: 'Not sure', fitPoints: 0, uncertaintyFlag: true },
  ],
};

export const CTX8_CAPACITY: ContextQuestion = {
  id: 'ctx8',
  prompt: 'What is your adviser/sales capacity?',
  options: [
    { id: 'cap_founder_alone', label: 'Founder working alone', fitPoints: 0 },
    { id: 'cap_one_adviser', label: 'One adviser or seller', fitPoints: 3 },
    { id: 'cap_two_to_three', label: 'Two to three advisers/sellers', fitPoints: 6 },
    { id: 'cap_four_plus_spare', label: 'Four or more with spare capacity', fitPoints: 10 },
    { id: 'cap_four_plus_near_capacity', label: 'Four or more but already near capacity', fitPoints: 6 },
    { id: 'cap_not_sure', label: 'Not sure', fitPoints: 0, uncertaintyFlag: true },
  ],
};

export const CTX9_CRM: ContextQuestion = {
  id: 'ctx9',
  prompt: 'What is your CRM/data infrastructure?',
  options: [
    { id: 'crm_none', label: 'No CRM', fitPoints: 0 },
    { id: 'crm_unreliable', label: 'CRM exists but data is unreliable', fitPoints: 3 },
    { id: 'crm_partial_outcome', label: 'Useful CRM with partial outcome data', fitPoints: 6 },
    { id: 'crm_dependable_exportable', label: 'Dependable outcomes and exportable data', fitPoints: 10 },
    { id: 'crm_not_sure', label: 'Not sure', fitPoints: 0, uncertaintyFlag: true },
  ],
};

export const CTX10_TIMING: ContextQuestion = {
  id: 'ctx10',
  prompt: 'When are you looking to grow acquisition?',
  options: [
    { id: 'timing_now_90_days', label: 'Now or within 90 days', fitPoints: 10, urgency: 100 },
    { id: 'timing_3_6_months', label: 'Within three to six months', fitPoints: 7, urgency: 75 },
    { id: 'timing_6_12_months', label: 'Within six to twelve months', fitPoints: 5, urgency: 50 },
    { id: 'timing_gt_12_months', label: 'More than twelve months away', fitPoints: 2, urgency: 25 },
    { id: 'timing_no_intention', label: 'No current intention to grow acquisition materially', fitPoints: 0, urgency: 0 },
  ],
};

export const CTX11_DATA_SHARING: ContextQuestion = {
  id: 'ctx11',
  prompt:
    'If a deeper review identified a meaningful opportunity, could your business provide approximately 90 days of acquisition and CRM data and support a structured implementation?',
  options: [
    { id: 'data_sharing_yes', label: 'Yes', fitPoints: 5 },
    { id: 'data_sharing_possibly', label: 'Possibly; this would require internal approval', fitPoints: 2 },
    { id: 'data_sharing_no', label: 'No', fitPoints: 0 },
  ],
};

export const CTX12_TRIGGERS: TriggerOption[] = [
  {
    id: 'trigger_cpl_cac_deteriorated',
    label: 'We increased spend and CPL or CAC materially deteriorated',
    severity: 100,
    constraintKeys: ['acquisition_ceiling'],
  },
  {
    id: 'trigger_volume_no_sales_rise',
    label: 'Enquiry volume increased without a proportional rise in plan sales',
    severity: 100,
    constraintKeys: ['lead_handling_leakage'],
  },
  {
    id: 'trigger_dormant_database',
    label: 'We have a large or growing database of older unconverted enquiries',
    severity: 80,
    constraintKeys: ['dormant_enquiry_opportunity'],
  },
  {
    id: 'trigger_cannot_identify_campaigns',
    label: 'We cannot clearly identify which campaigns generated completed plan sales',
    severity: 80,
    constraintKeys: ['revenue_blind_spot'],
  },
  {
    id: 'trigger_poor_quality_leads',
    label: 'The sales team is reporting poor-quality or uncontactable leads',
    severity: 75,
    // Resolved dynamically between buyer_trust_readiness_gap and lead_handling_leakage
    // based on which category scores lower — see scoring.ts resolvePoorQualityLeadsTrigger.
    constraintKeys: ['buyer_trust_readiness_gap', 'lead_handling_leakage'],
  },
  {
    id: 'trigger_creative_deteriorating',
    label: 'Our strongest advert or creative is deteriorating',
    severity: 70,
    constraintKeys: ['creative_channel_fragility'],
  },
  {
    id: 'trigger_hiring_expansion',
    label: 'We are hiring advisers, entering a new market, launching another plan/brand or expanding',
    severity: 70,
    constraintKeys: ['capacity_founder_bottleneck'],
  },
  {
    id: 'trigger_founder_ceiling',
    label: 'The founder has reached their own marketing ceiling or needs to step away from day-to-day acquisition',
    severity: 60,
    constraintKeys: ['capacity_founder_bottleneck'],
  },
  {
    id: 'trigger_none',
    label: 'None of these',
    severity: 0,
    constraintKeys: [],
    exclusive: true,
  },
];

export const CTX12_TRIGGERS_QUESTION: ContextQuestion = {
  id: 'ctx12',
  prompt: 'Have any of these happened recently?',
  helpText: 'Select all that apply.',
  multiSelect: true,
  options: CTX12_TRIGGERS,
};

export const CONTEXT_QUESTIONS: ContextQuestion[] = [
  CTX1_BUSINESS_TYPE,
  CTX2_ROLE,
  CTX3_DECISION_AUTHORITY,
  CTX4_MARKET,
  CTX5_SPEND,
  CTX6_ENQUIRY_VOLUME,
  CTX7_ECONOMICS_MATURITY,
  CTX8_CAPACITY,
  CTX9_CRM,
  CTX10_TIMING,
  CTX11_DATA_SHARING,
  CTX12_TRIGGERS_QUESTION,
];
