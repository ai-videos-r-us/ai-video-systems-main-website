import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const PHASES = [
  {
    days: 'Days 1–14',
    name: 'Foundation',
    body: 'Extract the offer, buyer psychology, proof and sales process. Audit current creative and ad performance. Build brand rules, tracking, content architecture, audience plan and approval workflow.',
  },
  {
    days: 'Days 15–30',
    name: 'Launch',
    body: 'Produce the first attention and retargeting creative batches. Install or integrate tracking, CRM stages, qualification and booking. Launch organic publishing and initial warm-audience campaigns.',
  },
  {
    days: 'Days 31–60',
    name: 'Optimise',
    body: 'Measure watch behaviour, engagement quality, leads, qualified appointments and sales progression. Replace weak creative, deepen audience segmentation and introduce objection-specific retargeting.',
  },
  {
    days: 'Days 61–90',
    name: 'Scale',
    body: 'Identify attention, lead and revenue winners. Create controlled variations, shift budget towards proven messages and formalise the ongoing monthly creative and optimisation cadence.',
  },
];

const MILESTONES = [
  'The first approved content batch is live',
  'Engaged-viewer and retargeting audiences are collecting data',
  'The lead and appointment journey is connected to the CRM',
  'Commercial outcomes can be tied back to creative IDs',
  'At least one monthly optimisation cycle has been completed',
  'A documented winner-replication plan is operating',
];

export default function Process() {
  return (
    <section id="how-it-works" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[760px]">
          <FadeIn>
            <Eyebrow>The 90-Day Installation Plan</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Your Attention-to-Revenue System, <span className="text-signal">Live Within 90 Days</span>
            </h2>
          </FadeIn>
        </div>

        <div className="relative mt-16">
          <div className="signal-track absolute left-[22px] top-4 h-[calc(100%-2rem)] w-[2px] bg-signal/25 lg:hidden">
            <span className="signal-dot signal-dot--v" style={{ animationDuration: '4s' }} />
          </div>

          {/* horizontal connector on desktop */}
          <div className="absolute left-0 right-0 top-[26px] hidden h-[2px] bg-signal/25 lg:block" />

          <div className="grid gap-10 lg:grid-cols-4 lg:gap-6">
            {PHASES.map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.08}>
                <div className="relative pl-16 lg:pl-0">
                  <span
                    className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center bg-carbon font-mono text-[13px] font-semibold text-white lg:relative lg:mb-5 lg:h-[52px] lg:w-[52px]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.14em] text-action">{p.days}</p>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-carbon">{p.name}</h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-carbon/65">{p.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.15}>
          <div className="mt-16 border border-carbon/12 bg-cloud p-8">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/50">
              Client milestones — what will be true by day 90
            </p>
            <ul className="mt-4 grid gap-x-8 gap-y-2.5 md:grid-cols-2">
              {MILESTONES.map((m) => (
                <li key={m} className="flex items-start gap-2.5 text-[14px] font-medium text-carbon/80">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-action">
                    <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
