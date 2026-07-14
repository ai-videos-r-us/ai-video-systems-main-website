import { useEffect, useRef, useState } from 'react';

const IMAGES = [
  '/videos/three-protocol-cover.mp4',
  '/videos/mortgage-habitat.mp4',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  '/videos/myleadmachine-case-study.mp4',
  '/videos/compare-funerals.mp4',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

const ROW_1 = [...IMAGES.slice(0, 11), ...IMAGES.slice(0, 11), ...IMAGES.slice(0, 11)];
const ROW_2 = [...IMAGES.slice(11), ...IMAGES.slice(11), ...IMAGES.slice(11)];

function Tile({ src }: { src: string }) {
  const tileStyle = { width: 420, height: 270, flexShrink: 0 } as const;

  if (src.endsWith('.mp4')) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="rounded-2xl object-cover"
        style={tileStyle}
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      className="rounded-2xl object-cover"
      style={tileStyle}
    />
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const sectionTop = sectionRef.current.offsetTop;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col gap-3 bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40"
    >
      <div
        className="flex gap-3"
        style={{ transform: `translateX(${offset - 200}px)`, willChange: 'transform' }}
      >
        {ROW_1.map((src, i) => (
          <Tile key={`r1-${i}`} src={src} />
        ))}
      </div>
      <div
        className="flex gap-3"
        style={{ transform: `translateX(${-(offset - 200)}px)`, willChange: 'transform' }}
      >
        {ROW_2.map((src, i) => (
          <Tile key={`r2-${i}`} src={src} />
        ))}
      </div>
    </section>
  );
}
