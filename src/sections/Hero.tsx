import FadeIn from '../components/FadeIn';
import CountUp from '../components/CountUp';
import { Eyebrow, PrimaryCTA, SecondaryCTA } from '../components/CTA';

const STATS = [
  { value: <CountUp to={15} prefix="$" suffix="M+" duration={1.8} />, label: 'in Tracked Revenue.' },
  { value: <CountUp to={96} suffix="+" duration={1.8} />, label: 'Clients.' },
  { value: 'Two', label: 'Tailored Systems.' },
] as const;

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[1100px] px-5 pb-20 pt-14 text-center md:px-8 md:pb-24 md:pt-20">
        <FadeIn delay={0}>
          <div className="flex justify-center">
            <Eyebrow>For Established Service Businesses</Eyebrow>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mt-6 font-display text-[clamp(2.2rem,5.2vw,4.2rem)] font-extrabold leading-[1.04] tracking-tight text-carbon">
            {STATS.map((s) => (
              <span key={s.label} className="block">
                {s.value} <span className="text-carbon/60">{s.label}</span>
              </span>
            ))}
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="mx-auto mt-8 max-w-[720px] font-display text-[clamp(1.25rem,2.3vw,1.7rem)] font-bold leading-snug text-carbon">
            Business owners need ROI — not broken promises.
          </h1>
        </FadeIn>

        <FadeIn delay={0.25}>
          <p className="mx-auto mt-4 max-w-[680px] text-[16.5px] leading-relaxed text-carbon/70">
            AI Video Systems leads with receipts: content, ads, lead generation, and a team that improves
            everything daily — so no money is wasted.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PrimaryCTA placement="hero" />
            <SecondaryCTA href="#systems">See the Two Systems</SecondaryCTA>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="mt-9 font-mono text-[11.5px] font-semibold uppercase tracking-[0.16em] text-carbon/55">
            45-Day Revenue Guarantee · Fully Managed · Receipts Included
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
