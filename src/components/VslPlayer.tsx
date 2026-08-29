import { useState } from 'react';

const VIDEO_ID = 'D5Tt9fmQ7wU';

function trackVslPlay(): void {
  try {
    if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: 'vsl_play', placement: 'hero' });
    }
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[analytics] vsl_play', { placement: 'hero' });
    }
  } catch {
    // analytics must never break playback
  }
}

/** Lite YouTube facade: poster + play button on load, iframe only after the
 *  click — keeps the hero free of third-party embeds until someone opts in. */
export default function VslPlayer({ className = '' }: { className?: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={`overflow-hidden border border-carbon/12 bg-carbon shadow-[0_18px_50px_rgba(11,11,13,0.16)] ${className}`}
    >
      <div className="relative aspect-video w-full">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&playsinline=1`}
            title="AI Video Systems — how we find and fix the leak between your ad spend and closed revenue"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            aria-label="Play the AI Video Systems video — 8 minutes"
            onClick={() => {
              trackVslPlay();
              setPlaying(true);
            }}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            <img
              src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-carbon/25 transition-colors duration-200 group-hover:bg-carbon/15" />
            <span
              className="absolute left-1/2 top-1/2 flex h-[64px] w-[86px] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-signal transition-all duration-200 group-hover:bg-action group-hover:shadow-[0_10px_30px_rgba(255,31,31,0.45)]"
              style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5z" />
              </svg>
            </span>
            <span className="absolute bottom-3 right-3 bg-carbon/80 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.08em] text-white">
              8 MIN
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
