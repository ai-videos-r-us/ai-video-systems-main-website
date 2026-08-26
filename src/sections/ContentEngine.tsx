import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

const SHOWREEL = [
  { src: '/videos/compare-funerals.mp4', label: 'Compare Funerals' },
  { src: '/videos/novus-digital.mp4', label: 'Novus Digital' },
  { src: '/videos/pn-digital.mp4', label: 'PN Digital' },
];

export default function ContentEngine() {
  return (
    <section id="content-engine" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <FadeIn>
              <Eyebrow>System One</Eyebrow>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
                The AI Content Engine
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-4 font-display text-[17px] font-bold leading-snug text-carbon/85">
                Install the complete AI content, branding and authority marketing programme.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-5 text-[15.5px] leading-relaxed text-carbon/70">
                Want to own your space? Looking to appear and promote yourself better than your competition?
                Want to generate the interest, build the authority and showcase who you truly are — with
                high-quality content for your brand, your social media and your marketing?
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="mt-4 text-[15.5px] leading-relaxed text-carbon/70">
                The AI Content Engine is a unique marketing experience that scales your brand, scales your
                followers and scales your platforms with content — AI content at volume, distributed
                everywhere your buyers look.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="mt-8">
                <PrimaryCTA placement="content-engine" />
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} x={30} y={0}>
            <div className="grid gap-4">
              {SHOWREEL.map((v, i) => (
                <figure
                  key={v.src}
                  className={`relative overflow-hidden border border-carbon/12 bg-carbon ${i === 1 ? 'lg:ml-10' : ''}`}
                >
                  <video
                    src={v.src}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="aspect-[840/472] w-full object-cover"
                  />
                  <figcaption className="absolute bottom-0 left-0 bg-white px-3 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-carbon">
                    {v.label}
                  </figcaption>
                </figure>
              ))}
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-carbon/45">
                Real client creative produced by the engine
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
