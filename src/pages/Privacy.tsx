import { useEffect } from 'react';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy | AI Video Systems';
  }, []);

  return (
    <main className="bg-white">
      <Navbar />
      <div className="mx-auto max-w-[760px] px-5 py-16 md:px-8 md:py-24">
        <h1 className="font-display text-3xl font-bold text-carbon sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-carbon/50">Last updated: 2026</p>

        <div className="prose mt-8 max-w-none space-y-6 text-[15px] leading-relaxed text-carbon/80">
          <p>
            AI Video Systems ("we", "us") is committed to protecting the privacy of everyone who uses our website
            and tools, including the Funeral Plan Scale Readiness Diagnostic.
          </p>

          <section>
            <h2 className="font-display text-lg font-bold text-carbon">What we collect</h2>
            <p>
              When you complete the diagnostic, we collect your answers to the assessment questions, any exact
              commercial figures you choose to provide, and — once you request your results — your first name,
              surname, company, work email address and, optionally, a telephone number.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-carbon">How we use it</h2>
            <p>
              We use this information to calculate and deliver your confidential Scale Readiness result, to email
              you a copy of that result, and — only where you have separately opted in — to send you relevant
              commercial insights, or to include your answers in anonymised, aggregate industry research. We do not
              sell your information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-carbon">Consent</h2>
            <p>
              Marketing follow-up and anonymised research participation are two separate, optional choices. Neither
              is required to receive your diagnostic result. You can withdraw marketing consent at any time by
              replying to any email we send you.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-carbon">Storage and security</h2>
            <p>
              Your answers and result are stored securely and are only accessible via a private, unguessable link
              sent to you by email. We do not publicly index or share individual results.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-carbon">Your rights</h2>
            <p>
              You may ask us to access, correct or delete your personal data at any time by emailing{' '}
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
