import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const TESTIMONIALS = [
  {
    initials: 'JS',
    name: 'Jack Smith',
    business: 'Compare Funerals LTD',
    industry: 'Funeral services',
    result: 'Lead quality well above expectations',
    quote:
      'Over the moon with the service from Sean. Lead quality is well above what we expected, communication is great and dedication to our cause is fantastic. The quality of our leads has helped us turn a massive corner in our business.',
  },
  {
    initials: 'DW',
    name: 'Dave Wiltsher',
    business: 'Specialist Finance',
    industry: 'Bridging & commercial finance',
    result: 'Long-term acquisition partner',
    quote:
      'Sean is nothing but professional. His ideas for the business and his collaborative approach with his clients sets him heads and tails above most marketers. Looking forward to working with Sean for a long time.',
  },
  {
    initials: 'SC',
    name: 'Sam Curtis',
    business: 'Partner',
    industry: 'Professional services',
    result: 'Booked appointments, less chasing',
    quote:
      'The system of having booked appointments is fantastic and saves a lot of time chasing people. Very happy with the service and have recommended to colleagues.',
  },
];

const FAQS = [
  {
    q: 'We already run paid advertising. Does this replace it?',
    a: 'No. The system strengthens an existing advertising operation by creating more proof-led creative and a warm audience that can be developed before receiving a direct offer.',
  },
  {
    q: 'We already post content. How is this different?',
    a: 'Posting content is not the same as building a measurable Watcher-to-Appointment Loop. The difference is audience segmentation, retargeting, qualification, attribution and winner replication.',
  },
  {
    q: 'Will the AI videos look fake?',
    a: 'Every system includes brand rules, factual guardrails and human approval. Real customer outcomes, generated visuals and illustrative content are classified separately so the videos do not invent or misrepresent proof.',
  },
  {
    q: 'We need leads, not followers.',
    a: 'Followers and views are not the final objective. Attention is used as the entry point into retargeting, qualification and appointment generation.',
  },
  {
    q: 'Our target audience is very specific. Will this still work?',
    a: 'A specialised audience makes relevance more important. The videos and retargeting messages are built around the exact buyer problem, service, objections and proof inside your market.',
  },
  {
    q: 'Why not simply increase our cold advertising budget?',
    a: 'You can continue using cold advertising, but increasing spend without improving creative and building warm audiences places more pressure on every impression. This adds a compounding acquisition layer rather than continually resetting with cold prospects.',
  },
  {
    q: 'What happens during the first 90 days?',
    a: 'We extract your offer and buyer psychology, build the initial video library, install the warm-audience campaigns, connect qualification and tracking, and complete the first commercial optimisation cycle.',
  },
  {
    q: 'Do you guarantee leads or sales?',
    a: 'No credible partner can control your market, sales team, offer, fulfilment or advertising platform. The 90-Day Launch Assurance guarantees that the agreed creative engine, retargeting structure, lead-routing workflow and tracking system will be installed and operational.',
  },
];

export default function TestimonialsFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="resources" className="bg-white py-24 md:py-32">
      <div className="mx-auto grid max-w-[1360px] gap-16 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <FadeIn>
            <Eyebrow>Verified Client Feedback</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.7rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-carbon">
              What Clients Say After the System Goes Live
            </h2>
          </FadeIn>

          <div className="mt-10 space-y-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.08}>
                <figure className="border border-carbon/12 bg-cloud p-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center bg-carbon font-display text-sm font-bold text-white">
                      {t.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14.5px] font-bold text-carbon">{t.name}</p>
                      <p className="truncate font-mono text-[11px] text-carbon/55">
                        {t.business} · {t.industry}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 inline-block border-l-4 border-signal bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-carbon">
                    {t.result}
                  </p>
                  <blockquote className="mt-3 text-[14px] leading-relaxed text-carbon/70">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                </figure>
              </FadeIn>
            ))}
          </div>
        </div>

        <div>
          <FadeIn>
            <Eyebrow>Questions Established Operators Ask</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.7rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-carbon">
              Frequently Asked Questions
            </h2>
          </FadeIn>

          <div className="mt-10">
            {FAQS.map((f, i) => {
              const open = openIdx === i;
              return (
                <FadeIn key={f.q} delay={i * 0.04}>
                  <div className={`border-b border-carbon/12 ${open ? 'bg-cloud' : ''}`}>
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? null : i)}
                      className="flex w-full items-center justify-between gap-6 px-2 py-5 text-left"
                      aria-expanded={open}
                    >
                      <span className="font-display text-[15.5px] font-bold text-carbon">{f.q}</span>
                      <span className={`relative h-5 w-5 flex-shrink-0 text-action transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
                        <span className="absolute left-1/2 top-1/2 h-[2.5px] w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
                        <span className="absolute left-1/2 top-1/2 h-4 w-[2.5px] -translate-x-1/2 -translate-y-1/2 bg-current" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="px-2 pb-5 text-[14px] leading-relaxed text-carbon/70">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
