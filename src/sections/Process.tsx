import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const STEPS = [
  {
    n: '01',
    name: 'Demand Audit',
    input: ['Current offer', 'Advertising spend', 'Existing creative', 'Lead quality', 'Close rates', 'Customer economics', 'Sales process'],
    output: 'A clear understanding of where attention, trust, qualification and tracking are breaking down.',
    deliverable: 'Demand Strategy and Performance Baseline',
  },
  {
    n: '02',
    name: 'Messaging and Proof Extraction',
    input: ['Reviews', 'Customer stories', 'Sales recordings', 'CRM notes', 'FAQs', 'Objections', 'Founder expertise', 'Completed work'],
    output: 'A buyer-psychology map covering problems, objections, proof, awareness stages and sales arguments.',
    deliverable: 'Messaging Framework, Proof Library and Content Architecture',
  },
  {
    n: '03',
    name: 'AI Video Production',
    input: ['Approved messaging framework', 'Brand rules', 'Content strategy'],
    output: 'The first complete batch of attention and retargeting creative — 16–20 attention videos, 8–12 retargeting ads and 4–8 controlled winner variations each month.',
    deliverable: 'Campaign-Ready AI Video Library',
  },
  {
    n: '04',
    name: 'Launch the System',
    input: ['Approved creative', 'Advertising access', 'CRM access', 'Qualification requirements'],
    output: 'Organic content publishing, warm-audience campaigns, lead qualification and appointment routing go live.',
    deliverable: 'Active Watcher-to-Appointment Infrastructure',
  },
  {
    n: '05',
    name: 'Optimise and Scale',
    input: ['Watch behaviour', 'Engagement', 'Enquiries', 'Appointments', 'Quotes', 'Sales', 'Revenue'],
    output: 'Weak creative is replaced, winning messages are expanded and budget is directed towards proven commercial outcomes.',
    deliverable: 'Revenue-Winner Report and Monthly Replication Plan',
  },
];

export default function Process() {
  return (
    <section id="how-it-works" className="bg-cloud py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[720px]">
          <FadeIn>
            <Eyebrow>Installation and Optimisation</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Your AI Video Demand System <span className="text-signal">Installed in 90 Days</span>
            </h2>
          </FadeIn>
        </div>

        <div className="relative mt-16">
          <div className="signal-track absolute bottom-4 left-[22px] top-4 w-[2px] bg-signal/25 md:left-[30px]">
            <span className="signal-dot signal-dot--v" style={{ animationDuration: '4.5s' }} />
          </div>

          <div className="space-y-10">
            {STEPS.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.05}>
                <div className="relative pl-16 md:pl-24">
                  <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center bg-carbon font-mono text-sm font-semibold text-white md:h-[60px] md:w-[60px] md:text-base"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
                  >
                    {s.n}
                  </span>
                  <div className="border border-carbon/12 bg-white p-6 md:p-8">
                    <h3 className="font-display text-xl font-bold text-carbon">
                      Step {parseInt(s.n, 10)}: {s.name}
                    </h3>
                    <div className="mt-5 grid gap-6 md:grid-cols-[1fr_1fr_auto] md:gap-8">
                      <div>
                        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-carbon/45">Input</p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {s.input.map((inp) => (
                            <span key={inp} className="border border-carbon/12 bg-cloud px-2 py-1 font-mono text-[10.5px] text-carbon/70">
                              {inp}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-carbon/45">Output</p>
                        <p className="mt-2.5 text-[13.5px] leading-relaxed text-carbon/70">{s.output}</p>
                      </div>
                      <div className="md:max-w-[220px]">
                        <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.16em] text-carbon/45">Deliverable</p>
                        <p className="mt-2.5 border-l-4 border-signal bg-signal/5 px-3 py-2.5 text-[13px] font-bold leading-snug text-carbon">
                          {s.deliverable}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
