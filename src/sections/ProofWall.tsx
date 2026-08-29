import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';
import { REVIEW_SHOTS } from '../data/clients';

export default function ProofWall() {
  return (
    <section id="reviews" className="bg-cloud py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[760px]">
          <FadeIn>
            <Eyebrow>Verified Client Feedback</Eyebrow>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="mt-12 columns-1 gap-5 md:columns-2">
            {REVIEW_SHOTS.map((r) => (
              <figure
                key={r.src}
                className="mb-5 break-inside-avoid border border-carbon/12 bg-white p-3 shadow-[0_8px_24px_rgba(11,11,13,0.05)]"
              >
                <img
                  src={r.src}
                  alt={r.alt}
                  width={r.width}
                  height={r.height}
                  loading="lazy"
                  className="h-auto w-full"
                />
                {r.proof && (
                  <img
                    src={r.proof.src}
                    alt={r.proof.alt}
                    width={r.proof.width}
                    height={r.proof.height}
                    loading="lazy"
                    className="mt-3 h-auto w-full"
                  />
                )}
              </figure>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
