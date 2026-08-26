import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

export default function LeadGenEngine() {
  return (
    <section id="lead-gen-engine" className="clip-angle-both bg-carbon pb-32 pt-32 text-white md:pb-40 md:pt-40">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
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

          <FadeIn delay={0.2} x={30} y={0}>
            <div className="mx-auto flex max-w-[420px] flex-col items-center gap-5">
              <figure className="border border-white/15 bg-white p-2.5">
                <img
                  src="/reviews/review-06.webp"
                  alt="WhatsApp message from a client reporting 338 leads, 26 sales at just under a 17% close rate and trending to 21% overall for the month"
                  width={283}
                  height={608}
                  loading="lazy"
                  className="h-auto w-[240px] md:w-[260px]"
                />
                <figcaption className="px-2 py-2.5 text-center font-mono text-[10.5px] uppercase tracking-wider text-carbon/55">
                  Actual client report · funeral comparison
                </figcaption>
              </figure>
              <div className="grid w-full grid-cols-2 gap-4">
                <div className="border border-white/15 bg-white/[0.04] px-4 py-3.5 text-center">
                  <p className="font-display text-2xl font-extrabold text-white">338</p>
                  <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-steel">Leads in one month</p>
                </div>
                <div className="border border-white/15 bg-white/[0.04] px-4 py-3.5 text-center">
                  <p className="font-display text-2xl font-extrabold text-white">21%</p>
                  <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-steel">Lead-to-sale rate</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
