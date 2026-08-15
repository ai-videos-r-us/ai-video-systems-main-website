import { useEffect, useState } from 'react';
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
  {
    q: 'What does this cost?',
    a: "It's priced as a one-time system installation plus ongoing monthly management — not a per-video fee. The investment is anchored to the value of creating additional qualified demand for a business already spending $5k+/month on ads, not to a fixed number of deliverables, and your paid media budget stays separate and remains yours. Exact numbers are confirmed during the Revenue System Audit once we understand your economics.",
  },
  {
    q: 'Do you replace our existing agency or media buyer?',
    a: "No — it's built to sit alongside them. We add the buyer-aware creative, warm-audience retargeting and revenue-feedback layer most agencies aren't scoped to build. The audit maps exactly what sits inside and outside your current agency's remit before anything starts.",
  },
  {
    q: 'Our campaigns already look like they’re performing — why would we need this?',
    a: 'A healthy cost per lead can hide a weak downstream result. Platform dashboards show clicks and leads; they don’t show which message actually produced a qualified appointment or a sale. The audit checks whether your qualified-appointment rate, sales conversion and customer acquisition cost tell the same story as the dashboard — and if they do, this isn’t the right fit.',
  },
  {
    q: 'Why not just increase our ad budget instead?',
    a: 'Increasing spend multiplies whatever is already happening in your funnel — including the leaks. If the constraint is trust, qualification or follow-up rather than traffic volume, more budget just produces more of the same weak conversations at a higher cost. The audit identifies the specific leak so you know whether spend is actually the constraint before you commit more of it.',
  },
  {
    q: 'What if the real problem turns out to be our sales team, not marketing?',
    a: "Then we'll say so. The audit is a diagnosis, not a pitch — if the biggest leak is offer, sales process, follow-up or fulfilment rather than demand, that's the honest read you'll get, and it may mean this isn't the right engagement yet.",
  },
  {
    q: 'How quickly will we see results?',
    a: 'The first 90 days run in three phases: diagnose (days 1–14), launch (days 15–30) and improve (days 31–90) — see the 90-Day Plan above. Early creative and warm-audience campaigns typically launch inside the first month; qualified-appointment and revenue data builds through days 30–90 as winning messages are identified and scaled.',
  },
];

const FAQ_SCHEMA_ID = 'faq-page-schema';

function useFaqSchema() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    };

    let script = document.getElementById(FAQ_SCHEMA_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = FAQ_SCHEMA_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => {
      document.getElementById(FAQ_SCHEMA_ID)?.remove();
    };
  }, []);
}

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  useFaqSchema();

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
