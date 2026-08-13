interface DraftResumeBannerProps {
  onResume: () => void;
  onDiscard: () => void;
}

export default function DraftResumeBanner({ onResume, onDiscard }: DraftResumeBannerProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-carbon/50 px-5" role="dialog" aria-modal="true" aria-labelledby="resume-heading">
      <div className="w-full max-w-[440px] rounded-xl border border-carbon/10 bg-white p-6 shadow-xl">
        <h2 id="resume-heading" className="font-display text-lg font-bold text-carbon">
          Continue your diagnostic?
        </h2>
        <p className="mt-2 text-[14.5px] text-carbon/65">
          We found answers saved on this device from a previous visit.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={onResume}
            className="min-h-[44px] flex-1 bg-signal px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-white hover:bg-action"
          >
            Continue where I left off
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="min-h-[44px] flex-1 border border-carbon/20 px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-carbon hover:bg-cloud"
          >
            Start again
          </button>
        </div>
      </div>
    </div>
  );
}
