import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const BEST_FIT = [
  'An established service business already spending $5,000+ per month on ads',
  'A proven offer with credible proof and healthy customer economics',
  'Enough sales and fulfilment capacity to handle more qualified demand',
  'A team willing to follow up quickly and record commercial outcomes',
];

const NOT_FIT = [
  'Startups still trying to prove the offer',
  'Low-ticket or low-margin services with weak acquisition economics',
  'Businesses looking for cheap batches of AI videos',
  'Teams without the capacity or discipline to follow up and track sales',
];

export default function Fit() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[780px]">
          <FadeIn>
            <Eyebrow>Who This Is For</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Built for Businesses With Something Worth Scaling
            </h2>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <FadeIn x={-30} y={0}>
            <div className="h-full border-2 border-carbon bg-carbon p-8 text-white">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal">
                Best fit
              </p>
              <ul className="mt-6 space-y-3">
                {BEST_FIT.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-[14px] text-white/85">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-white/70">
                      <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn x={30} y={0} delay={0.1}>
            <div className="h-full border border-carbon/15 bg-cloud p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/45">
                Not a fit
              </p>
              <ul className="mt-6 space-y-3">
                {NOT_FIT.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-[14px] text-carbon/60">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-steel">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
