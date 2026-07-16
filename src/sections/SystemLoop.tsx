import FadeIn from '../components/FadeIn';
import { Eyebrow, AUDIT_URL } from '../components/CTA';

const STAGES = [
  {
    n: '01',
    name: 'Proof-to-Content Engine',
    desc: 'Extract the strongest messages already inside the business and turn them into accurate, branded AI-assisted videos.',
    includes: [
      'Customer outcomes',
      'Reviews and testimonials',
      'Completed work',
      'FAQs and objections',
      'Pricing logic',
      'Sales arguments',
      'Service processes',
      'Founder expertise',
    ],
  },
  {
    n: '02',
    name: 'Attention Audience Engine',
    desc: 'Publish videos designed to earn voluntary attention and create a lower-friction audience before asking for an enquiry.',
    includes: [
      'Short-form attention videos',
      'Educational content',
      'Transformation stories',
      'Process videos',
      'Proof-led content',
      'Platform-ready editing',
      'Publishing and scheduling',
    ],
  },
  {
    n: '03',
    name: 'Watcher Retargeting Engine',
    desc: 'Segment viewers by their depth of interest and show them the next logical message.',
    includes: [
      'Video-view audiences',
      'Engagement audiences',
      'Proof campaigns',
      'Trust-building sequences',
      'Objection-handling ads',
      'Process clarification',
      'Direct-response offers',
    ],
  },
  {
    n: '04',
    name: 'Qualified Appointment Engine',
    desc: 'Capture, qualify and route suitable prospects into the correct sales process.',
    includes: [
      'High-intent lead forms',
      'Qualification questions',
      'CRM integration',
      'Immediate SMS and email follow-up',
      'Calendar routing',
      'Appointment reminders',
      'No-show reduction',
    ],
  },
  {
    n: '05',
    name: 'Revenue Feedback Loop',
    desc: 'Connect leads, appointments, quotes, sales and revenue back to the original creative.',
    includes: [
      'Creative-level attribution',
      'Qualified lead tracking',
      'Appointment tracking',
      'Revenue-winner classification',
      'Winning-hook database',
      'Controlled creative variations',
      'Monthly scale recommendations',
    ],
  },
];

export default function SystemLoop() {
  return (
    <section id="system" className="clip-angle-top bg-carbon pb-24 pt-32 text-white md:pb-32 md:pt-40">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[780px]">
          <FadeIn>
            <Eyebrow light>The Watcher-to-Appointment Loop</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              A Complete System From <span className="text-signal">Proof to Pipeline</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-[16px] leading-relaxed text-steel">
              Every customer result becomes new proof. That proof becomes content. The content creates engaged
              viewers. Those viewers become qualified opportunities. The commercial result improves the next
              generation of creative.
            </p>
          </FadeIn>
        </div>

        <div className="relative mt-20">
          {/* central signal line (desktop) */}
          <div className="signal-track absolute bottom-6 left-1/2 top-0 hidden w-[2px] -translate-x-1/2 bg-signal/25 lg:block">
            <span className="signal-dot signal-dot--v" style={{ animationDuration: '5s' }} />
          </div>
          {/* left signal line (mobile) */}
          <div className="signal-track absolute bottom-6 left-[7px] top-0 w-[2px] bg-signal/25 lg:hidden">
            <span className="signal-dot signal-dot--v" style={{ animationDuration: '5s' }} />
          </div>

          <div className="space-y-12 lg:space-y-16">
            {STAGES.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <FadeIn key={s.n} delay={0.05} x={left ? -30 : 30} y={0}>
                  <div className={`relative pl-8 lg:w-[calc(50%-40px)] lg:pl-0 ${left ? '' : 'lg:ml-auto'}`}>
                    {/* node marker */}
                    <span
                      className={`absolute top-1 h-4 w-4 border-2 border-signal bg-carbon lg:top-2 ${
                        left ? 'left-0 lg:-right-[49px] lg:left-auto' : 'left-0 lg:-left-[49px]'
                      }`}
                      style={{ transform: 'rotate(45deg)' }}
                    />
                    <p className="font-mono text-sm font-semibold text-signal">Stage {s.n}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-white">{s.name}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-steel">{s.desc}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {s.includes.map((inc) => (
                        <span
                          key={inc}
                          className="border border-white/12 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-steel"
                        >
                          {inc}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* loop-back */}
          <FadeIn>
            <div className="mt-14 flex items-center justify-center gap-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-signal">
                <path d="M4 12a8 8 0 108-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 1v6l4-3z" fill="currentColor" />
              </svg>
              <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-steel">
                The result feeds Stage 01 — the loop compounds every month
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="mt-20 flex flex-col items-center justify-between gap-6 border-2 border-signal/40 bg-white/[0.03] px-8 py-9 md:flex-row md:px-12">
            <p className="max-w-[520px] text-center font-display text-xl font-bold leading-snug text-white md:text-left">
              Ready to See What the System Could Look Like for Your Business?
            </p>
            <a
              href={AUDIT_URL}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-signal px-7 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-action"
              style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
            >
              Request a Demand System Audit
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
