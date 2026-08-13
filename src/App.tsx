import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
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

const FuneralDiagnosticPage = lazy(() => import('./diagnostic/FuneralDiagnosticPage'));
const ResultsPage = lazy(() => import('./diagnostic/ResultsPage'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

function MainSite() {
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
