import { useEffect, useRef } from 'react';
import { NUMERIC_LIMITS } from '../../../lib/diagnostic/constants';
import type { FinancialInputs } from '../../../lib/diagnostic/types';
import FinancialNumberField from './FinancialNumberField';

interface FinancialStepProps {
  group: 'core' | 'extra';
  financial: FinancialInputs;
  onChange: (patch: Partial<FinancialInputs>) => void;
}

const ALIGNMENT_OPTIONS: { id: NonNullable<FinancialInputs['alignment']>; label: string }[] = [
  { id: 'yes', label: 'Yes — the spend, enquiries and plan sales relate to the same source and comparable period/cohort' },
  { id: 'partly', label: 'Partly' },
  { id: 'no', label: 'No' },
  { id: 'not_sure', label: 'Not sure' },
];

export default function FinancialStep({ group, financial, onChange }: FinancialStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [group]);

  if (group === 'core') {
    return (
      <div className="mx-auto w-full max-w-[720px] px-5 py-6 md:px-0">
        <h2 ref={headingRef} tabIndex={-1} className="font-display text-xl font-bold text-carbon outline-none sm:text-2xl">
          A few exact figures improve your financial illustration
        </h2>
        <p className="mt-2 text-[14.5px] text-carbon/60">
          All optional. If you are not sure, leave a field marked "Not sure" — we will not block your result.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FinancialNumberField
            label="Monthly paid-acquisition spend"
            prefix="£"
            max={NUMERIC_LIMITS.monthlySpendGbp.max}
            value={financial.monthlySpendGbp}
            onChange={(v) => onChange({ monthlySpendGbp: v })}
          />
          <FinancialNumberField
            label="Paid enquiries in that same period"
            max={NUMERIC_LIMITS.paidEnquiries.max}
            value={financial.paidEnquiries}
            onChange={(v) => onChange({ paidEnquiries: v })}
          />
          <FinancialNumberField
            label="Completed plan sales from those paid enquiries"
            max={NUMERIC_LIMITS.completedPlans.max}
            value={financial.completedPlans}
            onChange={(v) => onChange({ completedPlans: v })}
          />
          <FinancialNumberField
            label="Average gross contribution per completed plan"
            hint="After direct fulfilment/plan costs, if you can provide it."
            prefix="£"
            max={NUMERIC_LIMITS.contributionPerPlanGbp.max}
            value={financial.contributionPerPlanGbp}
            onChange={(v) => onChange({ contributionPerPlanGbp: v })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 py-6 md:px-0">
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-xl font-bold text-carbon outline-none sm:text-2xl">
        A little more detail
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FinancialNumberField
          label="Unconverted enquiries older than 30 days still eligible for follow-up"
          max={NUMERIC_LIMITS.eligibleAgedEnquiries.max}
          value={financial.eligibleAgedEnquiries}
          onChange={(v) => onChange({ eligibleAgedEnquiries: v })}
        />
        <FinancialNumberField
          label="Additional monthly enquiries your current team could handle"
          hint="Without service deteriorating."
          max={NUMERIC_LIMITS.spareMonthlyCapacity.max}
          value={financial.spareMonthlyCapacity}
          onChange={(v) => onChange({ spareMonthlyCapacity: v })}
        />
      </div>

      <fieldset className="mt-6">
        <legend className="text-[14.5px] font-semibold text-carbon">
          Do the spend, enquiries and plan sales above relate to the same source and comparable period/cohort?
        </legend>
        <div className="mt-3 flex flex-col gap-2.5">
          {ALIGNMENT_OPTIONS.map((option) => {
            const checked = financial.alignment === option.id;
            return (
              <label
                key={option.id}
                className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-[14.5px] transition-colors ${
                  checked ? 'border-signal bg-soft-red text-carbon' : 'border-carbon/15 bg-white text-carbon hover:border-carbon/30'
                }`}
              >
                <input
                  type="radio"
                  name="alignment"
                  checked={checked}
                  onChange={() => onChange({ alignment: option.id })}
                  className="h-4 w-4 flex-shrink-0 accent-signal"
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
