import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FuneralDiagnosticLanding from './FuneralDiagnosticLanding';
import DiagnosticWizard from './DiagnosticWizard';
import DraftResumeBanner from './components/DraftResumeBanner';
import ResultsView from './components/ResultsView';
import DiagnosticHeader from './components/DiagnosticHeader';
import { useDiagnosticDraft } from './state';
import { getPartnerBySlug } from '../../lib/diagnostic/partners';
import type { ConsentValues, ContactFormValues } from './components/ContactGateForm';
import type { PublicResult } from '../../lib/diagnostic/serialize';
import { track } from './analytics';
import useDocumentMeta from '../hooks/useDocumentMeta';

type View = 'landing' | 'wizard' | 'results';

interface SubmitResponse {
  resultToken: string;
  resultUrl: string;
  emailStatus: 'sent' | 'failed';
  result: PublicResult;
  ctaUrl?: string;
}

export default function FuneralDiagnosticPage() {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<View>('landing');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [firstName, setFirstName] = useState<string>('');

  const draft = useDiagnosticDraft();
  const partnerSlug = searchParams.get('partner');
  const partner = getPartnerBySlug(partnerSlug);

  useDocumentMeta(
    'Funeral Plan Scale Readiness Diagnostic | AI Video Systems',
    'Free diagnostic for funeral plan providers, funeral groups and funeral directors: find out whether your business could profitably handle another £10,000 a month in customer acquisition, and what would be most likely to break first.'
  );

  async function handleFinalSubmit(contact: ContactFormValues, consents: ConsentValues) {
    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      idempotencyKey: draft.state.idempotencyKey,
      scoredAnswers: draft.state.scoredAnswers,
      context: draft.state.context,
      financial: draft.state.financial,
      contact: {
        firstName: contact.firstName,
        surname: contact.surname,
        company: contact.company,
        workEmail: contact.workEmail,
        phone: contact.phone || undefined,
      },
      consents,
      attribution: {
        partnerSlug: partner?.slug,
        utmSource: searchParams.get('utm_source') ?? undefined,
        utmMedium: searchParams.get('utm_medium') ?? undefined,
        utmCampaign: searchParams.get('utm_campaign') ?? undefined,
        utmTerm: searchParams.get('utm_term') ?? undefined,
        utmContent: searchParams.get('utm_content') ?? undefined,
        referrer: document.referrer || undefined,
      },
    };

    try {
      track('diagnostic_submitted');
      const res = await fetch('/api/diagnostic/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.category ?? 'submit_failed');
      }

      const data: SubmitResponse = await res.json();
      setSubmitResult(data);
      setFirstName(contact.firstName);
      track('diagnostic_email_status', { status: data.emailStatus });
      draft.resetAfterSubmit();
      setView('results');
    } catch {
      setSubmitError('Something went wrong calculating your result. Please try again — your answers are saved.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white">
      <DiagnosticHeader showExit={view !== 'landing'} />

      {draft.resumeOffered && view === 'landing' && (
        <DraftResumeBanner
          onResume={() => {
            draft.resumeDraft();
            setView('wizard');
          }}
          onDiscard={draft.discardDraft}
        />
      )}

      {view === 'landing' && (
        <FuneralDiagnosticLanding
          onStart={() => setView('wizard')}
          partnerName={partner?.displayName}
        />
      )}

      {view === 'wizard' && (
        <DiagnosticWizard draft={draft} onFinalSubmit={handleFinalSubmit} submitting={submitting} submitError={submitError} />
      )}

      {view === 'results' && submitResult && (
        <ResultsView
          firstName={firstName}
          result={submitResult.result}
          ctaUrl={submitResult.ctaUrl}
          resultUrl={submitResult.resultUrl}
          resultToken={submitResult.resultToken}
          emailStatus={submitResult.emailStatus}
        />
      )}
    </div>
  );
}
