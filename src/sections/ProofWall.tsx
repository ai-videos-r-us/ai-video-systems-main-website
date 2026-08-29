import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';
import { REVIEW_SHOTS, ReviewShot } from '../data/clients';

function ReviewCard({ shot }: { shot: ReviewShot }) {
  return (
    <figure className="break-inside-avoid border border-carbon/12 bg-white p-3 shadow-[0_8px_24px_rgba(11,11,13,0.05)]">
      <img
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        loading="lazy"
        className="h-auto w-full"
      />
      {shot.proof && (
        <img
          src={shot.proof.src}
          alt={shot.proof.alt}
          width={shot.proof.width}
          height={shot.proof.height}
          loading="lazy"
          className="mt-3 h-auto w-full"
        />
      )}
    </figure>
  );
}

// Deterministic placement (CSS multi-columns rebalance as cards are added):
// alternating split keeps the two proof-backed reviews at the top of each
// desktop column, with the remaining reviews flowing beneath them in order.
const LEFT_COLUMN = REVIEW_SHOTS.filter((_, i) => i % 2 === 0);
const RIGHT_COLUMN = REVIEW_SHOTS.filter((_, i) => i % 2 === 1);

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
          {/* Mobile: one column in reading order. */}
          <div className="mt-12 flex flex-col gap-5 md:hidden">
            {REVIEW_SHOTS.map((r) => (
              <ReviewCard key={r.src} shot={r} />
            ))}
          </div>

          {/* Desktop: two independently stacked columns. */}
          <div className="mt-12 hidden gap-5 md:grid md:grid-cols-2 md:items-start">
            {[LEFT_COLUMN, RIGHT_COLUMN].map((column, c) => (
              <div key={c} className="flex flex-col gap-5">
                {column.map((r) => (
                  <ReviewCard key={r.src} shot={r} />
                ))}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
