import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const CARDS = [
  {
    tag: 'The Call',
    heading: 'Show Up. Get Value. No Pitch Required.',
    body:
      'One 20-minute call, free. If we’re not a fit, you still leave knowing exactly where your biggest leak is and what we’d fix first.',
  },
  {
    tag: 'The First 30 Days',
    heading: '30-Day Money-Back Guarantee',
    body:
      'Qualify as a client and your first 30 days are risk-free — not right for any reason, you get your money back. Ad spend and third-party software excluded.',
  },
] as const;

export default function RiskReversal() {
  return (
    <section className="bg-cloud py-20 md:py-24">
      <div className="mx-auto max-w-[1100px] px-5 md:px-8">
        <div className="mx-auto max-w-[640px] text-center">
          <FadeIn>
            <div className="flex justify-center">
              <Eyebrow>Two Layers of Risk Reversal</Eyebrow>
            </div>
          </FadeIn>
        </div>

        <div className="mx-auto mt-10 grid max-w-[900px] gap-5 sm:grid-cols-2">
          {CARDS.map((c, i) => (
            <FadeIn key={c.tag} delay={i * 0.1}>
              <div className="h-full border border-carbon/15 bg-white p-8">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal">
                  {c.tag}
                </p>
                <h3 className="mt-4 font-display text-xl font-bold leading-snug text-carbon">{c.heading}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-carbon/70">{c.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
