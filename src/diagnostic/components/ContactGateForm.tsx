import { useEffect, useRef, useState } from 'react';
import { PRIVACY_POLICY_URL, TERMS_URL } from '../links';

export interface ContactFormValues {
  firstName: string;
  surname: string;
  company: string;
  workEmail: string;
  phone: string;
}

export interface ConsentValues {
  marketing: boolean;
  research: boolean;
}

interface ContactGateFormProps {
  onSubmit: (contact: ContactFormValues, consents: ConsentValues) => void;
  submitting: boolean;
  submitError?: string | null;
}

export default function ContactGateForm({ onSubmit, submitting, submitError }: ContactGateFormProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState<ContactFormValues>({
    firstName: '',
    surname: '',
    company: '',
    workEmail: '',
    phone: '',
  });
  const [consents, setConsents] = useState<ConsentValues>({ marketing: false, research: false });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  function validate(): boolean {
    const next: Partial<Record<keyof ContactFormValues, string>> = {};
    if (!values.firstName.trim()) next.firstName = 'Enter your first name.';
    if (!values.surname.trim()) next.surname = 'Enter your surname.';
    if (!values.company.trim()) next.company = 'Enter your company name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.workEmail.trim())) next.workEmail = 'Enter a valid work email address.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values, consents);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto w-full max-w-[560px] px-5 py-8 md:px-0">
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold text-carbon outline-none sm:text-3xl">
        Your results are ready
      </h2>
      <p className="mt-2 text-[15px] text-carbon/65">Where should we send your full Scale Readiness breakdown?</p>

      {errors && Object.keys(errors).length > 0 && (
        <div role="alert" aria-live="assertive" className="mt-5 rounded-md border border-score-critical/30 bg-score-critical/5 px-4 py-3 text-[13.5px] text-score-critical">
          Please fix the highlighted fields below.
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name" error={errors.firstName} required>
          <input
            type="text"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(e) => setValues((v) => ({ ...v, firstName: e.target.value }))}
            className={inputClass(!!errors.firstName)}
          />
        </Field>
        <Field label="Surname" error={errors.surname} required>
          <input
            type="text"
            autoComplete="family-name"
            value={values.surname}
            onChange={(e) => setValues((v) => ({ ...v, surname: e.target.value }))}
            className={inputClass(!!errors.surname)}
          />
        </Field>
        <Field label="Company" error={errors.company} required className="sm:col-span-2">
          <input
            type="text"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))}
            className={inputClass(!!errors.company)}
          />
        </Field>
        <Field label="Work email" error={errors.workEmail} required className="sm:col-span-2">
          <input
            type="email"
            autoComplete="email"
            value={values.workEmail}
            onChange={(e) => setValues((v) => ({ ...v, workEmail: e.target.value }))}
            className={inputClass(!!errors.workEmail)}
          />
        </Field>
        <Field label="Telephone" className="sm:col-span-2">
          <input
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            className={inputClass(false)}
          />
        </Field>
      </div>

      <div className="mt-6 space-y-3 border-t border-carbon/10 pt-5">
        <label className="flex cursor-pointer items-start gap-3 text-[13.5px] text-carbon/75">
          <input
            type="checkbox"
            checked={consents.marketing}
            onChange={(e) => setConsents((c) => ({ ...c, marketing: e.target.checked }))}
            className="mt-0.5 h-4 w-4 flex-shrink-0 accent-signal"
          />
          <span>I am happy to receive relevant commercial insights and follow-up from AI Video Systems.</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-[13.5px] text-carbon/75">
          <input
            type="checkbox"
            checked={consents.research}
            onChange={(e) => setConsents((c) => ({ ...c, research: e.target.checked }))}
            className="mt-0.5 h-4 w-4 flex-shrink-0 accent-signal"
          />
          <span>I am happy for our answers to be included in anonymised, aggregate funeral-plan industry research.</span>
        </label>
      </div>

      <p className="mt-4 text-[12px] text-carbon/45">
        By continuing you agree to our{' '}
        <a href={PRIVACY_POLICY_URL} className="underline hover:text-carbon">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href={TERMS_URL} className="underline hover:text-carbon">
          Terms
        </a>
        . Neither consent above is required to receive your result.
      </p>

      {submitError && (
        <div role="alert" className="mt-4 rounded-md border border-score-critical/30 bg-score-critical/5 px-4 py-3 text-[13.5px] text-score-critical">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-signal px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-action disabled:cursor-not-allowed disabled:bg-carbon/30 sm:w-auto"
        style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
      >
        {submitting ? 'Calculating your results…' : 'Show My Results'}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  className = '',
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-[13.5px] font-semibold text-carbon">
        {label} {required ? <span className="text-signal">*</span> : <span className="font-normal text-carbon/45">(optional)</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p className="mt-1 text-[12.5px] text-score-critical" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `h-11 w-full rounded-md border bg-white px-3 text-[15px] text-carbon outline-none focus:border-signal ${
    hasError ? 'border-score-critical' : 'border-carbon/20'
  }`;
}
