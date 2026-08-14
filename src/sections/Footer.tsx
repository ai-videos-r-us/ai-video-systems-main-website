import { AUDIT_URL, trackAuditCtaClick } from '../components/CTA';

const QUICK_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: '90-Day Plan', href: '#90-day-plan' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: 'mailto:hello@aivideosystems.com' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="clip-angle-top bg-carbon pb-10 pt-28 text-white">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <img src="/brand/avs-full-logo-white.svg" alt="AI Video Systems" className="h-12 w-auto" />
            <p className="mt-5 max-w-[340px] text-[14.5px] leading-relaxed text-steel">
              AI Video Systems helps established service businesses turn more of their existing demand into
              qualified sales calls and trackable revenue.
            </p>
            <div className="mt-6 space-y-1.5 font-mono text-[12px] text-steel">
              <p>
                <a href="mailto:hello@aivideosystems.com" className="hover:text-white">hello@aivideosystems.com</a>
              </p>
              <p>
                <a
                  href={AUDIT_URL}
                  target="_blank"
                  rel="noopener"
                  onClick={() => trackAuditCtaClick('footer')}
                  className="text-signal hover:text-white"
                >
                  Book a Revenue System Audit →
                </a>
              </p>
              <p>AI Video Systems Ltd</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Quick Links
            </p>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[13px] text-steel transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Legal
            </p>
            <ul className="mt-4 space-y-2.5">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[13px] text-steel transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 md:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            More Qualified Sales Calls From the Ad Spend You Already Have
          </p>
          <p className="font-mono text-[11px] text-white/30">
            © {new Date().getFullYear()} AI Video Systems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
