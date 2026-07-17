import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AUDIT_URL } from '../components/CTA';

const LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'The System', href: '#system' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'Industries', href: '#industries' },
  { label: 'Resources', href: '#resources' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-carbon/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <a href="#top" className="flex-shrink-0">
          <img src="/brand/avs-full-logo-black.svg" alt="AI Video Systems" className="h-10 w-auto md:h-11" />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13.5px] font-semibold text-carbon transition-colors duration-150 hover:text-action"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={AUDIT_URL}
            target="_blank"
            rel="noopener"
            className="inline-block bg-signal px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-action sm:px-5"
            style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
          >
            Book a Revenue System Audit
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          >
            <span className={`h-[2px] w-5 bg-carbon transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`h-[2px] w-5 bg-carbon transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`h-[2px] w-5 bg-carbon transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-carbon/10 bg-white lg:hidden"
          >
            <div className="flex flex-col px-5 py-4">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-carbon/5 py-3 text-sm font-semibold text-carbon"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
