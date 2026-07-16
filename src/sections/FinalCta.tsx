import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

const TRUST = [
  'Built for established service businesses',
  'Designed for companies already spending $5k+ per month',
  'No constant founder filming required',
  'Creative, retargeting, qualification and tracking connected',
  'No content published without approval',
  '90-Day Launch Assurance',
];

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-[1360px] items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <FadeIn>
            <Eyebrow>From Signal to Sales</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Build the Warm-Audience Acquisition Layer{' '}
              <span className="text-signal">Your Ad Account Is Missing</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-[560px] text-[16px] leading-relaxed text-carbon/70">
              We will review your offer, advertising, creative volume, lead quality and tracking, then show you how
              the Watcher-to-Appointment Loop could turn more of your existing market attention into qualified booked
              appointments.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8">
              <PrimaryCTA />
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <ul className="mt-9 grid max-w-[620px] gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {TRUST.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[13.5px] font-medium text-carbon/80">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-action">
                    <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        <FadeIn x={40} y={0} delay={0.2}>
          <div className="relative mx-auto max-w-[420px]">
            <div
              className="absolute -inset-3 border-2 border-signal"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)' }}
              aria-hidden
            />
            <img
              src="/assets/founder-hero.png"
              alt="Sean, founder of AI Video Systems"
              className="relative w-full object-cover"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)' }}
            />
            <p className="mt-6 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/45">
              From Watch Time to Pipeline. <span className="text-action">From Signal to Sales.</span>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
