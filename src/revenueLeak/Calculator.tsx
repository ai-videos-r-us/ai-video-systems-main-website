import { useMemo, useState } from 'react';
import { AUDIT_URL, trackAuditCtaClick } from '../components/CTA';
import { calculateLeak, STAGE_DIAGNOSIS, TARGET_RATES, type LeakInputs } from '../../lib/revenue-leak/model';
import { CURRENCY_SYMBOL, money, people, type Currency } from './format';

const DEFAULTS: LeakInputs = {
  monthlySpend: 10000,
  leads: 100,
  bookingRate: 40,
  showRate: 70,
  qualificationRate: 50,
  closeRate: 20,
  averageFirstSale: 6000,
};

const FIELDS: {
  key: keyof LeakInputs;
  label: string;
  hint: string;
  affix: 'currency' | 'percent' | 'none';
  step: number;
}[] = [
  { key: 'monthlySpend', label: 'Monthly ad spend', hint: 'Media budget only', affix: 'currency', step: 500 },
  { key: 'leads', label: 'Leads per month', hint: 'Form fills, calls, enquiries', affix: 'none', step: 5 },
  { key: 'bookingRate', label: 'Booking rate', hint: 'Leads that book a call', affix: 'percent', step: 1 },
  { key: 'showRate', label: 'Show rate', hint: 'Booked calls that turn up', affix: 'percent', step: 1 },
  { key: 'qualificationRate', label: 'Qualification rate', hint: 'Attended calls that were a real fit', affix: 'percent', step: 1 },
  { key: 'closeRate', label: 'Close rate', hint: 'Qualified calls that became customers', affix: 'percent', step: 1 },
  { key: 'averageFirstSale', label: 'Average first sale', hint: 'First transaction, not lifetime value', affix: 'currency', step: 250 },
];

export default function Calculator({ firstName }: { firstName?: string }) {
  const [inputs, setInputs] = useState<LeakInputs>(DEFAULTS);
  const [currency, setCurrency] = useState<Currency>('GBP');
  const result = useMemo(() => calculateLeak(inputs), [inputs]);
  const weakStage = result.stages.find((s) => s.isWeakest);
  const diagnosis = result.weakest ? STAGE_DIAGNOSIS[result.weakest] : null;

  function update(key: keyof LeakInputs, raw: string) {
    const parsed = raw === '' ? 0 : Number(raw);
    setInputs((prev) => ({ ...prev, [key]: Number.isFinite(parsed) ? parsed : 0 }));
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-5 pb-24 pt-8 md:px-8 md:pt-12">
      <header className="border-b border-carbon/10 pb-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-carbon/45">
          AI Video Systems &middot; Diagnostic 01
        </p>
        <h1 className="mt-3.5 max-w-[19ch] font-display text-[30px] font-extrabold leading-[1.06] tracking-tight text-carbon sm:text-[44px]">
          Where your ad spend stops becoming revenue
        </h1>
        <p className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed text-carbon/70">
          {firstName ? `${firstName}, put ` : 'Put '}your seven numbers in below. The chain recalculates as you type, flags
          the stage costing you the most, and puts a monthly figure on it.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-8">
        {/* ---------- worksheet ---------- */}
        <section className="border border-carbon/12 bg-white" aria-label="Your numbers">
          <div className="flex items-center justify-between border-b border-carbon/12 px-5 py-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-carbon/50">Your numbers</h2>
            <div className="flex overflow-hidden rounded border border-carbon/15" role="group" aria-label="Currency">
              {(['GBP', 'USD'] as Currency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={currency === c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1 font-mono text-[12px] transition-colors ${
                    currency === c ? 'bg-carbon text-white' : 'bg-white text-carbon/55 hover:text-carbon'
                  }`}
                >
                  {CURRENCY_SYMBOL[c]}
                </button>
              ))}
            </div>
          </div>

          <div>
            {FIELDS.map((f) => (
              <div
                key={f.key}
                className="grid grid-cols-[minmax(0,1fr)_128px] items-center gap-4 border-b border-carbon/8 px-5 py-3 last:border-b-0"
              >
                <label htmlFor={`rl-${f.key}`} className="min-w-0">
                  <span className="block text-[14.5px] font-semibold leading-tight text-carbon">{f.label}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-carbon/50">{f.hint}</span>
                </label>
                <div className="relative flex items-center">
                  {f.affix === 'currency' && (
                    <span className="pointer-events-none absolute left-3 font-mono text-[13px] text-carbon/40">
                      {CURRENCY_SYMBOL[currency]}
                    </span>
                  )}
                  {f.affix === 'percent' && (
                    <span className="pointer-events-none absolute right-3 font-mono text-[13px] text-carbon/40">%</span>
                  )}
                  <input
                    id={`rl-${f.key}`}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={f.affix === 'percent' ? 100 : undefined}
                    step={f.step}
                    value={String(inputs[f.key])}
                    onChange={(e) => update(f.key, e.target.value)}
                    className={`h-11 w-full rounded border border-carbon/20 bg-cloud text-right font-mono text-[15px] tabular-nums text-carbon outline-none focus:border-signal ${
                      f.affix === 'currency' ? 'pl-7 pr-3' : f.affix === 'percent' ? 'pl-3 pr-7' : 'px-3'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- chain ---------- */}
        <section className="border border-carbon/12 bg-white" aria-label="Your revenue chain" aria-live="polite">
          <div className="flex items-baseline justify-between border-b border-carbon/12 px-5 py-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-carbon/50">Your revenue chain</h2>
            <p className="font-mono text-[11px] text-carbon/40">{people(inputs.leads)} leads in</p>
          </div>

          <div className="px-5 pb-2 pt-5">
            <Bar label="Leads" figure={people(inputs.leads)} keptPct={100} lostPct={0} />
            {result.stages.map((s) => {
              const base = inputs.leads > 0 ? inputs.leads : 1;
              const keptPct = Math.max(0, Math.min(100, (s.out / base) * 100));
              const lostPct = Math.max(0, Math.min(100 - keptPct, (s.lost / base) * 100));
              return (
                <Bar
                  key={s.key}
                  label={s.label}
                  rate={`${s.rate}% ${s.from}`}
                  figure={`${people(s.out)} · ${people(s.lost)} lost`}
                  keptPct={keptPct}
                  lostPct={lostPct}
                  weak={s.isWeakest}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 px-5 pb-4 font-mono text-[11px] text-carbon/50">
            <span className="inline-flex items-center gap-1.5">
              <i className="inline-block h-2.5 w-2.5 rounded-sm bg-carbon" />
              Carried forward
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="inline-block h-2.5 w-2.5 rounded-sm bg-score-critical/25" />
              Lost at this stage
            </span>
          </div>

          <div className="grid grid-cols-2 border-t border-carbon/12 sm:grid-cols-4">
            <Stat k="Customers / mo" v={people(result.customers)} />
            <Stat k="Revenue / mo" v={money(result.revenue, currency)} />
            <Stat k="Cost / customer" v={result.costPerCustomer === null ? '—' : money(result.costPerCustomer, currency)} />
            <Stat k="Return on spend" v={result.roas === null ? '—' : `${result.roas.toFixed(2)}×`} last />
          </div>
        </section>
      </div>

      {/* ---------- diagnosis ---------- */}
      <section className="mt-6 border border-carbon/12 bg-white lg:mt-8" aria-live="polite">
        <div className="flex items-baseline justify-between border-b border-carbon/12 px-5 py-4">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-carbon/50">The diagnosis</h2>
          <p className="font-mono text-[11px] text-carbon/40">Same spend &middot; same leads</p>
        </div>

        <div className="px-5 py-6 md:px-6">
          {result.state === 'incomplete' && (
            <>
              <Flag tone="neutral">Waiting on numbers</Flag>
              <h3 className="mt-3.5 font-display text-[21px] font-bold leading-snug text-carbon sm:text-[26px]">
                Put your leads and average sale in.
              </h3>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-carbon/70">
                The chain needs a lead count and a first-sale figure before it can find anything.
              </p>
            </>
          )}

          {result.state === 'no_leak' && (
            <>
              <Flag tone="ok">No leak found</Flag>
              <h3 className="mt-3.5 font-display text-[21px] font-bold leading-snug text-carbon sm:text-[26px]">
                Nothing is leaking. Your constraint is spend.
              </h3>
              <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-carbon/70">
                Every stage of your chain is at or above the rate a well-run system targets. That is rare, and it means
                more budget will not simply push more people through the same weaknesses &mdash; there aren&rsquo;t any.
                You are in the position where <strong className="font-semibold text-carbon">increasing spend is the safe
                move</strong>, not the risky one.
              </p>
              <Layer
                title="Layer 4 — Revenue Feedback"
                body="Instrument the chain end to end so you can see which stage bends first as spend rises, then scale against evidence instead of nerve."
              />
            </>
          )}

          {result.state === 'leak' && weakStage && diagnosis && (
            <>
              <Flag tone="leak">Leak detected &middot; {weakStage.noun.replace(/^your /, '')}</Flag>
              <h3 className="mt-3.5 max-w-[24ch] font-display text-[21px] font-bold leading-snug text-carbon sm:text-[27px]">
                Your biggest leak is {weakStage.noun} &mdash; and it costs you{' '}
                <span className="whitespace-nowrap font-mono tabular-nums text-score-critical">
                  {money(result.singleStageGain, currency)}
                </span>{' '}
                a month.
              </h3>

              <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed text-carbon/70">
                {diagnosis.why} At {weakStage.rate}%, this is the weakest link in your chain, which means it is also
                where a fix returns the most money &mdash; you lose roughly{' '}
                <strong className="font-semibold text-carbon">{people(weakStage.lost)} people</strong> here every month
                who had already cleared every stage before it.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-px border border-carbon/10 bg-carbon/10 sm:grid-cols-2">
                <Money k="Fix this one stage and you add" v={money(result.singleStageGain, currency)} sub={`${money(result.singleStageGain * 12, currency)} a year`} />
                <Money k="Fix the whole chain and you add" v={money(result.fullChainGain, currency)} sub={`${money(result.fullChainGain * 12, currency)} a year`} />
              </div>

              <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-carbon/70">
                Neither figure requires another {currency === 'GBP' ? 'pound' : 'dollar'} of ad spend, another lead, or a
                bigger team. It is the same {people(inputs.leads)} leads you already pay for, converting at the rates a
                working system reaches &mdash;{' '}
                <strong className="font-semibold text-carbon">
                  {result.fullChainMultiple.toFixed(2)}× the revenue from the identical budget
                </strong>
                . And every month the leak stays open, it costs you {money(result.singleStageGain, currency)} again.
              </p>

              <Layer title={diagnosis.layer} body={diagnosis.fix} />
            </>
          )}
        </div>
      </section>

      {/* ---------- cta ---------- */}
      <section className="mt-6 bg-carbon px-6 py-9 text-white md:px-10 md:py-12 lg:mt-8">
        <h2 className="max-w-[26ch] font-display text-[22px] font-extrabold leading-tight sm:text-[30px]">
          You&rsquo;ve found the leak. You don&rsquo;t yet know why it leaks.
        </h2>
        <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-white/75">
          Knowing which stage costs you the most is not the same as knowing what&rsquo;s causing it, what fixes it, or who
          builds it. That&rsquo;s a Revenue System Audit &mdash; 45 minutes on your actual ad account and CRM. You leave
          with the fix mapped out whether or not we work together.
        </p>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-white/75">
          I run these myself, so I take a limited number each month.
        </p>
        <a
          href={AUDIT_URL}
          target="_blank"
          rel="noopener"
          onClick={() => trackAuditCtaClick('revenue-leak-calculator')}
          className="mt-7 inline-block bg-signal px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-action"
          style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
        >
          Book a Revenue System Audit
        </a>
        <p className="mt-7 border-t border-white/15 pt-5 font-mono text-[11.5px] text-white/55">
          Sean Munn &middot; AI Video Systems &middot; $11M+ generated for clients
        </p>
      </section>

      <footer className="mt-10 border-t border-carbon/10 pt-6 font-mono text-[11.5px] leading-relaxed text-carbon/45">
        <p>
          <span className="text-carbon/65">How this works.</span> Attributable revenue = leads × booking rate × show rate
          × qualification rate × close rate × average first sale. The weakest stage is flagged because in a multiplied
          chain, a fixed improvement to the lowest rate always returns the largest absolute gain — fix the worst stage
          first.
        </p>
        <p className="mt-3">
          <span className="text-carbon/65">On the target rates</span> ({TARGET_RATES.bookingRate}% booking ·{' '}
          {TARGET_RATES.showRate}% show · {TARGET_RATES.qualificationRate}% qualified · {TARGET_RATES.closeRate}% close).
          These are the rates a well-run acquisition system should reach, taken from the Attention-to-Revenue System
          model. They are not published industry benchmarks and your sector may differ.
        </p>
      </footer>
    </div>
  );
}

function Bar({
  label,
  rate,
  figure,
  keptPct,
  lostPct,
  weak = false,
}: {
  label: string;
  rate?: string;
  figure: string;
  keptPct: number;
  lostPct: number;
  weak?: boolean;
}) {
  return (
    <div className="mb-4 last:mb-3">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className={`text-[13.5px] font-semibold ${weak ? 'text-signal' : 'text-carbon'}`}>
          {label}
          {rate && <span className="ml-2 font-mono text-[11px] font-normal text-carbon/45">{rate}</span>}
        </span>
        <span className="whitespace-nowrap font-mono text-[12.5px] tabular-nums text-carbon/60">{figure}</span>
      </div>
      <div className={`flex h-4 overflow-hidden rounded-sm bg-score-critical/10 ${weak ? 'ring-1 ring-signal' : ''}`}>
        <div className="h-full bg-carbon transition-[width] duration-300 ease-out" style={{ width: `${keptPct}%` }} />
        <div className="h-full bg-score-critical/25 transition-[width] duration-300 ease-out" style={{ width: `${lostPct}%` }} />
      </div>
    </div>
  );
}

function Stat({ k, v, last = false }: { k: string; v: string; last?: boolean }) {
  return (
    <div className={`px-4 py-3.5 ${last ? '' : 'border-carbon/8 sm:border-r'} border-b border-carbon/8 sm:border-b-0`}>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-carbon/45">{k}</p>
      <p className="mt-1 font-mono text-[19px] tabular-nums tracking-tight text-carbon">{v}</p>
    </div>
  );
}

function Money({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div className="bg-white px-4 py-4">
      <p className="text-[12.5px] leading-snug text-carbon/55">{k}</p>
      <p className="mt-1.5 font-mono text-[24px] tabular-nums tracking-tight text-score-critical sm:text-[27px]">{v}</p>
      <p className="mt-1 font-mono text-[11px] text-carbon/40">{sub}</p>
    </div>
  );
}

function Flag({ tone, children }: { tone: 'leak' | 'ok' | 'neutral'; children: React.ReactNode }) {
  const cls =
    tone === 'leak'
      ? 'bg-score-critical/8 text-score-critical'
      : tone === 'ok'
        ? 'bg-score-ready/10 text-score-ready'
        : 'bg-carbon/6 text-carbon/60';
  return (
    <span className={`inline-flex items-center gap-2 rounded-sm px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.11em] ${cls}`}>
      <i className="block h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

function Layer({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-6 border-l-2 border-signal py-0.5 pl-4">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-carbon/45">{title}</p>
      <p className="mt-1.5 text-[14.5px] leading-relaxed text-carbon/80">{body}</p>
    </div>
  );
}
