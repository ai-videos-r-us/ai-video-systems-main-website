import { useEffect, useMemo } from 'react';
import { CATEGORIES } from '../../lib/diagnostic/constants';
import { CONTEXT_QUESTIONS } from '../../lib/diagnostic/context-questions';
import { SCORED_QUESTION_MAP } from '../../lib/diagnostic/questions';
import type { ContextAnswers } from '../../lib/diagnostic/types';
import ProgressBar from './components/ProgressBar';
import SingleSelectQuestion from './components/SingleSelectQuestion';
import ContextGroupStep from './components/ContextGroupStep';
import FinancialStep from './components/FinancialStep';
import ContactGateForm, { type ConsentValues, type ContactFormValues } from './components/ContactGateForm';
import WizardNav from './components/WizardNav';
import { WIZARD_STEPS, TOTAL_STEPS } from './wizardSteps';
import { useDiagnosticDraft } from './state';
import { track } from './analytics';

interface DiagnosticWizardProps {
  draft: ReturnType<typeof useDiagnosticDraft>;
  onFinalSubmit: (contact: ContactFormValues, consents: ConsentValues) => void;
  submitting: boolean;
  submitError: string | null;
}

export default function DiagnosticWizard({ draft, onFinalSubmit, submitting, submitError }: DiagnosticWizardProps) {
  const { state, setContextAnswer, setScoredAnswer, setFinancial, goNext, goBack } = draft;
  const step = WIZARD_STEPS[state.stepIndex];

  useEffect(() => {
    if (step.type === 'scored') {
      track('diagnostic_section_viewed', { section_key: step.categoryKey });
    }
    if (step.type === 'contact') {
      track('diagnostic_results_gate_viewed');
    }
  }, [step]);

  const progressLabel = useMemo(() => {
    if (step.type === 'context') return 'Commercial context';
    if (step.type === 'scored') {
      const categoryIndex = CATEGORIES.findIndex((c) => c.key === step.categoryKey);
      return `Section ${categoryIndex + 1} of 7 · ${CATEGORIES[categoryIndex].name}`;
    }
    if (step.type === 'financial') return 'Optional financial detail';
    return 'Your results are ready';
  }, [step]);

  const canContinue = useMemo(() => {
    if (step.type === 'context') {
      return step.questionIds.every((id) => {
        const question = CONTEXT_QUESTIONS.find((q) => q.id === id)!;
        const value = state.context[id as keyof ContextAnswers];
        return question.multiSelect ? Array.isArray(value) && value.length > 0 : !!value;
      });
    }
    if (step.type === 'scored') {
      return !!state.scoredAnswers[step.questionId];
    }
    return true;
  }, [step, state]);

  function handleContinue() {
    if (step.type === 'scored') {
      const nextStep = WIZARD_STEPS[state.stepIndex + 1];
      if (nextStep?.type !== 'scored' || nextStep.categoryKey !== step.categoryKey) {
        track('diagnostic_section_completed', { section_key: step.categoryKey });
      }
    }
    if (step.type === 'context' && WIZARD_STEPS[state.stepIndex + 1]?.type !== 'context') {
      track('diagnostic_context_completed');
    }
    goNext();
  }

  return (
    <div className="min-h-[70vh] bg-white">
      <ProgressBar stepIndex={state.stepIndex} totalSteps={TOTAL_STEPS} label={progressLabel} />

      {step.type === 'context' && (
        <ContextGroupStep
          stepKey={step.key}
          title={step.title}
          questionIds={step.questionIds}
          context={state.context}
          onChange={setContextAnswer}
        />
      )}

      {step.type === 'scored' &&
        (() => {
          const question = SCORED_QUESTION_MAP[step.questionId];
          return (
            <SingleSelectQuestion
              questionKey={question.id}
              prompt={question.prompt}
              helpText={question.helpText}
              options={question.options}
              value={state.scoredAnswers[question.id]}
              onChange={(answerId) => setScoredAnswer(question.id, answerId)}
            />
          );
        })()}

      {step.type === 'financial' && <FinancialStep group={step.group} financial={state.financial} onChange={setFinancial} />}

      {step.type === 'contact' && (
        <ContactGateForm onSubmit={onFinalSubmit} submitting={submitting} submitError={submitError} />
      )}

      {step.type !== 'contact' && (
        <WizardNav onBack={state.stepIndex > 0 ? goBack : undefined} onContinue={handleContinue} continueDisabled={!canContinue} />
      )}
      {step.type === 'contact' && (
        <div className="mx-auto flex w-full max-w-[560px] justify-start px-5 pb-8 md:px-0">
          <button
            type="button"
            onClick={goBack}
            className="min-h-[44px] px-4 py-2 text-sm font-semibold text-carbon/70 transition-colors hover:text-carbon"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
