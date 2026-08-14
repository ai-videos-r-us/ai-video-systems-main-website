import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Problem from './sections/Problem';
import Outcome from './sections/Outcome';
import HowItWorks from './sections/HowItWorks';
import FullyManaged from './sections/FullyManaged';
import Testimonials from './sections/Testimonials';
import Process from './sections/Process';
import Guarantee from './sections/Guarantee';
import Fit from './sections/Fit';
import Faq from './sections/Faq';
import FinalCta from './sections/FinalCta';
import Footer from './sections/Footer';

const FuneralDiagnosticPage = lazy(() => import('./diagnostic/FuneralDiagnosticPage'));
const ResultsPage = lazy(() => import('./diagnostic/ResultsPage'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

function MainSite() {
  return (
    <main className="bg-white" style={{ overflowX: 'clip' }}>
      <Navbar />
      <Hero />
      <Problem />
      <Outcome />
      <HowItWorks />
      <FullyManaged />
      <Testimonials />
      <Process />
      <Guarantee />
      <Fit />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/funeral-plan-scale-readiness" element={<FuneralDiagnosticPage />} />
        <Route path="/funeral-plan-scale-readiness/results/:token" element={<ResultsPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Suspense>
  );
}
