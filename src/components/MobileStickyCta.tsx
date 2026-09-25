import { useEffect, useState } from 'react';
import { PrimaryCTA } from './CTA';

// Shows a thumb-reachable CTA bar on mobile once the hero (which has its own
// CTA) has scrolled out of view, and hides it again from FinalCta (which has
// its own CTA + secondary link) onward, so it never sits on top of a section
// that already has its own CTA. Driven by a scroll listener rather than
// IntersectionObserver: a large/instant scroll can jump clean past a target
// between two observer samples without ever registering the crossing, which
// leaves an observer-driven boolean stuck — recomputing live geometry on
// every scroll tick can't get stuck that way.
export default function MobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    const finalCta = document.getElementById('final-cta');
    if (!hero || !finalCta) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const heroPassed = hero.getBoundingClientRect().bottom < 0;
      const finalCtaReached = finalCta.getBoundingClientRect().top < window.innerHeight;
      setVisible(heroPassed && !finalCtaReached);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-carbon/10 bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3 shadow-[0_-8px_24px_rgba(11,11,13,0.08)] backdrop-blur-md transition-transform duration-300 lg:hidden ${
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <PrimaryCTA placement="mobile-sticky" className="w-full" />
    </div>
  );
}
