import { useId } from 'react';

interface FinancialNumberFieldProps {
  label: string;
  hint?: string;
  prefix?: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  max: number;
}

export default function FinancialNumberField({ label, hint, prefix, value, onChange, max }: FinancialNumberFieldProps) {
  const id = useId();
  const notSure = value === null || value === undefined;

  return (
    <div className="border border-carbon/15 rounded-lg p-4">
      <label htmlFor={id} className="block text-[14.5px] font-semibold text-carbon">
        {label} <span className="font-normal text-carbon/50">(optional)</span>
      </label>
      {hint && <p className="mt-1 text-[13px] text-carbon/55">{hint}</p>}

      <div className="mt-3 flex items-center gap-3">
        <div className="relative flex-1">
          {prefix && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-carbon/50">
              {prefix}
            </span>
          )}
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={0}
            max={max}
            step="1"
            disabled={notSure}
            value={notSure ? '' : value}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '') return onChange(null);
              const num = Number(raw);
              if (Number.isFinite(num)) onChange(Math.min(Math.max(num, 0), max));
            }}
            className={`h-11 w-full rounded-md border border-carbon/20 bg-white text-[15px] text-carbon outline-none focus:border-signal disabled:bg-cloud disabled:text-carbon/40 ${
              prefix ? 'pl-7 pr-3' : 'px-3'
            }`}
          />
        </div>
        <label className="flex min-h-[44px] flex-shrink-0 cursor-pointer items-center gap-2 text-[13px] text-carbon/60">
          <input
            type="checkbox"
            checked={notSure}
            onChange={(e) => onChange(e.target.checked ? null : 0)}
            className="h-4 w-4 accent-signal"
          />
          Not sure
        </label>
      </div>
    </div>
  );
}
