import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

const STEPS = [
  {
    n: '1',
    title: 'Diagnose Your Constraint',
    body:
      'We pull your actual numbers — ad spend, cost per lead, show rate, close rate — and find the one leak costing you the most revenue, before we build anything.',
  },
  {
    n: '2',
    title: 'Content — AI Video Creative',
    body:
      'We turn your proof, expertise and real customer outcomes into AI video your ideal buyers actually watch — scripted, produced and tested, without asking you to film every week.',
  },
  {
    n: '3',
    title: 'Ads — Meta Demand & Retargeting',
    body:
      'We distribute that content through Meta to find out which message creates real demand, then build layered retargeting audiences from everyone who’s already watched, visited or engaged.',
  },
  {
    n: '4',
    title: 'Funnel — Landing Pages & Booking',
    body:
      'A conversion-focused landing page built around your specific offer, with qualification built in — so the right prospects book, and tire-kickers don’t.',
  },
  {
    n: '5',
    title: 'Email — Automated Follow-Up',
    body:
      'Every lead gets a follow-up sequence built around your offer, so prospects don’t go cold in a CRM waiting for a callback — they show up already warm.',
  },
  {
    n: '6',
    title: 'Reporting — Closed-Loop Revenue Tracking',
    body:
      'Every lead tracked from first view to booked call to closed sale, so you always know which content, which ad and which message actually made you money.',
  },
] as const;

export default function SystemBuild() {
  return (
    <section id="system-build" className="bg-cloud py-24 md:py-28">
      <div className="mx-auto max-w-[820px] px-5 md:px-8">
        <div className="text-center">
          <FadeIn>
            <div className="flex justify-center">
              <Eyebrow>What We Build For You</Eyebrow>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="mx-auto mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
              Everything We Build and Run — Installed Around Your Offer
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mx-auto mt-5 max-w-[620px] text-[15.5px] leading-relaxed text-carbon/70">
              We install the full system, then run it for you — creative, distribution, retargeting,
              reporting — so you’re not managing five vendors or learning five new tools.
            </p>
          </FadeIn>
        </div>

        <div className="mt-14 space-y-8">
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.06}>
              <div className="flex gap-5 border-b border-carbon/12 pb-8 last:border-b-0">
                <p className="font-display text-2xl font-extrabold text-carbon/25">{s.n}</p>
                <div>
                  <h3 className="font-display text-lg font-bold leading-snug text-carbon">{s.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-carbon/70">{s.body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5}>
          <div className="mt-14 flex flex-col items-center gap-4">
            <PrimaryCTA placement="system-build" />
            <p className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.16em] text-carbon/50">
              30-Day Money-Back Guarantee
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
