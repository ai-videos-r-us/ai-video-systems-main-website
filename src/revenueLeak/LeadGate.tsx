import { useState } from 'react';
import { PRIVACY_POLICY_URL, TERMS_URL } from '../diagnostic/links';
import { readAttribution } from './attribution';

interface LeadGateProps {
  onUnlock: (firstName: string, accessToken: string) => void;
}

const inputClass = (hasError: boolean) =>
  `h-12 w-full rounded-md border bg-white px-3.5 text-[15px] text-carbon outline-none transition-colors focus:border-signal ${
    hasError ? 'border-score-critical' : 'border-carbon/20'
  }`;

export default function LeadGate({ onUnlock }: LeadGateProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; email?: string; consent?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: { firstName?: string; email?: string; consent?: string } = {};
    if (!firstName.trim()) next.firstName = 'Enter your first name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!consent) next.consent = 'Please tick the box to continue.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/leads/revenue-leak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          marketingConsent: consent,
          source: 'revenue-leak-calculator',
          attribution: readAttribution(),
          company_website: honeypot,
        }),
      });

      if (response.status === 429) {
        setSubmitError('Too many attempts from this connection. Wait a minute and try again.');
        return;
      }

      const data = (await response.json().catch(() => null)) as { accessToken?: string } | null;

      // The server-signed token is the only thing that opens the calculator. No token,
      // no access — a failed request must never fall through to an unlock.
      if (!response.ok || !data?.accessToken) {
        setSubmitError('We could not confirm your details just then. Please try again.');
        return;
      }

      onUnlock(firstName.trim(), data.accessToken);
    } catch {
      setSubmitError('That did not go through — check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[560px] px-5 pb-24 pt-10 md:pt-16">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-carbon/45">
        AI Video Systems &middot; Diagnostic 01
      </p>
      <h1 className="mt-4 font-display text-[30px] font-extrabold leading-[1.08] tracking-tight text-carbon sm:text-[40px]">
        How much ad spend are you wasting?
      </h1>
      <p className="mt-4 text-[16px] leading-relaxed text-carbon/70">
        Calculate how many more customers you could get for the same ad spend.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-9 border-t border-carbon/10 pt-8">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="rl-first-name" className="block text-[13.5px] font-semibold text-carbon">
              First name <span className="text-signal">*</span>
            </label>
            <input
              id="rl-first-name"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`mt-1.5 ${inputClass(!!errors.firstName)}`}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && (
              <p role="alert" className="mt-1 text-[12.5px] text-score-critical">
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="rl-email" className="block text-[13.5px] font-semibold text-carbon">
              Email <span className="text-signal">*</span>
            </label>
            <input
              id="rl-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1.5 ${inputClass(!!errors.email)}`}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p role="alert" className="mt-1 text-[12.5px] text-score-critical">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Honeypot — visually and programmatically hidden from real users. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="company_website">Company website</label>
          <input
            id="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <label className="flex cursor-pointer items-start gap-3 text-[13.5px] text-carbon/75">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (e.target.checked) setErrors((prev) => ({ ...prev, consent: undefined }));
              }}
              aria-invalid={!!errors.consent}
              className={`mt-0.5 h-4 w-4 flex-shrink-0 accent-signal ${
                errors.consent ? 'outline outline-1 outline-offset-2 outline-score-critical' : ''
              }`}
            />
            <span>
              Send me occasional commercial breakdowns from AI Video
              Systems.&nbsp;<span className="text-signal">*</span>
            </span>
          </label>
          {errors.consent && (
            <p role="alert" className="mt-1.5 pl-7 text-[12.5px] text-score-critical">
              {errors.consent}
            </p>
          )}
        </div>

        {submitError && (
          <div
            role="alert"
            className="mt-6 rounded-md border border-score-critical/30 bg-score-critical/5 px-4 py-3 text-[13.5px] text-score-critical"
          >
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-7 inline-flex min-h-[48px] w-full items-center justify-center bg-signal px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-action disabled:cursor-not-allowed disabled:bg-carbon/30 sm:w-auto"
          style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
        >
          {submitting ? 'Opening…' : 'Learn More'}
        </button>

        <p className="mt-5 text-[12px] leading-relaxed text-carbon/45">
          No call, no download &mdash; the calculator opens on this page. By continuing you agree to our{' '}
          <a href={PRIVACY_POLICY_URL} className="underline hover:text-carbon">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href={TERMS_URL} className="underline hover:text-carbon">
            Terms
          </a>
          .
        </p>
      </form>
    </div>
  );
}
