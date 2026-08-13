interface WizardNavProps {
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  backLabel?: string;
}

export default function WizardNav({
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled,
  backLabel = 'Back',
}: WizardNavProps) {
  return (
    <div className="mx-auto flex w-full max-w-[720px] items-center justify-between gap-4 px-5 pb-10 pt-2 md:px-0">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-4 py-2 text-sm font-semibold text-carbon/70 transition-colors hover:text-carbon"
        >
          ← {backLabel}
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onContinue}
        disabled={continueDisabled}
        className="inline-flex min-h-[44px] items-center gap-2 bg-signal px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-action disabled:cursor-not-allowed disabled:bg-carbon/20 disabled:text-carbon/40"
        style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
      >
        {continueLabel}
      </button>
    </div>
  );
}
