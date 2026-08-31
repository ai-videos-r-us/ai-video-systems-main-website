import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';
import { ARTICLES } from '../data/articles';

export default function Articles() {
  if (ARTICLES.length === 0) return null;

  return (
    <section id="articles" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[760px]">
          <FadeIn>
            <Eyebrow>Latest Articles</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Insights From the Systems We Run
            </h2>
          </FadeIn>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.08}>
              <article className="flex h-full flex-col border border-carbon/12 bg-white p-7 transition-colors duration-200 hover:border-carbon">
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-carbon/45">
                  {a.tag}
                </p>
                <h3 className="mt-4 font-display text-[17px] font-bold leading-snug text-carbon">
                  {a.comingSoon ? a.title : <a href={a.href}>{a.title}</a>}
                </h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-carbon/65">{a.excerpt}</p>
                <p className="mt-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-carbon/45">
                  {a.date}
                  {a.comingSoon ? (
                    <span className="border border-carbon/20 px-2 py-0.5 text-carbon/50">In production</span>
                  ) : (
                    <a href={a.href} className="font-semibold text-carbon hover:text-action">
                      Read →
                    </a>
                  )}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <p className="mt-10">
            <a
              href="/blog"
              className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-carbon transition-colors hover:text-action"
            >
              View all articles →
            </a>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
