import { lazy, Suspense } from 'react';
import FadeIn from '../components/FadeIn';
import CountUp from '../components/CountUp';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

const SignalField = lazy(() => import('../components/SignalField'));

const BENEFITS = [
  'Consistent AI video production without constant filming',
  'Organic attention content built from real proof and buyer-relevant expertise',
  'Retargeting campaigns designed specifically for video viewers and engagers',
  'Qualification and follow-up that moves suitable prospects to a booked appointment',
  'Creative optimisation based on qualified leads, sales and revenue — not vanity metrics',
];

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-action">
      <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-[1360px] gap-10 px-5 pb-16 pt-12 md:px-8 md:pt-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <FadeIn delay={0}>
            <Eyebrow>For Established Service-Based Businesses Spending $5k+ p/m on Ads</Eyebrow>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.6rem)] font-extrabold leading-[1.06] tracking-tight text-carbon">
              Get viral attention &amp; qualified appointments using{' '}
              <span className="relative inline-block text-signal">
                The Attention-to-Revenue System
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 10" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 7 L398 3" stroke="#0B0B0D" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-7 max-w-[560px] text-[16.5px] leading-relaxed text-carbon/70">
              We build &amp; manage the system that turns your proof, expertise and customer outcomes into AI videos
              people love to watch, retarget them &amp; turn them into qualified appointments.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-8">
              <PrimaryCTA />
              <p className="mt-4 flex max-w-[520px] items-start gap-2.5 border-l-4 border-signal bg-cloud px-4 py-3 text-[13.5px] font-semibold leading-snug text-carbon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-action">
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                90-Day Revenue Guarantee — make back 100% of your fees in attributable new revenue within 90 days, or
                you don&rsquo;t pay.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <ul className="mt-8 grid max-w-[600px] gap-2.5">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[14px] font-medium text-carbon/85">
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t-2 border-carbon pt-6">
              <div>
                <p className="font-display text-3xl font-extrabold text-carbon">
                  <CountUp to={10} suffix="M+" />
                </p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-carbon/55">video views generated</p>
              </div>
              <span className="hidden h-10 w-[2px] rotate-12 bg-signal sm:block" />
              <div>
                <p className="font-display text-3xl font-extrabold text-carbon">1000s</p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-carbon/55">appointments created</p>
              </div>
              <span className="hidden h-10 w-[2px] rotate-12 bg-signal sm:block" />
              <div>
                <p className="font-display text-3xl font-extrabold text-signal">
                  <CountUp to={8} prefix="$" suffix="M+" />
                </p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-carbon/55">in client results</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 3D Attention-to-Revenue field */}
        <FadeIn delay={0.35} x={30} y={0} className="relative min-h-[420px] lg:min-h-0">
          <div className="absolute inset-0">
            <Suspense fallback={<div className="flex h-full items-center justify-center"><img src="/brand/avs-symbol-black.svg" alt="" className="w-40 opacity-10" /></div>}>
              <SignalField />
            </Suspense>
          </div>

          {/* floating system chips over the 3D scene */}
          <div className="pointer-events-none absolute left-0 top-4 border border-carbon/12 bg-white/90 px-3 py-2 backdrop-blur-sm">
            <p className="font-mono text-[10px] uppercase tracking-wider text-carbon/50">Cold attention</p>
            <p className="font-display text-sm font-bold text-carbon">
              <CountUp to={184203} duration={2.4} /> viewers
            </p>
          </div>
          <div className="pointer-events-none absolute right-0 top-1/2 border border-carbon/12 bg-white/90 px-3 py-2 backdrop-blur-sm">
            <p className="font-mono text-[10px] uppercase tracking-wider text-carbon/50">Warm audience</p>
            <p className="font-display text-sm font-bold text-signal">
              <CountUp to={9412} duration={2.4} />
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-10 left-1/2 flex w-max -translate-x-1/2 items-center gap-2.5 border-l-4 border-signal bg-white px-4 py-2.5 shadow-[0_10px_28px_rgba(11,11,13,0.12)]">
            <span className="flex h-7 w-7 items-center justify-center bg-signal">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="#fff" strokeWidth="1.8" />
                <path d="M3 9h18M8 3v4M16 3v4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M9 14.5l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="text-[12.5px] font-bold text-carbon">Qualified appointment booked</p>
          </div>

          <p className="absolute bottom-0 left-1/2 w-max -translate-x-1/2 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/45">
            From Attention to Revenue. <span className="text-action">From Signal to Sales.</span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
