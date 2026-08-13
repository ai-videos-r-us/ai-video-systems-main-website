import { useEffect } from 'react';
import { track } from './analytics';

interface FuneralDiagnosticLandingProps {
  onStart: () => void;
  partnerName?: string;
}

const RECEIVES = [
  'An overall Scale Readiness Score',
  'Seven category scores across your acquisition-to-revenue system',
  'The primary constraint most likely to break first',
  'An illustrative £10,000 acquisition scenario where your data supports it',
  'Three actions to prioritise before scaling',
  'A confidential result you can revisit by secure link',
];

const CURIOSITY_POINTS = [
  'Whether low lead costs are translating into commercially valuable plan sales.',
  'Where every 100 enquiries are most likely leaking value.',
  'Whether your current team could absorb materially more volume.',
  'How exposed your business is to one platform or a handful of adverts.',
  'Whether older enquiries still represent an unworked opportunity.',
  'The first three things to address before increasing acquisition spend.',
];

const WHO_FOR = [
  'Funeral-plan providers',
  'Funeral groups',
  'Independent funeral directors actively selling plans',
  'Established funeral-plan distribution operations',
];

const TRUST_POINTS = [
  'Answers are scored against observable operating behaviours, not vague self-rating statements.',
  'Individual results remain confidential.',
  'Marketing and anonymised-research permission are separate and optional.',
  'Financial scenarios are illustrations based on the figures you provide.',
  'Results are diagnostic guidance, not financial advice or a guarantee of results.',
];

export default function FuneralDiagnosticLanding({ onStart, partnerName }: FuneralDiagnosticLandingProps) {
  useEffect(() => {
    track('diagnostic_landing_view', { partner_slug: partnerName });
  }, [partnerName]);

  function handleStart() {
    track('diagnostic_started');
    onStart();
  }

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-[880px] px-5 py-14 text-center sm:py-20 md:px-8">
        {partnerName && (
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-carbon/45">
            In partnership with {partnerName}
          </p>
        )}
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-action">
          Funeral Plan Scale Readiness Diagnostic
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-carbon sm:text-4xl md:text-5xl">
          Could Your Funeral Plan Business Profitably Handle Another £10,000 a Month in Customer Acquisition?
        </h1>
        <p className="mx-auto mt-5 max-w-[620px] text-[16px] leading-relaxed text-carbon/65">
          Take the free Funeral Plan Scale Readiness Diagnostic to discover what is most likely to break before you
          increase spend — and which constraint should be fixed first.
        </p>
        <p className="mt-5 font-mono text-[12.5px] uppercase tracking-[0.12em] text-carbon/45">
          Takes 7–10 minutes · Confidential results · No obligation
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 bg-signal px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-action hover:shadow-[0_10px_30px_rgba(232,27,27,0.3)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
        >
          Find My Scale Readiness Score
        </button>
        <p className="mt-4 text-[12.5px] text-carbon/40">
          This is a free B2B diagnostic for established funeral-plan providers, funeral groups and sufficiently
          developed funeral directors that actively sell plans. It is not financial advice, consumer advice or a
          guarantee of results.
        </p>
      </section>

      <section className="border-t border-carbon/10 bg-cloud py-14 sm:py-20">
        <div className="mx-auto max-w-[960px] px-5 md:px-8">
          <h2 className="text-center font-display text-2xl font-bold text-carbon sm:text-3xl">What you will receive</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {RECEIVES.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-carbon/10 bg-white p-4">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-signal text-[11px] font-bold text-white">
                  ✓
                </span>
                <span className="text-[14.5px] text-carbon/75">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[760px] px-5 md:px-8">
          <h2 className="font-display text-2xl font-bold text-carbon sm:text-3xl">What the diagnostic actually tells you</h2>
          <ul className="mt-6 space-y-3">
            {CURIOSITY_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] text-carbon/75">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-signal" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-carbon/10 bg-cloud py-14 sm:py-20">
        <div className="mx-auto max-w-[760px] px-5 md:px-8">
          <h2 className="font-display text-2xl font-bold text-carbon sm:text-3xl">Who it is for</h2>
          <p className="mt-4 text-[15px] text-carbon/70">
            This diagnostic is designed for founders, owners, managing directors, commercial leaders, marketing
            leaders and sales leaders inside:
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {WHO_FOR.map((item) => (
              <li key={item} className="rounded-lg border border-carbon/10 bg-white px-4 py-3 text-[14.5px] font-semibold text-carbon">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13.5px] text-carbon/55">
            It remains usable for smaller operators, but any deeper next step is routed based on your result — not
            offered indiscriminately.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[760px] px-5 md:px-8">
          <h2 className="font-display text-2xl font-bold text-carbon sm:text-3xl">Trust and methodology</h2>
          <ul className="mt-6 space-y-3">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] text-carbon/75">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-carbon/30" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-carbon/10 bg-carbon py-16 text-center sm:py-20">
        <div className="mx-auto max-w-[640px] px-5 md:px-8">
          <p className="font-display text-xl font-bold text-white sm:text-2xl">
            More enquiries are only valuable if the rest of your business can turn them into profitable plan sales.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-7 inline-flex min-h-[44px] items-center gap-2 bg-signal px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-action"
            style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
          >
            Find My Scale Readiness Score
          </button>
        </div>
      </section>
    </div>
  );
}
