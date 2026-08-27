import { CLIENT_LOGOS } from '../data/clients';

// White client-logo bar. Logos render black-and-white (CSS grayscale) and the
// track scrolls continuously left to right; the duplicated list gives a
// seamless loop. Every img is eager-loaded with explicit width/height so the
// track's width never changes mid-animation — lazy loading inside a moving,
// clipped track leaves logos unloaded (invisible) and makes the loop jump.
export default function LogoMarquee() {
  return (
    <section aria-label="Client logos" className="border-y border-carbon/10 bg-white py-10 md:py-12">
      <p className="mb-8 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-carbon/45">
        Trusted by 96+ client brands
      </p>
      <div className="marquee-viewport relative overflow-hidden">
        <div className="marquee-track flex w-max items-center gap-14 pr-14 md:gap-20 md:pr-20">
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
            <img
              key={`${logo.src}-${i}`}
              src={logo.src}
              alt={i < CLIENT_LOGOS.length ? logo.alt : ''}
              aria-hidden={i >= CLIENT_LOGOS.length}
              width={logo.width}
              height={logo.height}
              loading="eager"
              decoding="async"
              draggable={false}
              className="h-10 w-auto max-w-[130px] flex-shrink-0 select-none object-contain grayscale opacity-70 md:h-12 md:max-w-[150px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
