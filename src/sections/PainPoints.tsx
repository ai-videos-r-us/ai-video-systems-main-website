import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

const QUOTES = [
  'Most of our best months come from referrals — we can’t turn that up when we need to.',
  'We’re actually good at what we do. Why does getting customers have to be this unpredictable?',
  'We’ve tried agencies before — paid for months, got a report full of clicks, never saw the phone ring more.',
  'Our ads bring leads in, but half of them never even pick up the phone.',
  'I’m still the one filming, posting and chasing leads myself.',
  'Every month feels like we’re starting from zero again.',
] as const;

export default function PainPoints() {
  return (
    <section className="bg-white py-24 md:py-28">
      <div className="mx-auto max-w-[900px] px-5 text-center md:px-8">
        <FadeIn>
          <div className="flex justify-center">
            <Eyebrow>Sound Familiar?</Eyebrow>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mx-auto mt-5 max-w-[720px] font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
            You&rsquo;ve Built a Good Business. Now It&rsquo;s Stuck.
          </h2>
        </FadeIn>

        <div className="mx-auto mt-12 grid max-w-[820px] gap-4 sm:grid-cols-2">
          {QUOTES.map((q, i) => (
            <FadeIn key={q} delay={i * 0.06}>
              <p className="h-full border border-carbon/12 bg-cloud p-6 text-left text-[14.5px] italic leading-relaxed text-carbon/75">
                &ldquo;{q}&rdquo;
              </p>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-12 flex justify-center">
            <PrimaryCTA placement="pain-points" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
