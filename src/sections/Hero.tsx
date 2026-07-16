import FadeIn from '../components/FadeIn';
import CountUp from '../components/CountUp';
import { Eyebrow, PrimaryCTA, SecondaryCTA } from '../components/CTA';

const BENEFITS = [
  'Consistent AI videos without constant filming',
  'Build warm audiences before asking for an enquiry',
  'Retarget viewers with proof, trust and objection-handling content',
  'Qualify and route suitable enquiries into your sales process',
  'Optimise creative around appointments, sales and revenue',
];

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-action">
      <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Connector() {
  return (
    <div className="signal-track mx-auto h-7 w-[2px] bg-signal/25">
      <span className="signal-dot signal-dot--v" />
    </div>
  );
}

function StageLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-carbon/50">{children}</p>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      {/* faint angular watermark of the symbol */}
      <img
        src="/brand/avs-symbol-black.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 w-[420px] opacity-[0.035]"
      />

      <div className="mx-auto grid max-w-[1360px] gap-14 px-5 pb-16 pt-14 md:px-8 md:pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
        <div>
          <FadeIn delay={0}>
            <Eyebrow>AI Video Demand Systems for Established Service Businesses</Eyebrow>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,5.2vw,4.3rem)] font-extrabold leading-[1.04] tracking-tight text-carbon">
              Turn AI Video Watchers Into{' '}
              <span className="relative inline-block">
                Qualified Booked Appointments
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 400 10" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 7 L398 3" stroke="#FF1F1F" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-7 max-w-[560px] text-[16.5px] leading-relaxed text-carbon/70">
              We build and manage a complete AI Video Demand System for established service businesses already
              spending $5k+ per month on advertising—turning your proof, expertise and customer outcomes into videos
              people choose to watch, then retargeting those viewers until they are ready to enquire.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-4">
              <PrimaryCTA />
              <SecondaryCTA href="#case-studies">Watch the Ironclad Case Study</SecondaryCTA>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <ul className="mt-9 grid max-w-[600px] gap-2.5">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-[14.5px] font-medium text-carbon/85">
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

        {/* System-flow visual */}
        <FadeIn delay={0.35} x={40} y={0} className="lg:pt-2">
          <div className="mx-auto max-w-[400px]">
            <div className="border border-carbon/10 bg-cloud p-5 shadow-[0_24px_60px_rgba(11,11,13,0.08)]">
              <StageLabel>Customer proof</StageLabel>
              <div className="mt-2 flex items-center gap-2">
                {['"Best decision we made"', '5.0 ★★★★★', '£12k job booked'].map((t) => (
                  <span key={t} className="whitespace-nowrap border border-carbon/10 bg-white px-2.5 py-1.5 font-mono text-[10px] text-carbon/70">
                    {t}
                  </span>
                ))}
              </div>

              <Connector />

              <StageLabel>AI videos</StageLabel>
              <div className="relative mt-2 overflow-hidden border border-carbon/10 bg-carbon">
                <video
                  src="/videos/three-protocol-cover.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full object-cover opacity-90"
                />
                <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-carbon/85 px-2 py-1 font-mono text-[10px] text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
                  PUBLISHED DAILY
                </span>
              </div>

              <Connector />

              <StageLabel>Engaged viewers</StageLabel>
              <div className="mt-2 flex items-center justify-between border border-carbon/10 bg-white px-4 py-3">
                <div>
                  <p className="font-display text-xl font-extrabold text-carbon">
                    <CountUp to={9412} duration={2.2} />
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-carbon/50">warm audience</p>
                </div>
                <svg width="88" height="30" viewBox="0 0 88 30" fill="none" aria-hidden>
                  <polyline points="0,26 12,22 24,24 36,16 48,18 60,10 72,12 88,3" stroke="#FF1F1F" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>

              <Connector />

              <StageLabel>Retargeting</StageLabel>
              <div className="mt-2 flex items-center gap-3 border border-carbon/10 bg-white px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center bg-carbon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="3" fill="#FF1F1F" />
                  </svg>
                </span>
                <p className="text-[12.5px] font-medium leading-snug text-carbon/75">
                  Watched 75%+ → shown proof &amp; objection-handling ads
                </p>
              </div>

              <Connector />

              <StageLabel>Qualified appointments</StageLabel>
              <div className="mt-2 flex items-center gap-3 border-l-4 border-signal bg-white px-4 py-3 shadow-[0_10px_28px_rgba(11,11,13,0.1)]">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-signal">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="16" rx="2" stroke="#fff" strokeWidth="1.8" />
                    <path d="M3 9h18M8 3v4M16 3v4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M9 14.5l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-[13px] font-bold text-carbon">New appointment booked</p>
                  <p className="font-mono text-[10.5px] text-carbon/55">Qualified · Routed to calendar · Reminder sent</p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/45">
              From Watch Time to Pipeline. <span className="text-action">From Signal to Sales.</span>
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
