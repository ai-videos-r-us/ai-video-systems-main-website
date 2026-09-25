import { AUDIT_URL, trackAuditCtaClick } from '../components/CTA';

const QUICK_LINKS = [
  { label: 'What We Build', href: '#system-build' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Revenue Leak Calculator', href: '/revenue-leak-calculator' },
  { label: 'About Sean', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: 'mailto:sean@aivideosystems.org' },
];

const SERVICE_LINKS = [
  { label: 'Meta Ads Lead Generation', href: '/meta-ads-lead-generation' },
  { label: 'Qualified Lead Generation', href: '/qualified-lead-generation' },
  { label: 'Video Lead Generation', href: '/video-lead-generation' },
  { label: 'Funeral Home Lead Generation', href: '/lead-generation-for-funeral-homes' },
  { label: 'Mortgage Broker Lead Generation', href: '/mortgage-broker-lead-generation' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="clip-angle-top bg-carbon pb-10 pt-28 text-white">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.7fr]">
          <div>
            <img src="/brand/avs-full-logo-white.svg" alt="AI Video Systems" className="h-12 w-auto" />
            <p className="mt-5 max-w-[340px] text-[14.5px] leading-relaxed text-steel">
              AI Video Systems is a done-for-you lead generation system for established service businesses —
              content, ads, funnel and email marketing, installed and run for ROI they can see, backed by
              receipts.
            </p>
            <div className="mt-6 space-y-1.5 font-mono text-[12px] text-steel">
              <p>
                <a href="mailto:sean@aivideosystems.org" className="hover:text-white">sean@aivideosystems.org</a>
              </p>
              <p>
                <a
                  href={AUDIT_URL}
                  target="_blank"
                  rel="noopener"
                  onClick={() => trackAuditCtaClick('footer')}
                  className="text-signal hover:text-white"
                >
                  Book A Free Call →
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
              Services
            </p>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[13px] text-steel transition-colors hover:text-white">
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
            Done-For-You System · Receipts Included
          </p>
          <p className="font-mono text-[11px] text-white/30" suppressHydrationWarning>
            © {new Date().getFullYear()} AI Video Systems. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
