import FadeIn from '../components/FadeIn';
import CountUp from '../components/CountUp';

const STATS = [
  { value: <CountUp to={60} prefix="$" suffix="M+" duration={1.8} />, label: 'Tracked Revenue' },
  { value: <CountUp to={96} suffix="+" duration={1.8} />, label: 'Clients Served' },
  { value: '30-Day', label: 'Money-Back Guarantee' },
] as const;

export default function StatsStrip() {
  return (
    <section className="border-y border-carbon/10 bg-white py-14 md:py-16">
      <div className="mx-auto max-w-[900px] px-5 md:px-8">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:gap-4">
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08}>
              <p className="font-display text-[clamp(2rem,4.5vw,2.6rem)] font-extrabold leading-none tracking-tight text-carbon">
                {s.value}
              </p>
              <p className="mt-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-carbon/50">
                {s.label}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
