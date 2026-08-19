import { useEffect, useState } from 'react';
import LeadGate from './LeadGate';
import Calculator from './Calculator';

const STORAGE_KEY = 'avs.revenueLeak.unlocked';

/**
 * Standalone page — deliberately no site Navbar or Footer. This is a direct-link asset
 * promoted from short-form, not part of the main site journey, and nothing on the main
 * site links into it.
 *
 * The gate is a conversion device, not a security boundary: the calculator is pure
 * client-side arithmetic, so there is no secret behind it to protect. It exists to make
 * the exchange explicit, and it holds for the overwhelming majority of real visitors.
 */
export default function RevenueLeakPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [firstName, setFirstName] = useState<string | undefined>();

  useEffect(() => {
    document.title = 'Revenue Leak Calculator — AI Video Systems';
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFirstName(stored);
        setUnlocked(true);
      }
    } catch {
      // Private browsing / storage disabled — the visitor just re-enters on refresh.
    }
  }, []);

  function handleUnlock(name: string) {
    try {
      sessionStorage.setItem(STORAGE_KEY, name);
    } catch {
      // Non-fatal: unlocking this session still works, it just won't survive a refresh.
    }
    setFirstName(name);
    setUnlocked(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  return (
    <main className="min-h-screen bg-cloud" style={{ overflowX: 'clip' }}>
      <div className="border-b border-carbon/10 bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center px-5 py-4 md:px-8">
          <img src="/brand/avs-full-logo-black.svg" alt="AI Video Systems" className="h-9 w-auto md:h-10" />
        </div>
      </div>

      {unlocked ? <Calculator firstName={firstName} /> : <LeadGate onUnlock={handleUnlock} />}
    </main>
  );
}
