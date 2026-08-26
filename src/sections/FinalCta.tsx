import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-cloud py-24 md:py-32">
      <div className="mx-auto max-w-[820px] px-5 text-center md:px-8">
        <FadeIn>
          <Eyebrow>Revenue System Audit</Eyebrow>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mx-auto mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
            Find the Biggest Leak Between Your Ad Spend and Closed Revenue
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-relaxed text-carbon/70">
            We&rsquo;ll review your offer, creative, lead quality, follow-up and tracking. You&rsquo;ll leave
            knowing the biggest constraint, what we would fix first and what the first 90 days could look like if
            there is a fit.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="mt-9 flex justify-center">
            <PrimaryCTA placement="final-cta" />
          </div>
        </FadeIn>
        <FadeIn delay={0.4}>
          <p className="mt-6 font-mono text-[11.5px] font-semibold uppercase tracking-[0.16em] text-carbon/50">
            One call — routed to the system your business actually needs
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
