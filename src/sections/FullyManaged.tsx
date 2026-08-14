import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const CATEGORIES = [
  {
    name: 'Message and Creative',
    desc: 'Buyer research, proof extraction, scripting, AI-assisted production and winner variations.',
  },
  {
    name: 'Demand and Retargeting',
    desc: 'Publishing, paid distribution, warm-audience building and objection-led campaigns.',
  },
  {
    name: 'Qualification and Follow-Up',
    desc: 'Landing-page conversion, qualification, CRM routing, reminders and nurture.',
  },
  {
    name: 'Revenue Feedback',
    desc: 'Appointment, sales and revenue tracking tied back to the messages that created them.',
  },
];

export default function FullyManaged() {
  return (
    <section className="bg-cloud py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[780px]">
          <FadeIn>
            <Eyebrow>Fully Managed</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              One Team Across the Entire Path <span className="text-signal">From Message to Revenue</span>
            </h2>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <FadeIn key={c.name} delay={i * 0.06}>
              <div className="h-full border border-carbon/15 bg-white p-6">
                <span className="flex h-9 w-9 items-center justify-center bg-carbon font-mono text-[12px] font-semibold text-white">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-[15px] font-bold leading-snug text-carbon">{c.name}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-carbon/65">{c.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
