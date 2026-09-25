import FadeIn from '../components/FadeIn';
import { Eyebrow } from '../components/CTA';

const ITEMS = [
  'Diagnose the exact link in your attention-to-revenue chain that’s costing you booked calls',
  'Map out exactly what we’d build for your business, your market and your offer',
  'Show you where your funnel is leaking — using your actual numbers, not industry averages',
];

export default function OnTheCall() {
  return (
    <section className="bg-cloud py-20 md:py-24">
      <div className="mx-auto max-w-[760px] px-5 text-center md:px-8">
        <FadeIn>
          <div className="flex justify-center">
            <Eyebrow>On The Call, We&rsquo;ll</Eyebrow>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ul className="mx-auto mt-8 max-w-[560px] space-y-4 text-left">
            {ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15.5px] leading-relaxed text-carbon/80">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mt-1 flex-shrink-0 text-signal"
                >
                  <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
