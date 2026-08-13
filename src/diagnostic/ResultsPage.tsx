import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ResultsView from './components/ResultsView';
import DiagnosticHeader from './components/DiagnosticHeader';
import type { PublicResult } from '../../lib/diagnostic/serialize';

interface ResultsApiResponse {
  firstName: string;
  result: PublicResult;
  ctaUrl?: string;
}

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: ResultsApiResponse };

export default function ResultsPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    document.title = 'Your Scale Readiness Result | AI Video Systems';
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    fetch(`/api/diagnostic/results/${encodeURIComponent(token)}`)
      .then((res) => {
        if (!res.ok) throw new Error('not_found');
        return res.json();
      })
      .then((data: ResultsApiResponse) => {
        if (!cancelled) setState({ status: 'ready', data });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="min-h-screen bg-white">
      <DiagnosticHeader showExit />

      {state.status === 'loading' && (
        <div className="mx-auto max-w-[720px] px-5 py-24 text-center text-carbon/50">Loading your result…</div>
      )}

      {state.status === 'error' && (
        <div className="mx-auto max-w-[560px] px-5 py-24 text-center">
          <h1 className="font-display text-xl font-bold text-carbon">We could not find that result</h1>
          <p className="mt-3 text-[14.5px] text-carbon/60">
            This link may have expired or been typed incorrectly. If you believe this is an error, please contact us
            at <a href="mailto:hello@aivideosystems.com" className="text-action underline">hello@aivideosystems.com</a>.
          </p>
        </div>
      )}

      {state.status === 'ready' && (
        <ResultsView firstName={state.data.firstName} result={state.data.result} ctaUrl={state.data.ctaUrl} resultToken={token} />
      )}
    </div>
  );
}
