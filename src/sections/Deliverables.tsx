import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const ROWS = [
  {
    d: 'Attention videos',
    cadence: '16–20 / month',
    purpose: 'Build reach, familiarity and qualified engagement around real proof and buyer-relevant topics.',
  },
  {
    d: 'Retargeting ads',
    cadence: '8–12 / month',
    purpose: 'Move engaged viewers through proof, trust, process clarity, objection handling and direct response.',
  },
  {
    d: 'Winner variations',
    cadence: '4–8 / month',
    purpose: 'Replicate high-performing hooks, formats and messages, changing one major variable at a time.',
  },
  {
    d: 'Meta management',
    cadence: 'Ongoing',
    purpose: 'Build and optimise viewer, engagement, website and high-intent retargeting campaigns.',
  },
  {
    d: 'Publishing',
    cadence: 'Agreed channels',
    purpose: 'Schedule approved organic content across the selected social platforms.',
  },
  {
    d: 'Lead qualification',
    cadence: 'Ongoing',
    purpose: 'Capture required information, score fit and route prospects into the correct appointment flow.',
  },
  {
    d: 'CRM follow-up',
    cadence: 'Ongoing',
    purpose: 'Immediate response, reminders, nurture and quote-follow-up integration where required.',
  },
  {
    d: 'Reporting',
    cadence: 'Monthly',
    purpose: 'Report from attention through qualified appointments, sales outcomes and revenue-winning creative.',
  },
];

const RECEIVES = [
  'A permanent brand and offer context that improves every future asset',
  'A growing library of attention, trust and conversion creative',
  'A segmented audience of people who have already chosen to engage',
  'A documented lead-to-revenue tracking structure',
  'A repeatable monthly operating system — not isolated campaigns',
  'A clear understanding of which content themes create commercial outcomes',
];

export default function Deliverables() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[780px]">
          <FadeIn>
            <Eyebrow>Core Deliverables</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Everything Required to Go From Attention to Revenue —{' '}
              <span className="text-signal">Delivered Every Month</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-[16px] leading-relaxed text-carbon/70">
              One team connecting creative, paid media, automation and revenue attribution — replacing several
              disconnected costs with a single operating system for one core service line and one primary market.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="mt-14 overflow-x-auto">
            <div className="min-w-[720px] border border-carbon/12">
              <div className="grid grid-cols-[1fr_0.7fr_2fr] border-b-2 border-carbon bg-carbon px-6 py-4">
                {['Deliverable', 'Cadence', 'Purpose'].map((h) => (
                  <p key={h} className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                    {h}
                  </p>
                ))}
              </div>
              {ROWS.map((r, i) => (
                <div
                  key={r.d}
                  className={`grid grid-cols-[1fr_0.7fr_2fr] items-center px-6 py-4 ${
                    i % 2 ? 'bg-cloud' : 'bg-white'
                  } ${i < ROWS.length - 1 ? 'border-b border-carbon/8' : ''}`}
                >
                  <p className="pr-4 font-display text-[14.5px] font-bold text-carbon">{r.d}</p>
                  <p className="pr-4 font-mono text-[12.5px] font-semibold text-action">{r.cadence}</p>
                  <p className="text-[13.5px] leading-relaxed text-carbon/70">{r.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-10">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/50">
              What you receive
            </p>
            <ul className="mt-4 grid gap-x-8 gap-y-2.5 md:grid-cols-2">
              {RECEIVES.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[14px] font-medium text-carbon/80">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-action">
                    <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
