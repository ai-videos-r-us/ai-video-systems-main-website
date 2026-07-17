import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

const CONDITIONS = [
  'Maintain the agreed advertising budget and keep the required campaigns active for the full 90 days',
  'Supply required access, proof, assets and approvals within the agreed timelines',
  'Contact every lead within the agreed response-time standard and follow the documented sales process',
  'Record all lead, appointment, sale and revenue outcomes accurately in the agreed CRM',
  'Keep the offer, pricing, service area, fulfilment capacity and sales team materially consistent',
];

export default function Guarantee() {
  return (
    <section className="bg-cloud py-24 md:py-32">
      <div className="mx-auto max-w-[1100px] px-5 md:px-8">
        <div className="border-2 border-signal bg-white p-8 shadow-[0_30px_70px_rgba(255,31,31,0.1)] md:p-14">
          <FadeIn>
            <Eyebrow>90-Day Revenue Guarantee</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-extrabold leading-[1.1] tracking-tight text-carbon">
              Make Back <span className="text-signal">100% of Your Fees</span> in Attributable New Revenue Within 90
              Days — or You Don&rsquo;t Pay
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 max-w-[760px] text-[15.5px] leading-relaxed text-carbon/70">
              If verified attributable revenue has not equalled or exceeded the fees paid to AI Video Systems by day
              90, the fees paid for the initial 90-day period are refunded. Our compensation is aligned with the
              commercial result the Attention-to-Revenue System is built to produce — not with post volume or views.
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="mt-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/50">
                Guarantee eligibility conditions
              </p>
              <ul className="mt-4 grid gap-x-8 gap-y-2.5 md:grid-cols-2">
                {CONDITIONS.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-[13.5px] font-medium text-carbon/75">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-action">
                      <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-mono text-[11px] leading-relaxed text-carbon/45">
                Revenue is counted only when attributable to the system and supported by verifiable sales records.
                Advertising spend and third-party software costs are excluded.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-9">
              <PrimaryCTA />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
