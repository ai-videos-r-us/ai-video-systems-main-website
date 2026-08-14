import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const FAQS = [
  {
    q: 'Does this replace our paid advertising or media buyer?',
    a: 'No. It strengthens an existing acquisition operation by adding a continuous creative, warm-audience and measurement layer. Confirm the exact scope during the audit.',
  },
  {
    q: 'We already post content. How is this different?',
    a: 'Posting is an activity. This connects buyer-led content to retargeting, qualification, follow-up and revenue measurement so the business can identify and repeat what produces sales.',
  },
  {
    q: 'Will the AI-assisted videos look fake or damage the brand?',
    a: 'Every system uses brand rules, factual guardrails and human approval. No content is published without approval, and generated visuals must never be presented as real customer proof.',
  },
  {
    q: 'Can this work with a specialist audience?',
    a: 'Relevance matters more in a narrow market. The messages are built from the specific problems, proof, objections and buying decisions inside that market. Fit still depends on audience size and unit economics, which are reviewed in the audit.',
  },
  {
    q: 'How does the 90-day guarantee work?',
    a: "Make back 100% of your fee in attributable new revenue within 90 days, or receive a refund. It applies while eligibility conditions are met: the agreed ad budget stays active, access and approvals are supplied on time, leads are contacted within the agreed response standard, and outcomes are recorded accurately in the CRM.",
  },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-cloud py-24 md:py-32">
      <div className="mx-auto max-w-[820px] px-5 md:px-8">
        <FadeIn>
          <Eyebrow>Questions Established Operators Ask</Eyebrow>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
            Frequently Asked Questions
          </h2>
        </FadeIn>

        <div className="mt-10">
          {FAQS.map((f, i) => {
            const open = openIdx === i;
            return (
              <FadeIn key={f.q} delay={i * 0.04}>
                <div className={`border-b border-carbon/12 ${open ? 'bg-white' : ''}`}>
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
    </section>
  );
}
