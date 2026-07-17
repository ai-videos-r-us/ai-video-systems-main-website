import { ReactNode } from 'react';

export const AUDIT_URL = 'https://calendly.com/sean_munn/seanspersonallink';

export function PrimaryCTA({
  children = 'Book a Revenue System Audit',
  className = '',
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={AUDIT_URL}
      target="_blank"
      rel="noopener"
      className={`group inline-flex items-center justify-center gap-2 bg-signal px-7 py-4 font-display text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 hover:bg-action hover:shadow-[0_10px_30px_rgba(255,31,31,0.35)] ${className}`}
      style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
    >
      {children}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform duration-200 group-hover:translate-x-1">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

export function SecondaryCTA({
  children,
  href = '#case-studies',
  className = '',
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 border-2 border-carbon px-7 py-4 font-display text-sm font-bold uppercase tracking-wider text-carbon transition-colors duration-200 hover:bg-carbon hover:text-white ${className}`}
      style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
    >
      {children}
    </a>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`inline-flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] ${
        light ? 'text-steel' : 'text-action'
      }`}
    >
      <span className="inline-block h-[2px] w-6 bg-signal" />
      {children}
    </p>
  );
}
