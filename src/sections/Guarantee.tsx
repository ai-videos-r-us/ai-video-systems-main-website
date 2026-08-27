import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

export default function Guarantee() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1100px] px-5 md:px-8">
        <div className="border-2 border-signal bg-white p-8 shadow-[0_30px_70px_rgba(11,11,13,0.08)] md:p-14">
          <FadeIn>
            <Eyebrow>30-Day Money-Back Guarantee</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-[1.1] tracking-tight text-carbon">
              Qualify as a Client and Your First 30 Days Are Risk-Free
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-[760px] text-[15.5px] leading-relaxed text-carbon/70">
              Not every business qualifies — one short call decides that before any money changes hands. If
              we take you on, we back the work with a simple promise: if it&rsquo;s not right within your
              first 30 days — for any reason — you get your money back.
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <p className="mt-5 font-mono text-[11px] leading-relaxed text-carbon/45">
              Qualification is decided on the call. Advertising spend and third-party software costs are
              excluded.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-9">
              <PrimaryCTA placement="guarantee" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
