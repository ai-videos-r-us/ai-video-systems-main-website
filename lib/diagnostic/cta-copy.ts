import type { CtaVariant } from './types.js';

export const DIAGNOSTIC_ANALYSIS_URL_LABEL = 'Request a Deeper 90-Day Lead-to-Plan Analysis';

export interface CtaContent {
  variant: CtaVariant;
  heading: string;
  body: string;
  buttonLabel: string;
  showsBookingAction: boolean;
}

export const CTA_CONTENT: Record<CtaVariant, CtaContent> = {
  primary_deeper_analysis: {
    variant: 'primary_deeper_analysis',
    heading: DIAGNOSTIC_ANALYSIS_URL_LABEL,
    body: 'If you would like us to validate this diagnosis against actual data, we can examine 90 days of acquisition and CRM performance to show where enquiries are being won, lost and converted into completed plan sales.',
    buttonLabel: 'Request the analysis',
    showsBookingAction: true,
  },
  result_review_checklist: {
    variant: 'result_review_checklist',
    heading: 'Request a short result review',
    body: 'Tell us a little more about your priority constraint and we will send a short implementation checklist tailored to your result — no calendar booking required.',
    buttonLabel: 'Request my result review',
    showsBookingAction: false,
  },
  tailored_action_plan: {
    variant: 'tailored_action_plan',
    heading: 'Get your tailored action plan',
    body: 'Based on your result, the most useful next step is a focused action plan for your primary constraint. We will send relevant guidance rather than pushing you toward a call before you are ready.',
    buttonLabel: 'Send me the action plan',
    showsBookingAction: false,
  },
  benchmarking_reassessment: {
    variant: 'benchmarking_reassessment',
    heading: 'Benchmark your progress',
    body: 'Your operation looks well set up for its current scale. It can be useful to re-run this diagnostic in 90 days, or benchmark your controlled-growth readiness against the market.',
    buttonLabel: 'Remind me to reassess in 90 days',
    showsBookingAction: false,
  },
  resources_only: {
    variant: 'resources_only',
    heading: 'Your result and relevant resources',
    body: 'Your full result is below. We have kept this to the diagnostic itself — no further follow-up is required unless you would like it.',
    buttonLabel: '',
    showsBookingAction: false,
  },
};
