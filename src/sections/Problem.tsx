import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const BULLETS = [
  'Leads know the offer but not why they should trust you.',
  'Sales calls are spent educating rather than selling.',
  'Low-context prospects consume follow-up time.',
  'The same small set of ads fatigues faster than it is replaced.',
  'Marketing is judged by leads while the business cares about customers.',
];

export default function Problem() {
  return (
    <section className="bg-cloud py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[780px]">
          <FadeIn>
            <Eyebrow>The Real Leak</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Your Ads Can Be Working While Your <span className="text-signal">Acquisition System Still Leaks</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-[16px] leading-relaxed text-carbon/70">
              A healthy cost per lead can hide an expensive problem. Prospects arrive cold. Sales starts from zero.
              Creative wears out. Reporting stops at the form fill — so nobody knows which message actually caused
              the sale.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.25}>
          <ul className="mt-12 grid max-w-[820px] gap-3">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-start gap-3 border-l-4 border-carbon/15 bg-white px-5 py-4 text-[15px] font-medium leading-snug text-carbon/80">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-1 flex-shrink-0 text-steel">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="mx-auto mt-10 max-w-[820px] border-l-4 border-signal bg-white px-6 py-5 font-display text-[18px] font-bold leading-snug text-carbon">
            Increasing the budget simply pushes more people through the same leaks.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
