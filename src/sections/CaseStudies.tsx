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

export default function CaseStudies() {
  return (
    <section id="results" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="max-w-[720px]">
          <FadeIn>
            <Eyebrow>Results</Eyebrow>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Demand You Can Measure Beyond Views
            </h2>
          </FadeIn>
        </div>

        {/* Featured: Ironclad */}
        <FadeIn delay={0.15}>
          <article className="mt-14 grid overflow-hidden border-2 border-carbon lg:grid-cols-[1fr_1.1fr]">
            <div className="relative min-h-[280px] bg-carbon">
              <img
                src="/assets/ironclad-finance.jpg"
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
                <span className="text-signal">37 Inbound Enquiries</span> in Approximately 3 Weeks
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-carbon/70">
                Ironclad Finance used buyer-aware, AI-assisted mortgage content to turn real customer questions and
                buying concerns into sustained attention and inbound demand.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-4 border-t-2 border-carbon pt-5">
                <div>
                  <p className="font-display text-2xl font-extrabold text-signal">37</p>
                  <p className="font-mono text-[10.5px] uppercase tracking-wider text-carbon/55">inbound enquiries</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-carbon">
                    <CountUp to={2.2} decimals={1} suffix="M+" />
                  </p>
                  <p className="font-mono text-[10.5px] uppercase tracking-wider text-carbon/55">video views</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-carbon">1,900+</p>
                  <p className="font-mono text-[10.5px] uppercase tracking-wider text-carbon/55">new followers</p>
                </div>
              </div>
              <p className="mt-4 flex items-start gap-2.5 text-[13.5px] text-carbon/65">
                <Check /> A growing warm audience for future retargeting
              </p>
            </div>
          </article>
        </FadeIn>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Mortgage Fit */}
          <FadeIn delay={0.1}>
            <article className="flex h-full flex-col border border-carbon/15">
              <div className="relative h-44 overflow-hidden bg-carbon">
                <img src="/assets/mortgage-fit.jpg" alt="Mortgage Fit" className="h-full w-full object-cover opacity-85" />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/50">Mortgage Fit</p>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug text-carbon">
                  20+ Leads in Approximately 5 Weeks
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-carbon/65">
                  Mortgage Fit built a reusable library of educational content that created new enquiry
                  opportunities without daily founder filming.
                </p>
                <ul className="mt-4 space-y-2 text-[13px] text-carbon/75">
                  <li className="flex items-start gap-2"><Check /> 20+ leads within approximately five weeks</li>
                  <li className="flex items-start gap-2"><Check /> Hundreds of thousands of views</li>
                  <li className="flex items-start gap-2"><Check /> A reusable library of mortgage content</li>
                </ul>
              </div>
            </article>
          </FadeIn>

          {/* Authority card */}
          <FadeIn delay={0.2}>
            <article className="flex h-full flex-col border-2 border-carbon bg-carbon p-7 text-white">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-steel">Not Just Video Production</p>
              <h3 className="mt-2 font-display text-lg font-bold leading-snug">
                Built on Acquisition Experience, Not Just Video Production
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-steel">
                More than six years across lead generation, paid media, appointment setting, CRM automation and
                sales — with thousands of appointments and more than $12M in reported client results.
              </p>
            </article>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
