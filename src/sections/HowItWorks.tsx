import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

const STEPS = [
  {
    n: '01',
    name: 'Find What Already Sells',
    desc: 'We extract the proof, objections, questions and sales arguments that already move buyers inside your business.',
  },
  {
    n: '02',
    name: 'Put It in Front of the Right Buyers',
    desc: 'We turn those messages into accurate, on-brand, AI-assisted videos and use paid distribution and retargeting to prepare prospects before the offer.',
  },
  {
    n: '03',
    name: 'Scale What Creates Revenue',
    desc: 'We connect qualification, follow-up, appointments and sales back to the original creative — then repeat the messages that produce commercial results.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="clip-angle-top bg-carbon pb-24 pt-32 text-white md:pb-32 md:pt-40">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[780px]">
          <FadeIn>
            <Eyebrow light>How It Works</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-white">
              We Fix the Gap Between <span className="text-signal">First Impression and Sales Call</span>
            </h2>
          </FadeIn>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.1} x={0} y={30}>
              <div className="h-full border border-white/12 bg-white/[0.03] p-8">
                <p className="font-mono text-sm font-semibold text-signal">Step {s.n}</p>
                <h3 className="mt-3 font-display text-xl font-bold text-white">{s.name}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-steel">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-16 flex justify-center">
            <PrimaryCTA placement="how-it-works" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
