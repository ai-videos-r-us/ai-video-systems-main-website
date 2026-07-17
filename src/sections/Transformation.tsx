import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const STATE_ONE = [
  'Most acquisition begins with cold ads',
  'The market sees the offer before it knows the business',
  'Creative production is inconsistent or dependent on filming',
  'The same small set of ads is repeatedly exhausted',
  'Prospects enquire with low context and high price sensitivity',
  'The sales team educates and builds trust from scratch',
  'Lead quality is judged at form level, not by eventual revenue',
  'Scaling means raising budget into increasingly cold audiences',
];

const STATE_TWO = [
  'A video library that sells for you 24/7 — built from proof you already have',
  'An audience of ideal buyers that grows every week, by their own choice',
  'Prospects see exactly the proof they need to choose you',
  'Enquiries become booked appointments without you chasing anyone',
  'Sales calls start with trust already earned — and close easier',
  'Your budget flows only to the videos that make you money',
  'Winning messages get repeated, so results compound every month',
  'You own an audience and content library that grow more valuable over time',
];

const SECONDARY = [
  'Lower dependence on cold acquisition',
  'Prospects who understand the service before speaking to sales',
  'Reduced price resistance',
  'Consistent platform-native creative without shoots',
  'Visibility into which messages actually produce revenue',
  'A reusable content and audience asset that appreciates',
];

export default function Transformation() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[820px]">
          <FadeIn>
            <Eyebrow>The Way Forward</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Turn Your Business Proof into <span className="text-signal">More Revenue in 90 Days Or Less</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-[16px] leading-relaxed text-carbon/70">
              Without constantly filming or endlessly increasing cold ad spend.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <FadeIn x={-30} y={0}>
            <div className="h-full border border-carbon/15 bg-cloud p-8">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/45">
                State One — where most businesses are stuck
              </p>
              <ul className="mt-6 space-y-3">
                {STATE_ONE.map((s) => (
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

          <FadeIn x={30} y={0} delay={0.1}>
            <div className="h-full border-2 border-carbon bg-carbon p-8 text-white">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal">
                State Two — where the system takes you
              </p>
              <ul className="mt-6 space-y-3">
                {STATE_TWO.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-[14px] text-white/85">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-signal">
                      <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="mt-10 flex flex-wrap gap-2">
            {SECONDARY.map((s) => (
              <span key={s} className="border border-carbon/15 bg-white px-3 py-1.5 font-mono text-[11.5px] text-carbon/70">
                {s}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
