import { Suspense, lazy, useEffect, useState } from 'react';
import LeadGate from './LeadGate';

// Lazily imported so the calculator's JavaScript is not even downloaded until the gate
// has been passed. A visitor who never submits never receives it.
const Calculator = lazy(() => import('./Calculator'));

const TOKEN_KEY = 'avs.revenueLeak.token';
const NAME_KEY = 'avs.revenueLeak.name';

type Phase = 'checking' | 'gated' | 'unlocked';

/**
 * Standalone page — deliberately no site Navbar or Footer. A direct-link asset promoted
 * from short-form, not part of the main site journey, and nothing on the site links in.
 *
 * Access is controlled by a server-signed token issued only after a lead is captured.
 * Editing sessionStorage does not work: the token is HMAC-signed server-side and
 * revalidated on every page load.
 */
export default function RevenueLeakPage() {
  const [phase, setPhase] = useState<Phase>('checking');
  const [firstName, setFirstName] = useState<string | undefined>();

  useEffect(() => {
    document.title = 'Revenue Leak Calculator — AI Video Systems';

    let cancelled = false;
    let token: string | null = null;
    try {
      token = sessionStorage.getItem(TOKEN_KEY);
    } catch {
      // Storage unavailable (private browsing) — the visitor simply re-enters details.
    }

    if (!token) {
      setPhase('gated');
      return;
    }

    (async () => {
      try {
        const response = await fetch('/api/leads/verify-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: token }),
        });
        const data = (await response.json().catch(() => null)) as { valid?: boolean } | null;
        if (cancelled) return;

        if (response.ok && data?.valid) {
          try {
            setFirstName(sessionStorage.getItem(NAME_KEY) ?? undefined);
          } catch {
            /* non-fatal */
          }
          setPhase('unlocked');
        } else {
          clearStored();
          setPhase('gated');
        }
      } catch {
        // Cannot reach the server to confirm — fail closed rather than open.
        if (!cancelled) setPhase('gated');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function clearStored() {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(NAME_KEY);
    } catch {
      /* non-fatal */
    }
  }

  function handleUnlock(name: string, accessToken: string) {
    try {
      sessionStorage.setItem(TOKEN_KEY, accessToken);
      sessionStorage.setItem(NAME_KEY, name);
    } catch {
      // Non-fatal: this session still unlocks, it just won't survive a refresh.
    }
    setFirstName(name);
    setPhase('unlocked');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  return (
    <main className="min-h-screen bg-cloud" style={{ overflowX: 'clip' }}>
      <div className="border-b border-carbon/10 bg-white">
        <div className="mx-auto flex max-w-[1240px] items-center px-5 py-4 md:px-8">
          <img src="/brand/avs-full-logo-black.svg" alt="AI Video Systems" className="h-9 w-auto md:h-10" />
        </div>
      </div>

      {phase === 'checking' && (
        <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-carbon/40">Checking access…</p>
        </div>
      )}

      {phase === 'gated' && <LeadGate onUnlock={handleUnlock} />}

      {phase === 'unlocked' && (
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-carbon/40">Opening the calculator…</p>
            </div>
          }
        >
          <Calculator firstName={firstName} />
        </Suspense>
      )}
    </main>
  );
}
