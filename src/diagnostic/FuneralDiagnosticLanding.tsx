import { useEffect } from 'react';
import { track } from './analytics';

interface FuneralDiagnosticLandingProps {
  onStart: () => void;
  partnerName?: string;
  firstName?: string;
}

const RECEIVES = [
  'Your true cost per completed plan sale — not just your cost per enquiry.',
  'What every 100 paid enquiries currently turns into: plans on the books, and contribution in pounds.',
  'What one extra percentage point of enquiry-to-plan conversion would be worth to you every month.',
  'What another £10,000 of acquisition would actually return at your conversion rate — and what it returns if your cost per enquiry rises 25% or 50%.',
  'The contribution still sitting in enquiries you have already paid for and stopped working.',
  'Seven category scores, the constraint most likely to break first, and the three things to fix before you scale.',
];

const CURIOSITY_POINTS = [
  'Whether cheap enquiries are turning into plans on the books, or just into activity.',
  'Which stage is losing you the most plan sales: speed of contact, qualification, follow-up or trust.',
  'What your current enquiry-to-plan rate costs you for every month it stays where it is.',
  'Whether your team could convert more volume tomorrow, or whether extra enquiries would simply sit unworked.',
  'How much of your plan volume depends on one platform, one campaign or one person.',
  'What the enquiries you have already paid for are still worth if they were worked properly.',
];

const WHO_FOR = [
  'Funeral-plan providers',
  'Funeral groups',
  'Independent funeral directors actively selling plans',
  'Established funeral-plan distribution operations',
];

const TRUST_POINTS = [
  'Answers are scored against observable operating behaviours, not vague self-rating statements.',
  'Every pound figure is worked out from the numbers you enter — nothing is assumed or benchmarked in on your behalf.',
  'Individual results remain confidential.',
  'Marketing and anonymised-research permission are separate and optional.',
  'Financial scenarios are illustrations based on the figures you provide.',
  'Results are diagnostic guidance, not financial advice or a guarantee of results.',
];

export default function FuneralDiagnosticLanding({ onStart, partnerName, firstName }: FuneralDiagnosticLandingProps) {
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
          {firstName ? `${firstName}, let's work out what a completed plan sale is actually costing you.` : "Let's work out what a completed plan sale is actually costing you."}
        </h1>
        <p className="mx-auto mt-5 max-w-[640px] text-[16px] leading-relaxed text-carbon/65">
          Answer a set of questions about how your enquiries are priced, handled and followed up. You get a scored
          breakdown of your enquiry-to-plan system, the pound figure your current conversion rate leaves behind every
          month, and the one constraint to fix before you spend another pound on acquisition.
        </p>
        <p className="mt-5 font-mono text-[12.5px] uppercase tracking-[0.12em] text-carbon/45">
          Takes 7–10 minutes · Your figures stay confidential · No obligation
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 bg-signal px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-action hover:shadow-[0_10px_30px_rgba(232,27,27,0.3)]"
          style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
        >
          Show Me What It Is Costing Me
        </button>
        <p className="mt-4 text-[12.5px] text-carbon/40">
          This is a free B2B diagnostic for established funeral-plan providers, funeral groups and sufficiently
          developed funeral directors that actively sell plans. It is not financial advice, consumer advice or a
          guarantee of results.
        </p>
      </section>

      <section className="border-t border-carbon/10 bg-cloud py-14 sm:py-20">
        <div className="mx-auto max-w-[960px] px-5 md:px-8">
          <h2 className="text-center font-display text-2xl font-bold text-carbon sm:text-3xl">
            The numbers you walk away with
          </h2>
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
          <p className="mt-6 text-center text-[13.5px] text-carbon/55">
            Financial figures appear where the numbers you provide support them. The scored result and your primary
            constraint are returned either way.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-[760px] px-5 md:px-8">
          <h2 className="font-display text-2xl font-bold text-carbon sm:text-3xl">
            What the diagnostic actually tells you
          </h2>
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
        <div className="mx-auto max-w-[680px] px-5 md:px-8">
          <p className="font-display text-xl font-bold text-white sm:text-2xl">
            Another hundred enquiries will not fix a business that is already losing the plans it has paid for.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-7 inline-flex min-h-[44px] items-center gap-2 bg-signal px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-action"
            style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
          >
            Show Me What It Is Costing Me
          </button>
        </div>
      </section>
    </div>
  );
}
