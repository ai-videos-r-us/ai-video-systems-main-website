import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Transformation from './sections/Transformation';
import Problem from './sections/Problem';
import SystemLoop from './sections/SystemLoop';
import Deliverables from './sections/Deliverables';
import CaseStudies from './sections/CaseStudies';
import Process from './sections/Process';
import Guarantee from './sections/Guarantee';
import TestimonialsFaq from './sections/TestimonialsFaq';
import FinalCta from './sections/FinalCta';
import Footer from './sections/Footer';

export default function App() {
  return (
    <main className="bg-white" style={{ overflowX: 'clip' }}>
      <Navbar />
      <Hero />
      <Transformation />
      <Problem />
      <SystemLoop />
      <Deliverables />
      <CaseStudies />
      <Process />
      <Guarantee />
      <TestimonialsFaq />
      <FinalCta />
      <Footer />
    </main>
  );
}
