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
              Your Ads Aren&rsquo;t Failing. You&rsquo;re Asking Cold Strangers to Do Too Much.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-carbon/70">
              <p>
                Most businesses ask a cold prospect to notice the ad, trust the company, understand the service,
                believe the claims, overcome their objections and submit an enquiry after a single impression.
              </p>
              <p className="font-semibold text-carbon">
                That forces one advertisement to do the work of an entire sales journey.
              </p>
              <p>
                As spend increases, creative fatigues faster, lead quality becomes less predictable and the sales team
                receives more prospects who need to be educated from zero.
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
          <blockquote className="mx-auto mt-16 max-w-[820px] border-l-4 border-signal bg-white px-8 py-7 shadow-[0_16px_40px_rgba(11,11,13,0.06)]">
            <p className="font-display text-[clamp(1.15rem,2vw,1.5rem)] font-bold leading-snug text-carbon">
              Stop asking every cold stranger to become a lead immediately. First create an audience of people who
              chose to watch. <span className="text-action">Then turn the right watchers into appointments.</span>
            </p>
          </blockquote>
        </FadeIn>
      </div>
    </section>
  );
}
