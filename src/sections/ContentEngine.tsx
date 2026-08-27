import { useEffect, useRef } from 'react';
import FadeIn from '../components/FadeIn';
import { Eyebrow, PrimaryCTA } from '../components/CTA';

// The showreel is a phone mockup rendered on a pure-white canvas, so it sits
// directly on the section background with no card, border or mask — it reads
// as part of the page itself.
export default function ContentEngine() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      video.controls = true;
      return;
    }

    let inView = false;
    const tryPlay = () => {
      video.muted = true; // iOS drops autoplay permission if muted isn't set at play time
      video.play().catch(() => {});
    };

    // Drive playback from viewport visibility: iOS suspends autoplaying
    // videos that start offscreen and never resumes them on scroll. Pausing
    // offscreen also saves battery.
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) tryPlay();
        else video.pause();
      },
      { threshold: 0.2 }
    );
    io.observe(video);

    // Background-tab loads defer autoplay — retry when the tab is shown.
    const onVisible = () => {
      if (document.visibilityState === 'visible' && inView) tryPlay();
    };
    document.addEventListener('visibilitychange', onVisible);

    // Low Power Mode rejects non-gesture play(); a touch counts as a gesture.
    const onTouch = () => {
      if (inView && video.paused) tryPlay();
    };
    document.addEventListener('touchstart', onTouch, { passive: true });

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisible);
      document.removeEventListener('touchstart', onTouch);
    };
  }, []);

  return (
    <section id="content-engine" className="relative overflow-hidden bg-white py-24 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="max-w-[600px]">
            <FadeIn>
              <Eyebrow>System One</Eyebrow>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="mt-5 font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-carbon">
                The AI Content Engine
              </h2>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-4 font-display text-[17px] font-bold leading-snug text-carbon/85">
                Install the complete AI content, branding and authority marketing programme.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-5 text-[15.5px] leading-relaxed text-carbon/70">
                Want to own your space? Looking to appear and promote yourself better than your competition?
                Want to generate the interest, build the authority and showcase who you truly are — with
                high-quality content for your brand, your social media and your marketing?
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <p className="mt-4 text-[15.5px] leading-relaxed text-carbon/70">
                The AI Content Engine is a unique marketing experience that scales your brand, scales your
                followers and scales your platforms with content — AI content at volume, distributed
                everywhere your buyers look.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="mt-8">
                <PrimaryCTA placement="content-engine" />
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} x={24} y={0}>
            <figure className="flex flex-col items-center">
              <video
                ref={videoRef}
                src="/videos/avs-showreel.mp4"
                poster="/videos/avs-showreel-poster.webp"
                muted
                loop
                playsInline
                preload="auto"
                aria-label="AI Video Systems showreel — real client creative playing on a phone"
                className="h-auto w-[min(74vw,330px)] lg:w-[400px] xl:w-[430px]"
              />
              <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-carbon/45">
                Real client creative · one engine, every platform
              </figcaption>
            </figure>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
