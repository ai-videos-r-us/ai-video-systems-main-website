import { useEffect } from 'react';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms | AI Video Systems';
  }, []);

  return (
    <main className="bg-white">
      <Navbar />
      <div className="mx-auto max-w-[760px] px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-3xl font-bold text-carbon sm:text-4xl">Terms</h1>
        <p className="mt-3 text-sm text-carbon/50">Last updated: 2026</p>

        <div className="prose mt-8 max-w-none space-y-6 text-[15px] leading-relaxed text-carbon/80">
          <section>
            <h2 className="font-display text-lg font-bold text-carbon">The Funeral Plan Scale Readiness Diagnostic</h2>
            <p>
              The diagnostic is a free tool provided by AI Video Systems for established funeral-plan providers,
              funeral groups and funeral directors that actively sell plans. It is provided for general guidance
              only.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-carbon">Not financial or professional advice</h2>
            <p>
              Nothing in the diagnostic, its results, or any financial illustration it produces constitutes
              financial advice, consumer advice, or a guarantee of results. Illustrative figures are based solely
              on the information you provide and are not forecasts, projections or promises of future performance.
              You should seek independent professional advice before making commercial decisions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-carbon">Accuracy of your answers</h2>
            <p>
              Your result depends on the accuracy of the answers and figures you provide. We calculate scores and
              illustrations deterministically from your submitted answers; we do not independently verify them.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-carbon">Confidentiality</h2>
            <p>
              Your individual result is confidential and accessible only via a private link. Where you separately
              consent, your answers may be included in anonymised, aggregate research that cannot identify your
              business.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-carbon">Contact</h2>
            <p>
              Questions about these terms can be sent to{' '}
              <a href="mailto:hello@aivideosystems.com" className="text-action underline">
                hello@aivideosystems.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
