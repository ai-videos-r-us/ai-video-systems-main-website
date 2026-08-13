interface DiagnosticHeaderProps {
  showExit: boolean;
}

export default function DiagnosticHeader({ showExit }: DiagnosticHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-carbon/10 bg-white/95 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between px-5 py-3 md:px-8">
        <a href="/" className="flex-shrink-0">
          <img src="/brand/avs-full-logo-black.svg" alt="AI Video Systems" className="h-8 w-auto md:h-9" />
        </a>
        {showExit && (
          <a href="/funeral-plan-scale-readiness" className="text-[13px] font-semibold text-carbon/50 hover:text-carbon">
            Exit diagnostic
          </a>
        )}
      </div>
    </header>
  );
}
