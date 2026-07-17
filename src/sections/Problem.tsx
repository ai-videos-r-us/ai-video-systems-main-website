import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const SOURCES = [
  'Customer reviews',
  'Sales calls',
  'CRM notes',
  'Support tickets',
  'Founder expertise',
  'Customer questions',
  'Completed projects',
  'Case studies',
  'Landing pages',
  'Competitor advertising',
  'Testimonials',
  'Lost-sale objections',
];

const OUTPUTS = [
  { label: 'Attention videos' },
  { label: 'Proof videos' },
  { label: 'Objection-handling ads' },
  { label: 'Process videos' },
  { label: 'Customer stories' },
  { label: 'Offer ads' },
  { label: 'Qualified enquiries', hot: true },
  { label: 'Booked appointments', hot: true },
  { label: 'Revenue-winning creative insights', hot: true },
];

const FUNNEL = ['AI Message Extraction', 'Buyer Psychology Mapping', 'Content & Retargeting Strategy'];

export default function Problem() {
  return (
    <section className="bg-cloud py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[780px]">
          <FadeIn>
            <Eyebrow>The Real Acquisition Bottleneck</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Your Ad Account Doesn&rsquo;t Have a Targeting Problem. It Has a{' '}
              <span className="text-signal">Cold-Audience Problem</span>.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-carbon/70">
              <p>
                You&rsquo;re spending more, but the growth curve is flattening. Cost per lead rises, creative fatigues
                faster, lead quality becomes less predictable and the sales team receives more prospects who need to
                be convinced from zero.
              </p>
              <p className="font-semibold text-carbon">
                The underlying problem: you&rsquo;re asking a cold stranger to move from no familiarity to enquiry in
                a single step — one impression forced to earn attention, establish trust, explain the service, prove
                credibility, overcome objections and create action all at once.
              </p>
              <p>
                More budget, more generic content, more UGC and another funnel rebuild are false solutions — they all
                leave the attention and trust problem untouched.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Intelligence -> extraction -> outputs */}
        <div className="mt-16 grid items-start gap-10 lg:grid-cols-[1fr_auto_1fr]">
          <FadeIn x={-40} y={0}>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/50">
              Business intelligence sources
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SOURCES.map((s) => (
                <span
                  key={s}
                  className="border border-carbon/15 bg-white px-3 py-1.5 font-mono text-[11.5px] text-carbon/75"
                >
                  {s}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="mx-auto w-full max-w-[300px] lg:w-[300px]">
            <div className="flex flex-col items-stretch">
              {FUNNEL.map((f, i) => (
                <div key={f}>
                  <div
                    className="bg-carbon px-5 py-4 text-center font-display text-[13px] font-bold uppercase tracking-wide text-white"
                    style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
                  >
                    {f}
                  </div>
                  {i < FUNNEL.length - 1 && (
                    <div className="signal-track mx-auto h-6 w-[2px] bg-signal/25">
                      <span className="signal-dot signal-dot--v" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn x={40} y={0} delay={0.25}>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/50">
              Commercial outputs
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {OUTPUTS.map((o) => (
                <span
                  key={o.label}
                  className={`border px-3 py-1.5 font-mono text-[11.5px] ${
                    o.hot
                      ? 'border-signal bg-signal/5 font-semibold text-action'
                      : 'border-carbon/15 bg-white text-carbon/75'
                  }`}
                >
                  {o.label}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <blockquote className="mx-auto mt-16 max-w-[860px] border-l-4 border-signal bg-white px-8 py-7 shadow-[0_16px_40px_rgba(11,11,13,0.06)]">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-action">The big idea</p>
            <p className="mt-3 font-display text-[clamp(1.15rem,2vw,1.5rem)] font-bold leading-snug text-carbon">
              Don&rsquo;t ask every cold prospect to become a lead immediately. First create an audience of people who
              choose to watch.{' '}
              <span className="text-action">
                Then use proof, retargeting and follow-up to convert that attention into qualified appointments and
                trackable revenue.
              </span>
            </p>
          </blockquote>
        </FadeIn>
      </div>
    </section>
  );
}
