import FadeIn from '../components/FadeIn';
import CountUp from '../components/CountUp';
import VslPlayer from '../components/VslPlayer';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-[1100px] px-5 pb-20 pt-14 text-center md:px-8 md:pb-24 md:pt-20">
        <FadeIn delay={0}>
          <div className="flex justify-center">
            <Eyebrow>For Service Businesses Spending $5,000+/Month on Ads</Eyebrow>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="mx-auto mt-6 max-w-[840px] font-display text-[clamp(1.9rem,4.4vw,3.4rem)] font-extrabold leading-[1.1] tracking-tight text-carbon">
            The lead generation agency for local service businesses.{' '}
            <span className="text-carbon/60">Done with broken promises.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mx-auto mt-6 max-w-[560px] font-display text-[clamp(1.05rem,2vw,1.35rem)] font-bold text-carbon/80">
            <CountUp to={15} prefix="$" suffix="M+" duration={1.8} /> Tracked Revenue{' '}
            <span className="text-carbon/30">·</span> <CountUp to={96} suffix="+" duration={1.8} /> Clients{' '}
            <span className="text-carbon/30">·</span> Two Tailored Systems
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
          <p className="mx-auto mt-4 max-w-[680px] text-[16.5px] leading-relaxed text-carbon/70">
            We install and run lead generation for you — content, ads, landing pages, CRM, and a team that
            improves everything daily, so no money is wasted.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <VslPlayer className="mx-auto mt-10 w-full max-w-[820px]" />
        </FadeIn>

        <FadeIn delay={0.35}>
          <div className="mt-9 flex justify-center">
            <PrimaryCTA placement="hero" />
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="mx-auto mt-4 max-w-[440px] text-[13.5px] leading-snug text-carbon/60">
            One 20-minute call. Leave knowing your biggest leak and what we&rsquo;d fix first.
          </p>
        </FadeIn>

        <FadeIn delay={0.45}>
          <p className="mt-8 font-mono text-[11.5px] font-semibold uppercase tracking-[0.16em] text-carbon/55">
            30-Day Money-Back Guarantee · Fully Managed · Receipts Included
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
