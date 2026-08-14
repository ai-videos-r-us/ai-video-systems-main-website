import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const BULLETS = [
  'More qualified sales opportunities from the demand you already create',
  'Better-prepared prospects who understand your value',
  'Less sales time wasted rebuilding trust from scratch',
  'A continuous supply of sales creative without weekly filming',
  'Clearer visibility into which messages create appointments and revenue',
];

export default function Outcome() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[780px]">
          <FadeIn>
            <Eyebrow>What Changes</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              More of the Right Buyers <span className="text-signal">Arrive Ready to Talk</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-[16px] leading-relaxed text-carbon/70">
              We turn the proof already inside your business — reviews, customer outcomes, sales conversations and
              case studies — into messages that prepare buyers before the call and improve the path from first
              impression to closed revenue.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.25}>
          <ul className="mt-12 grid max-w-[900px] gap-x-8 gap-y-3 md:grid-cols-2">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-[15px] font-medium leading-snug text-carbon/85">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-action">
                  <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
