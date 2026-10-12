import { useState } from 'react';
import { PRIVACY_POLICY_URL, TERMS_URL } from '../diagnostic/links';
import { readAttribution } from './attribution';
import { AUDIT_URL, trackAuditCtaClick } from '../components/CTA';

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
      <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-carbon/45">
        Free Revenue Leak Calculator &middot; For service businesses already running paid ads
      </p>
      <h1 className="mt-4 font-display text-[30px] font-extrabold leading-[1.08] tracking-tight text-carbon sm:text-[40px]">
        How many more customers could you get from the leads you already pay for?
      </h1>
      <p className="mt-5 text-[17px] font-semibold leading-snug text-carbon">
        Your ads bring in enquiries. How many make it all the way to becoming customers?
      </p>
      <p className="mt-3 text-[16px] leading-relaxed text-carbon/70">
        Enter seven numbers to see where prospects drop out&mdash;and estimate the extra customers and revenue better
        conversion could generate from the same ad spend.
      </p>

      <p className="mt-6 text-[14px] font-semibold text-carbon">See:</p>
      <ul className="mt-2.5 space-y-2.5">
        {[
          'How your leads move from enquiry to booked call to customer.',
          'Which stage offers the biggest estimated revenue opportunity.',
          'What improving conversion could mean for your monthly revenue—without buying more leads.',
        ].map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-carbon/75">
            <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 bg-signal" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

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
              Email address <span className="text-signal">*</span>
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
              Send me practical breakdowns on getting more customers from paid ads.&nbsp;
              <span className="text-signal">*</span>
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
          {submitting ? 'Opening…' : 'Open My Free Calculator'}
        </button>

        <p className="mt-5 text-[12px] leading-relaxed text-carbon/45">
          The calculator opens on this page. No download or call required. Results are estimates based on your figures
          and the assumptions shown. By continuing you agree to our{' '}
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

      <section className="mt-12 border-t border-carbon/10 pt-8">
        <h2 className="font-display text-[20px] font-bold leading-snug tracking-tight text-carbon">
          Want help getting more from your current ad spend?
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-carbon/70">
          Book a free call to review your advertising and lead-to-sale process, explore potential improvements, and
          see whether AI Video Systems is a fit for your business.
        </p>
        <a
          href={AUDIT_URL}
          target="_blank"
          rel="noopener"
          onClick={() => trackAuditCtaClick('revenue-leak-optin')}
          className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-bold uppercase tracking-wider text-signal underline-offset-4 hover:text-action hover:underline"
        >
          Book A Free Call <span aria-hidden="true">&rarr;</span>
        </a>
        <p className="mt-4 font-mono text-[11.5px] text-carbon/45">For service businesses currently running paid ads.</p>
      </section>
    </div>
  );
}
