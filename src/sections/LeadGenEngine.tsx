import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

export default function LeadGenEngine() {
  return (
    <section id="lead-gen-engine" className="clip-angle-both bg-carbon pb-24 pt-24 text-white md:pb-28 md:pt-28">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="max-w-[600px]">
            <FadeIn>
              <Eyebrow light>System Two</Eyebrow>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-white">
                The Lead Gen Engine
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-4 font-display text-[17px] font-bold leading-snug text-white/90">
                Install the lead generation system your business needs to scale.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-5 text-[15.5px] leading-relaxed text-steel">
                Trying to generate leads and not succeeding? Are your Meta ad campaigns not delivering the
                results you&rsquo;re looking for? Have you tried every AI tech system in the marketplace, only
                to find it hallucinates and never produces the leads you need?
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="mt-4 text-[15.5px] leading-relaxed text-steel">
                The Lead Gen Engine solves exactly these problems — the practical, immediate fix for lead
                generation in your business: managed paid ads, landing pages, CRM and closed-loop reporting,
                run by a team that improves everything daily.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="mt-8">
                <PrimaryCTA placement="lead-gen-engine" />
              </div>
            </FadeIn>
          </div>

          {/* The receipts composite is rendered on the same carbon as the section
              background, so it sits directly on the page with no frame. */}
          <FadeIn delay={0.2} x={24} y={0}>
            <img
              src="/reviews/leadgen-receipts.webp"
              alt="Live campaign receipts on five phones — Meta Ads Manager results, a client's WhatsApp report of 338 leads and 26 sales, and real lead conversations"
              width={1080}
              height={1080}
              loading="lazy"
              className="mx-auto h-auto w-full max-w-[560px]"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
