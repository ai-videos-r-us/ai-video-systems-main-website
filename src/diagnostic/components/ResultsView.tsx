import { useEffect } from 'react';
import type { PublicResult } from '../../../lib/diagnostic/serialize';
import { CATEGORY_MAP } from '../../../lib/diagnostic/constants';
import { FINANCIAL_DISCLAIMER, SUPPRESSED_FINANCIAL_MESSAGE } from '../../../lib/diagnostic/content';
import { CTA_CONTENT } from '../../../lib/diagnostic/cta-copy';
import type { CategoryKey } from '../../../lib/diagnostic/types';
import { classificationColorClass, classificationLabel, classificationMeaning } from '../classification';
import { formatGBP, formatNumber0dp, formatNumber1dp } from '../format';
import { track } from '../analytics';
import AnalysisRequestForm from './AnalysisRequestForm';

interface ResultsViewProps {
  firstName?: string;
  result: PublicResult;
  ctaUrl?: string;
  resultUrl?: string;
  emailStatus?: 'sent' | 'failed';
  resultToken?: string;
}

const MISSING_FIELD_LABELS: Record<string, string> = {
  alignment_confirmation: 'confirmation that spend, enquiries and plan sales relate to the same cohort',
  monthly_acquisition_spend: 'exact monthly paid-acquisition spend',
  paid_enquiries: 'exact paid enquiries for that period',
  completed_plan_sales: 'exact completed plan sales attributable to those enquiries',
  contribution_per_plan: 'average gross contribution per completed plan',
  minimum_sample_size_25_paid_enquiries: 'at least 25 paid enquiries in the sample',
  eligible_aged_enquiries: 'eligible aged enquiries older than 30 days',
};

export default function ResultsView({ firstName, result, ctaUrl, resultUrl, emailStatus, resultToken }: ResultsViewProps) {
  useEffect(() => {
    track('diagnostic_results_viewed', { classification: result.classification, constraint_key: result.primaryConstraint.key });
  }, [result.classification, result.primaryConstraint.key]);

  useEffect(() => {
    track('diagnostic_cta_viewed', { cta_variant: result.ctaVariant });
  }, [result.ctaVariant]);

  const ctaContent = CTA_CONTENT[result.ctaVariant];
  const scenario = result.financialOutputs.acquisitionScenario;
  const aged = result.financialOutputs.agedEnquiryIllustration;

  return (
    <div className="mx-auto w-full max-w-[880px] px-5 py-10 md:px-8 print:px-0">
      {firstName && <p className="text-[14px] text-carbon/50">Hi {firstName}, here is your confidential result.</p>}

      <section className="mt-2">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-carbon/45">
          Funeral Plan Scale Readiness Diagnostic
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-carbon sm:text-4xl">
          Your Scale Readiness Score: {result.overallReadinessRounded}/100
        </h1>
        <p className={`mt-2 font-display text-lg font-bold ${classificationColorClass(result.classification)}`}>
          {classificationLabel(result.classification)}
        </p>
        <p className="mt-1 max-w-[620px] text-[14.5px] text-carbon/65">{classificationMeaning(result.classification)}</p>
        <p className="mt-3 text-[12.5px] text-carbon/45">{result.classificationDisclaimer}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-carbon/10 bg-cloud p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-carbon/45">Data Confidence</p>
            <p className="mt-1 font-display text-base font-bold capitalize text-carbon">{result.dataConfidenceLevel}</p>
          </div>
          <div className="rounded-lg border border-carbon/10 bg-cloud p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-carbon/45">What would break first</p>
            <p className="mt-1 font-display text-base font-bold text-carbon">{result.primaryConstraint.name}</p>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-carbon/10 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-carbon/45">Secondary constraint</p>
          <p className="mt-1 font-display text-base font-bold text-carbon">{result.secondaryConstraint.name}</p>
          {result.interconnectedConstraints && (
            <p className="mt-1 text-[13.5px] text-carbon/60">
              These two constraints are closely interconnected — fixing one in isolation is unlikely to be enough.
            </p>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-carbon">Your seven category scores</h2>
        <div className="mt-5 flex flex-col gap-4">
          {(Object.keys(result.categoryScores) as CategoryKey[])
            .sort((a, b) => CATEGORY_MAP[a].order - CATEGORY_MAP[b].order)
            .map((key) => (
              <div key={key}>
                <div className="flex items-baseline justify-between text-[14px]">
                  <span className="font-semibold text-carbon">{CATEGORY_MAP[key].name}</span>
                  <span className="font-mono text-carbon/60">{result.categoryScores[key]}/100</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-carbon/10">
                  <div className="h-full rounded-full bg-signal" style={{ width: `${result.categoryScores[key]}%` }} />
                </div>
              </div>
            ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-carbon">Your strongest foundations</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {result.strengths.map((s) => (
            <div key={s.categoryKey} className="rounded-lg border border-carbon/10 p-4">
              <p className="font-display text-sm font-bold text-carbon">
                {s.categoryName} <span className="font-mono text-carbon/45">· {s.score}/100</span>
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-carbon/65">{s.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-carbon">Primary diagnosis: {result.primaryConstraint.name}</h2>
        <div className="mt-4 space-y-4 rounded-lg border border-carbon/10 p-5">
          <p className="text-[14.5px] leading-relaxed text-carbon/80">{result.primaryConstraint.diagnosis}</p>
          <DiagnosisRow label="Why it becomes dangerous at scale" value={result.primaryConstraint.whyDangerous} />
          <DiagnosisRow label="Immediate action" value={result.primaryConstraint.immediateAction} />
          <DiagnosisRow label="Primary KPI to monitor" value={result.primaryConstraint.primaryKpi} />
          <DiagnosisRow label="What must be true before material scaling" value={result.primaryConstraint.proofBeforeScaling} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-carbon">Illustrative financial scenarios</h2>
        <p className="mt-1 text-[13px] text-carbon/50">{FINANCIAL_DISCLAIMER}</p>

        {scenario.suppressed ? (
          <SuppressedBlock missing={scenario.missing} />
        ) : (
          <div className="mt-4 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Stat label="Current CPL" value={formatGBP(scenario.current!.currentCplGbp)} />
              <Stat label="Current lead-to-plan rate" value={`${(scenario.current!.currentLeadToPlanRate * 100).toFixed(1)}%`} />
              <Stat label="Current CAC" value={formatGBP(scenario.current!.currentCacGbp)} />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-[13.5px]">
                <thead>
                  <tr className="border-b border-carbon/15 text-left text-carbon/50">
                    <th className="py-2 pr-4 font-semibold">£10,000 scenario</th>
                    <th className="py-2 pr-4 font-semibold">Additional enquiries</th>
                    <th className="py-2 pr-4 font-semibold">Additional plans (expected value)</th>
                    <th className="py-2 font-semibold">Contribution after acquisition</th>
                  </tr>
                </thead>
                <tbody>
                  {scenario.scenarios!.map((s) => (
                    <tr key={s.multiplier} className="border-b border-carbon/5">
                      <td className="py-2.5 pr-4 font-semibold text-carbon">
                        {s.multiplier === 1 ? 'CPL holds' : `CPL +${Math.round((s.multiplier - 1) * 100)}%`}
                      </td>
                      <td className="py-2.5 pr-4 text-carbon/75">{formatNumber0dp(s.additionalEnquiries)}</td>
                      <td className="py-2.5 pr-4 text-carbon/75">{formatNumber1dp(s.additionalPlans)}</td>
                      <td className="py-2.5 text-carbon/75">{formatGBP(s.illustrativeContributionAfterAcquisitionGbp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {scenario.capacityWarning && (
              <div className="rounded-md border border-score-constrained/30 bg-score-constrained/5 px-4 py-3 text-[13.5px] text-score-constrained">
                Capacity warning: at least one scenario above would generate more enquiries than your stated spare
                monthly capacity. Fix capacity before committing to this level of spend.
              </div>
            )}

            {scenario.conversionLeverage && (
              <div className="rounded-lg border border-carbon/10 p-4">
                <p className="font-display text-sm font-bold text-carbon">Conversion-leverage illustration</p>
                <p className="mt-1 text-[13.5px] text-carbon/65">
                  A 1-point improvement in lead-to-plan conversion would be worth an estimated{' '}
                  <strong>{formatNumber1dp(scenario.conversionLeverage.additionalPlansAtPlus1)} additional plans</strong>
                  {scenario.conversionLeverage.additionalGrossContributionAtPlus1Gbp != null &&
                    ` (${formatGBP(scenario.conversionLeverage.additionalGrossContributionAtPlus1Gbp)} gross contribution)`}
                  ; a 2-point improvement would be worth an estimated{' '}
                  <strong>{formatNumber1dp(scenario.conversionLeverage.additionalPlansAtPlus2)} additional plans</strong>
                  {scenario.conversionLeverage.additionalGrossContributionAtPlus2Gbp != null &&
                    ` (${formatGBP(scenario.conversionLeverage.additionalGrossContributionAtPlus2Gbp)} gross contribution)`}
                  , at your current paid enquiry volume. This is not a promised or guaranteed improvement.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-carbon">Existing-enquiry opportunity</h2>
        {aged.suppressed ? (
          <SuppressedBlock missing={aged.missing} />
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-[13.5px]">
              <thead>
                <tr className="border-b border-carbon/15 text-left text-carbon/50">
                  <th className="py-2 pr-4 font-semibold">Recovery rate</th>
                  <th className="py-2 pr-4 font-semibold">Recovered plans</th>
                  <th className="py-2 font-semibold">Illustrative gross contribution</th>
                </tr>
              </thead>
              <tbody>
                {aged.scenarios!.map((s) => (
                  <tr key={s.recoveryRate} className="border-b border-carbon/5">
                    <td className="py-2.5 pr-4 font-semibold text-carbon">{(s.recoveryRate * 100).toFixed(1)}%</td>
                    <td className="py-2.5 pr-4 text-carbon/75">{formatNumber1dp(s.recoveredPlans)}</td>
                    <td className="py-2.5 text-carbon/75">{formatGBP(s.illustrativeGrossContributionGbp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-[12.5px] text-carbon/45">
              These are sensitivity examples, not promised or benchmark recovery rates.
            </p>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-carbon">Your three priorities</h2>
        <ol className="mt-4 space-y-4">
          {result.priorities.map((p) => (
            <li key={p.order} className="rounded-lg border border-carbon/10 p-4">
              <p className="font-display text-sm font-bold text-carbon">
                {p.order}. {p.action}
              </p>
              <p className="mt-2 text-[13.5px] text-carbon/65">{p.reason}</p>
              <div className="mt-3 grid grid-cols-1 gap-2 text-[12.5px] text-carbon/55 sm:grid-cols-3">
                <span>
                  <strong className="text-carbon/70">KPI:</strong> {p.kpi}
                </span>
                <span>
                  <strong className="text-carbon/70">Time horizon:</strong> {p.timeHorizon}
                </span>
                <span>
                  <strong className="text-carbon/70">Exit criterion:</strong> {p.exitCriterion}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold text-carbon">Before you scale</h2>
        <ul className="mt-4 space-y-2">
          {result.risks.map((risk) => (
            <li key={risk} className="flex gap-2 text-[14px] text-carbon/70">
              <span className="text-signal">—</span>
              {risk}
            </li>
          ))}
        </ul>
      </section>

      {ctaContent.body && (
        <section className="mt-12 rounded-xl border border-carbon/10 bg-cloud p-6 print:hidden">
          <h2 className="font-display text-lg font-bold text-carbon">{ctaContent.heading}</h2>
          <p className="mt-2 text-[14.5px] text-carbon/70">{ctaContent.body}</p>

          {ctaContent.showsBookingAction && ctaUrl && (
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener"
              onClick={() => track('diagnostic_cta_clicked', { cta_variant: result.ctaVariant })}
              className="mt-4 inline-block bg-signal px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-white hover:bg-action"
              style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}
            >
              {ctaContent.buttonLabel}
            </a>
          )}

          {ctaContent.showsBookingAction && !ctaUrl && resultToken && (
            <AnalysisRequestForm resultToken={resultToken} />
          )}
        </section>
      )}

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-carbon/10 pt-6 print:hidden">
        <p className="text-[12.5px] text-carbon/45">
          {emailStatus === 'sent' && 'A copy has been emailed to you.'}
          {emailStatus === 'failed' && 'Your result is saved here — we had a problem sending the email copy.'}
        </p>
        <div className="flex gap-3">
          {resultUrl && (
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(resultUrl)}
              className="min-h-[44px] rounded-md border border-carbon/20 px-4 py-2 text-[13px] font-semibold text-carbon hover:bg-cloud"
            >
              Copy secure link
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[44px] rounded-md border border-carbon/20 px-4 py-2 text-[13px] font-semibold text-carbon hover:bg-cloud"
          >
            Save as PDF
          </button>
        </div>
      </footer>
    </div>
  );
}

function DiagnosisRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-carbon/45">{label}</p>
      <p className="mt-1 text-[14px] text-carbon/80">{value}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-carbon/10 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-carbon/45">{label}</p>
      <p className="mt-1 font-display text-lg font-bold text-carbon">{value}</p>
    </div>
  );
}

function SuppressedBlock({ missing }: { missing: string[] }) {
  return (
    <div className="mt-4 rounded-lg border border-carbon/15 bg-cloud p-4">
      <p className="text-[14px] text-carbon/70">{SUPPRESSED_FINANCIAL_MESSAGE}</p>
      <p className="mt-2 text-[12.5px] font-semibold text-carbon/55">Missing or unreliable:</p>
      <ul className="mt-1 list-inside list-disc text-[12.5px] text-carbon/55">
        {missing.map((m) => (
          <li key={m}>{MISSING_FIELD_LABELS[m] ?? m}</li>
        ))}
      </ul>
    </div>
  );
}
