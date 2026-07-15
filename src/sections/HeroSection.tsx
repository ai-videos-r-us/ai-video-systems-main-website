import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import ContactButton from '../components/ContactButton';

const NAV_LINKS = ['About', 'Price', 'Projects', 'Contact'];

const PORTRAIT_URL = '/avs-symbol-white.svg';

export default function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn as="nav" delay={0} y={-20}>
        <div className="flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
            >
              {link}
            </a>
          ))}
        </div>
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading mt-6 w-full text-center font-black uppercase leading-none tracking-tight sm:mt-4 md:-mt-5">
            <span className="block whitespace-nowrap text-[14vw] sm:text-[13.5vw]">Get more</span>
            <span className="block whitespace-nowrap text-[14vw] sm:text-[13.5vw]">customers</span>
          </h1>
        </FadeIn>
      </div>

      <div className="mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            helping brands build ai video systems that get customers on autopilot
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:translate-y-0">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <img
              src={PORTRAIT_URL}
              alt="AI Video Systems logo"
              className="w-[240px] sm:w-[300px] md:w-[380px] lg:w-[440px]"
            />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}
