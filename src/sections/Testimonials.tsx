import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const TESTIMONIALS = [
  {
    initials: 'JS',
    name: 'Jack Smith',
    business: 'Compare Funerals LTD',
    industry: 'Funeral services',
    result: 'Lead quality above expectations',
    quote:
      'Over the moon with the service from Sean. Lead quality is well above what we expected, communication is great and dedication to our cause is fantastic. The quality of our leads has helped us turn a massive corner in our business.',
  },
  {
    initials: 'DW',
    name: 'Dave Wiltsher',
    business: 'Specialist Finance',
    industry: 'Bridging & commercial finance',
    result: 'A long-term acquisition partner',
    quote:
      'Sean is nothing but professional. His ideas for the business and his collaborative approach with his clients sets him heads and tails above most marketers. Looking forward to working with Sean for a long time.',
  },
  {
    initials: 'SC',
    name: 'Sam Curtis',
    business: 'Partner',
    industry: 'Professional services',
    result: 'More booked appointments with less chasing',
    quote:
      'The system of having booked appointments is fantastic and saves a lot of time chasing people. Very happy with the service and have recommended to colleagues.',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[720px]">
          <FadeIn>
            <Eyebrow>Verified Client Feedback</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.7rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-carbon">
              What Clients Say About the Commercial Result
            </h2>
          </FadeIn>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}>
              <figure className="h-full border border-carbon/12 bg-cloud p-6">
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
    </section>
  );
}
