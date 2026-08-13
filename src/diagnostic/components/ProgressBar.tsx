interface ProgressBarProps {
  stepIndex: number;
  totalSteps: number;
  label: string;
}

export default function ProgressBar({ stepIndex, totalSteps, label }: ProgressBarProps) {
  const percent = Math.round(((stepIndex + 1) / totalSteps) * 100);

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pb-2 pt-5 md:px-0">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-carbon/50">
        <span>{label}</span>
        <span>{percent}% complete</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-carbon/10">
        <div
          className="h-full rounded-full bg-signal transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {label}, {percent} percent complete
      </p>
    </div>
  );
}
