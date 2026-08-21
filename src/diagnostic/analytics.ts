// Minimal first-party analytics adapter for the diagnostic.
// Never pass names, emails, phone numbers, financial values, raw answer text or result tokens here —
// only the event name and the safe props listed per call-site below.

type DiagnosticEvent =
  // Page gate — shown before anything else on /funeral-plan-scale-readiness.
  | 'diagnostic_gate_viewed'
  | 'diagnostic_gate_completed'
  | 'diagnostic_landing_view'
  | 'diagnostic_started'
  | 'diagnostic_context_completed'
  | 'diagnostic_section_viewed'
  | 'diagnostic_section_completed'
  | 'diagnostic_abandoned'
  | 'diagnostic_results_gate_viewed'
  | 'diagnostic_submitted'
  | 'diagnostic_results_viewed'
  | 'diagnostic_email_status'
  | 'diagnostic_cta_viewed'
  | 'diagnostic_cta_clicked'
  | 'diagnostic_analysis_requested';

export interface DiagnosticEventProps {
  section_key?: string;
  classification?: string;
  constraint_key?: string;
  status?: string;
  cta_variant?: string;
  partner_slug?: string;
  utm_source?: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: DiagnosticEvent, props: DiagnosticEventProps = {}): void {
  try {
    if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...props });
    }
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[diagnostic analytics]', event, props);
    }
  } catch {
    // analytics must never break the diagnostic experience
  }
}
