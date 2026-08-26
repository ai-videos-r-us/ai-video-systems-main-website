import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import TwoSystems from './sections/TwoSystems';
import ContentEngine from './sections/ContentEngine';
import LogoMarquee from './sections/LogoMarquee';
import LeadGenEngine from './sections/LeadGenEngine';
import ProofWall from './sections/ProofWall';
import Guarantee from './sections/Guarantee';
import Fit from './sections/Fit';
import Faq from './sections/Faq';
import Articles from './sections/Articles';
import FinalCta from './sections/FinalCta';
import Footer from './sections/Footer';

const FuneralDiagnosticPage = lazy(() => import('./diagnostic/FuneralDiagnosticPage'));
const ResultsPage = lazy(() => import('./diagnostic/ResultsPage'));
const RevenueLeakPage = lazy(() => import('./revenueLeak/RevenueLeakPage'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

function MainSite() {
  return (
    <main className="bg-white" style={{ overflowX: 'clip' }}>
      <Navbar />
      <Hero />
      <TwoSystems />
      <ContentEngine />
      <LogoMarquee />
      <LeadGenEngine />
      <ProofWall />
      <Guarantee />
      <Fit />
      <Faq />
      <Articles />
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
        <Route path="/revenue-leak-calculator" element={<RevenueLeakPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Suspense>
  );
}
