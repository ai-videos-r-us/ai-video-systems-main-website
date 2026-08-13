import { useState } from 'react';
import { track } from '../analytics';

interface AnalysisRequestFormProps {
  resultToken: string;
}

export default function AnalysisRequestForm({ resultToken }: AnalysisRequestFormProps) {
  const [phone, setPhone] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'phone' | 'email' | 'either'>('either');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/diagnostic/analysis-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultToken, phone: phone || undefined, preferredContactMethod, note: note || undefined }),
      });
      if (!res.ok) throw new Error('request_failed');
      track('diagnostic_analysis_requested');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <p className="mt-4 rounded-md border border-score-ready/30 bg-score-ready/5 px-4 py-3 text-[14px] text-score-ready">
        Thanks — we have your request and will be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block text-[13px] font-semibold text-carbon">
          Phone (optional)
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 h-11 w-full rounded-md border border-carbon/20 bg-white px-3 text-[14.5px] text-carbon outline-none focus:border-signal"
          />
        </label>
        <label className="block text-[13px] font-semibold text-carbon">
          Preferred contact method
          <select
            value={preferredContactMethod}
            onChange={(e) => setPreferredContactMethod(e.target.value as typeof preferredContactMethod)}
            className="mt-1 h-11 w-full rounded-md border border-carbon/20 bg-white px-3 text-[14.5px] text-carbon outline-none focus:border-signal"
          >
            <option value="either">Either</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
          </select>
        </label>
      </div>
      <label className="block text-[13px] font-semibold text-carbon">
        Note (optional)
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-carbon/20 bg-white px-3 py-2 text-[14.5px] text-carbon outline-none focus:border-signal"
        />
      </label>
      {status === 'error' && (
        <p role="alert" className="text-[13px] text-score-critical">
          Something went wrong sending your request — please try again.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="min-h-[44px] bg-signal px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white hover:bg-action disabled:opacity-60"
        style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
      >
        {status === 'submitting' ? 'Sending…' : 'Request the analysis'}
      </button>
    </form>
  );
}
