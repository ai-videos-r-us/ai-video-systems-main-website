import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const FAQS = [
  {
    q: 'Who do you work with?',
    a: 'Established service businesses already spending $5,000+ per month on ads — professional services, financial services, legal, healthcare, home improvement, property, funeral services and other high-value local or specialist B2B services — with real proof, a working sales process and the capacity to take on more qualified demand. If you are not running paid ads yet, we are not the right fit for you today.',
  },
  {
    q: 'Does this replace our paid advertising or media buyer?',
    a: 'No. It strengthens an existing acquisition operation by adding a continuous creative, warm-audience and measurement layer. Confirm the exact scope on the call.',
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
    a: 'Relevance matters more in a narrow market. The messages are built from the specific problems, proof, objections and buying decisions inside that market. Fit still depends on audience size and unit economics, which are reviewed on the call.',
  },
  {
    q: 'How does the 30-day money-back guarantee work?',
    a: 'Simply: qualify as a client on the call, and your engagement starts with a 30-day money-back guarantee. If you decide within the first 30 days that it isn’t right — for any reason — you get your fee back. Advertising spend and third-party software costs are excluded.',
  },
  {
    q: 'What does this cost?',
    a: "It's priced as a one-time system installation plus ongoing monthly management — not a per-video fee. The investment is anchored to the value of creating additional qualified demand for a business already spending $5k+/month on ads, not to a fixed number of deliverables, and your paid media budget stays separate and remains yours. Exact numbers are confirmed on the call once we understand your economics.",
  },
  {
    q: 'Do you replace our existing agency or media buyer?',
    a: "No — it's built to sit alongside them. We add the buyer-aware creative, warm-audience retargeting and revenue-feedback layer most agencies aren't scoped to build. The call maps exactly what sits inside and outside your current agency's remit before anything starts.",
  },
  {
    q: 'Our campaigns already look like they’re performing — why would we need this?',
    a: 'A healthy cost per lead can hide a weak downstream result. Platform dashboards show clicks and leads; they don’t show which message actually produced a qualified appointment or a sale. The call checks whether your qualified-appointment rate, sales conversion and customer acquisition cost tell the same story as the dashboard — and if they do, this isn’t the right fit.',
  },
  {
    q: 'Why not just increase our ad budget instead?',
    a: 'Increasing spend multiplies whatever is already happening in your funnel — including the leaks. If the constraint is trust, qualification or follow-up rather than traffic volume, more budget just produces more of the same weak conversations at a higher cost. The call identifies the specific leak so you know whether spend is actually the constraint before you commit more of it.',
  },
  {
    q: 'What if the real problem turns out to be our sales team, not marketing?',
    a: "Then we'll say so. The call is a diagnosis, not a pitch — if the biggest leak is offer, sales process, follow-up or fulfilment rather than demand, that's the honest read you'll get, and it may mean this isn't the right engagement yet.",
  },
  {
    q: 'How quickly will we see results?',
    a: 'The first weeks are diagnosis and build: creative, campaigns, qualification and tracking typically launch inside the first month. Qualified-appointment and revenue data builds from there as winning messages are identified and scaled — and your first 30 days are covered by the money-back guarantee.',
  },
];

const FAQ_SCHEMA_ID = 'faq-page-schema';

// Shared with src/entry-server.tsx, which emits this schema statically into
// dist/index.html at build time so crawlers get it without running JS.
export function buildFaqSchema() {
  return {
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
}

function useFaqSchema() {
  useEffect(() => {
    const schema = buildFaqSchema();

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
                    <span className={`relative h-5 w-5 flex-shrink-0 text-carbon transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
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
