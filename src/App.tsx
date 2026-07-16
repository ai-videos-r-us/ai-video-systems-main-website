import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import ValuePillars from './sections/ValuePillars';
import Problem from './sections/Problem';
import SystemLoop from './sections/SystemLoop';
import CaseStudies from './sections/CaseStudies';
import Process from './sections/Process';
import TestimonialsFaq from './sections/TestimonialsFaq';
import FinalCta from './sections/FinalCta';
import Footer from './sections/Footer';

export default function App() {
  return (
    <main className="bg-white" style={{ overflowX: 'clip' }}>
      <Navbar />
      <Hero />
      <ValuePillars />
      <Problem />
      <SystemLoop />
      <CaseStudies />
      <Process />
      <TestimonialsFaq />
      <FinalCta />
      <Footer />
    </main>
  );
}
