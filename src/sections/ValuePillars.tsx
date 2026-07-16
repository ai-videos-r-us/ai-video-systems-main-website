import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const PILLARS = [
  {
    n: '01',
    title: 'Build a Warm Audience',
    body: 'Turn video views, engagement and repeat exposure into a growing audience of people who have voluntarily shown interest.',
  },
  {
    n: '02',
    title: 'Convert Existing Proof Into Creative',
    body: 'Transform customer outcomes, reviews, completed work, expertise and sales arguments into consistent video content.',
  },
  {
    n: '03',
    title: 'Improve Lead Quality',
    body: 'Educate prospects before they enquire so sales conversations begin with more familiarity, context and trust.',
  },
  {
    n: '04',
    title: 'Scale Without Constant Filming',
    body: 'Produce platform-native videos without requiring the owner or team to repeatedly organise shoots.',
  },
  {
    n: '05',
    title: 'Optimise Around Revenue',
    body: 'Identify which hooks, messages, proof and formats create qualified appointments and paying customers—not just views.',
  },
];

export default function ValuePillars() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[720px]">
          <FadeIn>
            <Eyebrow>A Better Way to Scale Acquisition</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Build Trust Before Your Sales Team Ever Speaks to the Prospect
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-[16px] leading-relaxed text-carbon/70">
              The system separates the job of earning attention from the job of converting demand, creating
              better-informed prospects who already recognise your business before they enquire.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <FadeIn key={p.n} delay={i * 0.08} className={i >= 3 ? 'lg:translate-x-[50%]' : ''}>
              <div className="group border-t-2 border-carbon py-8 pr-4 transition-colors duration-200 hover:border-signal">
                <p className="font-mono text-sm font-semibold text-action">{p.n}</p>
                <h3 className="mt-3 font-display text-xl font-bold leading-snug text-carbon">{p.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-carbon/65">{p.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
