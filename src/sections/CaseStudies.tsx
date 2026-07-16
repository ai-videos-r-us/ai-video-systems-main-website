import FadeIn from '../components/FadeIn';
import CountUp from '../components/CountUp';
import { Eyebrow } from '../components/CTA';

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-action">
      <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const INDUSTRIES = [
  'Mortgages and financial services',
  'Bathroom design and fitting',
  'Exterior cleaning',
  'Funeral services',
  'Specialist service businesses',
];

const CRED = [
  'Thousands of appointments generated',
  'More than $8M in client results',
  'Lead generation and sales automation experience',
  'Creative, advertising and appointment infrastructure under one system',
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[720px]">
          <FadeIn>
            <Eyebrow>From Watch Time to Pipeline</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Proof That Attention Can Become Enquiries
            </h2>
          </FadeIn>
        </div>

        {/* Featured: Ironclad */}
        <FadeIn delay={0.15}>
          <article className="mt-14 grid overflow-hidden border-2 border-carbon lg:grid-cols-[1fr_1.1fr]">
            <div className="relative min-h-[280px] bg-carbon">
              <img
                src="/assets/ironclad-finance.png"
                alt="Ironclad Finance AI video content"
                className="absolute inset-0 h-full w-full object-cover opacity-85"
              />
              <span className="absolute left-4 top-4 bg-signal px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-white">
                Featured case study
              </span>
            </div>
            <div className="p-8 md:p-12">
              <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-carbon/50">
                Ironclad Finance · Mortgages
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.4rem,2.6vw,2.1rem)] font-extrabold leading-tight text-carbon">
                <span className="text-signal">
                  <CountUp to={2.2} decimals={1} suffix="M+" /> Views
                </span>{' '}
                and 37 Inbound Enquiries in Approximately Three Weeks
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-carbon/70">
                AI-assisted mortgage content transformed the company&rsquo;s expertise into videos designed around
                real customer questions, concerns and buying decisions.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4 border-t-2 border-carbon pt-5">
                <div>
                  <p className="font-display text-2xl font-extrabold text-carbon">2.2M+</p>
                  <p className="font-mono text-[10.5px] uppercase tracking-wider text-carbon/55">video views</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-carbon">1,900+</p>
                  <p className="font-mono text-[10.5px] uppercase tracking-wider text-carbon/55">new followers</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-signal">37</p>
                  <p className="font-mono text-[10.5px] uppercase tracking-wider text-carbon/55">inbound enquiries</p>
                </div>
              </div>
              <p className="mt-4 flex items-start gap-2.5 text-[13.5px] text-carbon/65">
                <Check /> A growing warm audience for future retargeting
              </p>
              <a href="#resources" className="mt-6 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-action hover:text-signal">
                View the Ironclad Case Study
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>
          </article>
        </FadeIn>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Mortgage Fit */}
          <FadeIn delay={0.1}>
            <article className="flex h-full flex-col border border-carbon/15">
              <div className="relative h-44 overflow-hidden bg-carbon">
                <img src="/assets/mortgage-fit.png" alt="Mortgage Fit" className="h-full w-full object-cover opacity-85" />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/50">Mortgage Fit</p>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug text-carbon">
                  Turning Educational Mortgage Content Into Inbound Demand
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-carbon/65">
                  A consistent AI-video strategy helped the company build attention and create new enquiry
                  opportunities without relying on daily founder filming.
                </p>
                <ul className="mt-4 space-y-2 text-[13px] text-carbon/75">
                  <li className="flex items-start gap-2"><Check /> Hundreds of thousands of views</li>
                  <li className="flex items-start gap-2"><Check /> 20+ leads within approximately five weeks</li>
                  <li className="flex items-start gap-2"><Check /> A reusable library of mortgage content</li>
                </ul>
                <a href="#resources" className="mt-auto inline-flex items-center gap-2 pt-5 font-display text-[13px] font-bold uppercase tracking-wider text-action hover:text-signal">
                  View Project
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </a>
              </div>
            </article>
          </FadeIn>

          {/* Cross-industry */}
          <FadeIn delay={0.2}>
            <article id="industries" className="flex h-full flex-col border border-carbon/15 bg-cloud p-7">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/50">Cross-industry results</p>
              <h3 className="mt-2 font-display text-lg font-bold leading-snug text-carbon">
                More Than <span className="text-signal">10 Million</span> Video Views Generated
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-carbon/65">Mechanisms have been developed across:</p>
              <ul className="mt-4 space-y-2 text-[13px] text-carbon/75">
                {INDUSTRIES.map((ind) => (
                  <li key={ind} className="flex items-start gap-2"><Check /> {ind}</li>
                ))}
              </ul>
              <a href="#resources" className="mt-auto inline-flex items-center gap-2 pt-5 font-display text-[13px] font-bold uppercase tracking-wider text-action hover:text-signal">
                Explore Industries
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </article>
          </FadeIn>

          {/* Broader experience */}
          <FadeIn delay={0.3}>
            <article className="flex h-full flex-col border-2 border-carbon bg-carbon p-7 text-white">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-steel">Broader acquisition experience</p>
              <h3 className="mt-2 font-display text-lg font-bold leading-snug">More Than AI Video Production</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-steel">
                AI Video Systems is built on more than six years of experience across lead generation, appointment
                setting, paid media, CRM automation and sales systems.
              </p>
              <ul className="mt-4 space-y-2 text-[13px] text-white/85">
                {CRED.map((c) => (
                  <li key={c} className="flex items-start gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0 text-signal">
                      <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {c}
                  </li>
                ))}
              </ul>
              <a href="#resources" className="mt-auto inline-flex items-center gap-2 pt-5 font-display text-[13px] font-bold uppercase tracking-wider text-signal hover:text-white">
                About AI Video Systems
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </article>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
