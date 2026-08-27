import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-cloud py-24 md:py-32">
      <div className="mx-auto max-w-[820px] px-5 text-center md:px-8">
        <FadeIn>
          <Eyebrow>One Short Call</Eyebrow>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mx-auto mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
            See If Your Business Qualifies
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-relaxed text-carbon/70">
            We&rsquo;ll review your offer, creative, lead quality, follow-up and tracking. You&rsquo;ll leave
            knowing your biggest constraint, what we would fix first — and whether you qualify to become a
            client.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="mt-9 flex justify-center">
            <PrimaryCTA placement="final-cta" />
          </div>
        </FadeIn>
        <FadeIn delay={0.4}>
          <p className="mt-6 font-mono text-[11.5px] font-semibold uppercase tracking-[0.16em] text-carbon/50">
            Qualified clients start with the 30-day money-back guarantee
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
