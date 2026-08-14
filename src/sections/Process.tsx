import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const PHASES = [
  {
    days: 'Days 1–14',
    name: 'Diagnose',
    body: 'Audit the offer, proof, buyer psychology, creative, lead quality, sales process and tracking. Identify the constraint before prescribing the build.',
  },
  {
    days: 'Days 15–30',
    name: 'Launch',
    body: 'Produce the first buyer-aware creative, launch the warm-audience campaigns and connect qualification, follow-up and measurement.',
  },
  {
    days: 'Days 31–90',
    name: 'Improve',
    body: 'Track qualified appointments and sales, remove weak messages, create variations of winners and complete the first commercial optimisation cycles.',
  },
];

export default function Process() {
  return (
    <section id="90-day-plan" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[760px]">
          <FadeIn>
            <Eyebrow>The First 90 Days</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              From Scattered Creative to <span className="text-signal">a Measurable Demand System</span>
            </h2>
          </FadeIn>
        </div>

        <div className="relative mt-16">
          <div className="signal-track absolute left-[22px] top-4 h-[calc(100%-2rem)] w-[2px] bg-signal/25 lg:hidden">
            <span className="signal-dot signal-dot--v" style={{ animationDuration: '4s' }} />
          </div>

          <div className="absolute left-0 right-0 top-[26px] hidden h-[2px] bg-signal/25 lg:block" />

          <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
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
      </div>
    </section>
  );
}
