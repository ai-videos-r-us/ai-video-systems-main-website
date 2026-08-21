import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FuneralDiagnosticLanding from './FuneralDiagnosticLanding';
import FuneralLeadGate from './FuneralLeadGate';
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
type Access = 'checking' | 'gated' | 'unlocked';

const TOKEN_KEY = 'avs.funeralDiagnostic.token';
const NAME_KEY = 'avs.funeralDiagnostic.name';
const EMAIL_KEY = 'avs.funeralDiagnostic.email';

interface SubmitResponse {
  resultToken: string;
  resultUrl: string;
  emailStatus: 'sent' | 'failed';
  result: PublicResult;
  ctaUrl?: string;
}

export default function FuneralDiagnosticPage() {
  const [searchParams] = useSearchParams();
  const [access, setAccess] = useState<Access>('checking');
  const [gateFirstName, setGateFirstName] = useState<string>('');
  const [gateEmail, setGateEmail] = useState<string>('');
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
    'Free diagnostic for funeral plan providers, funeral groups and funeral directors: find out what you really pay per lead and per plan sold, how much of your lead spend goes on enquiries that were never going to buy, and what that is leaving on the table every month.'
  );

  // The page is gated: nothing but the capture form renders until the server confirms a
  // signed token issued by the gate. Editing sessionStorage does not open it — the token is
  // HMAC-signed server-side and revalidated on every load.
  useEffect(() => {
    let cancelled = false;
    let token: string | null = null;
    try {
      token = sessionStorage.getItem(TOKEN_KEY);
    } catch {
      // Storage unavailable (private browsing) — the visitor simply re-enters details.
    }

    if (!token) {
      setAccess('gated');
      return;
    }

    (async () => {
      try {
        const response = await fetch('/api/leads/verify-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: token }),
        });
        const data = (await response.json().catch(() => null)) as { valid?: boolean } | null;
        if (cancelled) return;

        if (response.ok && data?.valid) {
          try {
            setGateFirstName(sessionStorage.getItem(NAME_KEY) ?? '');
            setGateEmail(sessionStorage.getItem(EMAIL_KEY) ?? '');
          } catch {
            /* non-fatal */
          }
          setAccess('unlocked');
        } else {
          clearStoredAccess();
          setAccess('gated');
        }
      } catch {
        // Cannot reach the server to confirm — fail closed rather than open.
        if (!cancelled) setAccess('gated');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function clearStoredAccess() {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(NAME_KEY);
      sessionStorage.removeItem(EMAIL_KEY);
    } catch {
      /* non-fatal */
    }
  }

  function handleUnlock(name: string, email: string, accessToken: string) {
    try {
      sessionStorage.setItem(TOKEN_KEY, accessToken);
      sessionStorage.setItem(NAME_KEY, name);
      sessionStorage.setItem(EMAIL_KEY, email);
    } catch {
      // Non-fatal: this session still unlocks, it just will not survive a refresh.
    }
    setGateFirstName(name);
    setGateEmail(email);
    setAccess('unlocked');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

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

  if (access !== 'unlocked') {
    return (
      <div className="bg-white">
        <DiagnosticHeader showExit={false} />
        {access === 'checking' ? (
          <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-carbon/40">Checking access…</p>
          </div>
        ) : (
          <FuneralLeadGate onUnlock={handleUnlock} />
        )}
      </div>
    );
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
          firstName={gateFirstName || undefined}
        />
      )}

      {view === 'wizard' && (
        <DiagnosticWizard
          draft={draft}
          onFinalSubmit={handleFinalSubmit}
          submitting={submitting}
          submitError={submitError}
          contactDefaults={{ firstName: gateFirstName, workEmail: gateEmail }}
        />
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
