import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const SITUATIONS = [
  {
    label: 'Situation One',
    heading: 'You need to look the best — everywhere.',
    body: 'You need the best brand in your marketplace — one that truly represents you. You need to populate every platform, with coverage everywhere and cinematic work that scales and grows your brand. You need your website to represent you. AI can do this for you.',
    linkLabel: 'The AI Content Engine programme is made for you',
    href: '#content-engine',
  },
  {
    label: 'Situation Two',
    heading: 'You need qualified leads — now.',
    body: 'You need qualified leads for your sales team, and you have probably tried everything under the sun: multiple agencies who promised the world, but never a system that actually works — and never real results. You spent and you spent, and you never received the leads you needed. Until now.',
    linkLabel: 'The Lead Gen Engine programme is exactly what you need',
    href: '#lead-gen-engine',
  },
];

export default function TwoSystems() {
  return (
    <section id="systems" className="bg-cloud py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="mx-auto max-w-[780px] text-center">
          <FadeIn>
            <div className="flex justify-center">
              <Eyebrow>Two Complete Systems</Eyebrow>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Two Complete Systems. Two Business-Focused Outcomes.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-[16px] leading-relaxed text-carbon/70">
              You have one of two situations to handle. Thankfully, AI Video Systems can help with both.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {SITUATIONS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <a
                href={s.href}
                className="group flex h-full flex-col border border-carbon/15 bg-white p-8 transition-colors duration-200 hover:border-carbon md:p-10"
              >
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/45">
                  {s.label}
                </p>
                <h3 className="mt-4 font-display text-2xl font-bold leading-snug text-carbon">{s.heading}</h3>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-carbon/70">{s.body}</p>
                <p className="mt-7 inline-flex items-center gap-2 font-display text-[14px] font-bold uppercase tracking-wide text-carbon">
                  {s.linkLabel}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="flex-shrink-0 text-signal transition-transform duration-200 group-hover:translate-y-1"
                  >
                    <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </p>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
