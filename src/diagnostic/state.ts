import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { DRAFT_STORAGE_KEY } from '../../lib/diagnostic/constants';
import { WIZARD_STEPS } from './wizardSteps';
import type { ContextAnswers, FinancialInputs, ScoredAnswers } from '../../lib/diagnostic/types';

export interface DraftState {
  stepIndex: number;
  context: ContextAnswers;
  scoredAnswers: ScoredAnswers;
  financial: FinancialInputs;
  savedAt: string;
  idempotencyKey: string;
}

function newIdempotencyKey(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function makeInitialDraft(): DraftState {
  return {
    stepIndex: 0,
    context: {},
    scoredAnswers: {},
    financial: {},
    savedAt: new Date(0).toISOString(),
    idempotencyKey: newIdempotencyKey(),
  };
}

type Action =
  | { type: 'SET_CONTEXT'; questionId: string; value: string | string[] }
  | { type: 'SET_SCORED'; questionId: string; answerId: string }
  | { type: 'SET_FINANCIAL'; patch: Partial<FinancialInputs> }
  | { type: 'GO_NEXT' }
  | { type: 'GO_BACK' }
  | { type: 'GO_TO'; stepIndex: number }
  | { type: 'RESTORE'; draft: DraftState }
  | { type: 'RESET' };

function reducer(state: DraftState, action: Action): DraftState {
  switch (action.type) {
    case 'SET_CONTEXT':
      return {
        ...state,
        context: { ...state.context, [action.questionId]: action.value },
        savedAt: new Date().toISOString(),
      };
    case 'SET_SCORED':
      return {
        ...state,
        scoredAnswers: { ...state.scoredAnswers, [action.questionId]: action.answerId },
        savedAt: new Date().toISOString(),
      };
    case 'SET_FINANCIAL':
      return { ...state, financial: { ...state.financial, ...action.patch }, savedAt: new Date().toISOString() };
    case 'GO_NEXT':
      return { ...state, stepIndex: Math.min(state.stepIndex + 1, WIZARD_STEPS.length - 1) };
    case 'GO_BACK':
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) };
    case 'GO_TO':
      return { ...state, stepIndex: Math.max(0, Math.min(action.stepIndex, WIZARD_STEPS.length - 1)) };
    case 'RESTORE':
      return action.draft;
    case 'RESET':
      return makeInitialDraft();
    default:
      return state;
  }
}

function readStoredDraft(): DraftState | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftState;
    if (typeof parsed.stepIndex !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearStoredDraft() {
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // best-effort only
  }
}

export function useDiagnosticDraft() {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialDraft);
  const [resumeOffered, setResumeOffered] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<DraftState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredDraft();
    if (stored && (stored.stepIndex > 0 || Object.keys(stored.scoredAnswers).length > 0)) {
      setPendingDraft(stored);
      setResumeOffered(true);
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || resumeOffered) return;
    try {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // best-effort only — draft persistence is a convenience, not a requirement
    }
  }, [state, ready, resumeOffered]);

  const resumeDraft = useCallback(() => {
    if (pendingDraft) dispatch({ type: 'RESTORE', draft: pendingDraft });
    setResumeOffered(false);
    setPendingDraft(null);
  }, [pendingDraft]);

  const discardDraft = useCallback(() => {
    clearStoredDraft();
    dispatch({ type: 'RESET' });
    setResumeOffered(false);
    setPendingDraft(null);
  }, []);

  const setContextAnswer = useCallback((questionId: string, value: string | string[]) => {
    dispatch({ type: 'SET_CONTEXT', questionId, value });
  }, []);

  const setScoredAnswer = useCallback((questionId: string, answerId: string) => {
    dispatch({ type: 'SET_SCORED', questionId, answerId });
  }, []);

  const setFinancial = useCallback((patch: Partial<FinancialInputs>) => {
    dispatch({ type: 'SET_FINANCIAL', patch });
  }, []);

  const goNext = useCallback(() => dispatch({ type: 'GO_NEXT' }), []);
  const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), []);
  const goTo = useCallback((stepIndex: number) => dispatch({ type: 'GO_TO', stepIndex }), []);
  const resetAfterSubmit = useCallback(() => {
    clearStoredDraft();
    dispatch({ type: 'RESET' });
  }, []);

  return useMemo(
    () => ({
      state,
      ready,
      resumeOffered,
      resumeDraft,
      discardDraft,
      setContextAnswer,
      setScoredAnswer,
      setFinancial,
      goNext,
      goBack,
      goTo,
      resetAfterSubmit,
    }),
    [state, ready, resumeOffered, resumeDraft, discardDraft, setContextAnswer, setScoredAnswer, setFinancial, goNext, goBack, goTo, resetAfterSubmit]
  );
}
