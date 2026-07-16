import { AUDIT_URL } from '../components/CTA';

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Quick Links',
    links: [
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'The System', href: '#system' },
      { label: 'Case Studies', href: '#case-studies' },
      { label: 'Industries', href: '#industries' },
      { label: 'About', href: '#resources' },
      { label: 'Contact', href: 'mailto:hello@aivideosystems.com' },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'AI Organic Video Engine', href: '#system' },
      { label: 'Watcher Retargeting', href: '#system' },
      { label: 'Lead Qualification', href: '#system' },
      { label: 'CRM Follow-Up', href: '#system' },
      { label: 'Revenue Intelligence', href: '#system' },
    ],
  },
  {
    heading: 'Industries',
    links: [
      { label: 'Home Improvement', href: '#industries' },
      { label: 'Financial Services', href: '#industries' },
      { label: 'Professional Services', href: '#industries' },
      { label: 'Healthcare', href: '#industries' },
      { label: 'Premium Local Services', href: '#industries' },
      { label: 'Specialist B2B Services', href: '#industries' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Case Studies', href: '#case-studies' },
      { label: 'Insights', href: '#resources' },
      { label: 'AI Video Guides', href: '#resources' },
      { label: 'Demand System Audit', href: AUDIT_URL },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms and Conditions', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  },
];

const SOCIAL = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com' },
  { label: 'Facebook', href: 'https://www.facebook.com' },
  { label: 'Instagram', href: 'https://www.instagram.com' },
  { label: 'YouTube', href: 'https://www.youtube.com' },
];

export default function Footer() {
  return (
    <footer className="clip-angle-top bg-carbon pb-10 pt-28 text-white">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <img src="/brand/avs-full-logo-white.svg" alt="AI Video Systems" className="h-12 w-auto" />
            <p className="mt-5 max-w-[300px] text-[14.5px] leading-relaxed text-steel">
              Your done-for-you AI video team that turns viewers into enquiries.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="border border-white/15 px-3 py-1.5 font-mono text-[11px] text-steel transition-colors hover:border-signal hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-1.5 font-mono text-[12px] text-steel">
              <p>
                <a href="mailto:hello@aivideosystems.com" className="hover:text-white">hello@aivideosystems.com</a>
              </p>
              <p>
                <a href={AUDIT_URL} target="_blank" rel="noopener" className="text-signal hover:text-white">
                  Book via our calendar →
                </a>
              </p>
              <p>AI Video Systems Ltd</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  {col.heading}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}
                        className="text-[13px] text-steel transition-colors hover:text-white"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 md:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            From Watch Time to Pipeline. <span className="text-signal">From Signal to Sales.</span>
          </p>
          <p className="font-mono text-[11px] text-white/30">
            © {new Date().getFullYear()} AI Video Systems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
