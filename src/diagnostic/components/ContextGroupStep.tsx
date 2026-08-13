import { useEffect, useRef } from 'react';
import { CONTEXT_QUESTIONS } from '../../../lib/diagnostic/context-questions';
import type { ContextAnswers } from '../../../lib/diagnostic/types';

interface ContextGroupStepProps {
  stepKey: string;
  title: string;
  questionIds: string[];
  context: ContextAnswers;
  onChange: (questionId: string, value: string | string[]) => void;
}

export default function ContextGroupStep({ stepKey, title, questionIds, context, onChange }: ContextGroupStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [stepKey]);

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 py-6 md:px-0">
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-xl font-bold text-carbon outline-none sm:text-2xl">
        {title}
      </h2>

      <div className="mt-6 flex flex-col gap-8">
        {questionIds.map((questionId) => {
          const question = CONTEXT_QUESTIONS.find((q) => q.id === questionId)!;
          const isMulti = !!question.multiSelect;
          const value = context[questionId as keyof ContextAnswers];

          return (
            <fieldset key={questionId}>
              <legend className="text-[15px] font-semibold text-carbon">{question.prompt}</legend>
              {question.helpText && <p className="mt-1 text-[13px] text-carbon/55">{question.helpText}</p>}
              <div className="mt-3 flex flex-col gap-2">
                {question.options.map((option) => {
                  const checked = isMulti
                    ? Array.isArray(value) && value.includes(option.id)
                    : value === option.id;

                  return (
                    <label
                      key={option.id}
                      className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-[14.5px] transition-colors ${
                        checked ? 'border-signal bg-soft-red text-carbon' : 'border-carbon/15 bg-white text-carbon hover:border-carbon/30'
                      }`}
                    >
                      <input
                        type={isMulti ? 'checkbox' : 'radio'}
                        name={questionId}
                        checked={checked}
                        onChange={() => {
                          if (!isMulti) return onChange(questionId, option.id);

                          const current = Array.isArray(value) ? value : [];
                          const exclusiveIds = question.options.filter((o) => (o as { exclusive?: boolean }).exclusive).map((o) => o.id);
                          const isExclusive = (option as { exclusive?: boolean }).exclusive;

                          if (isExclusive) {
                            return onChange(questionId, checked ? [] : [option.id]);
                          }
                          if (checked) {
                            return onChange(questionId, current.filter((id) => id !== option.id));
                          }
                          return onChange(questionId, [...current.filter((id) => !exclusiveIds.includes(id)), option.id]);
                        }}
                        className="h-4 w-4 flex-shrink-0 accent-signal"
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>
    </div>
  );
}
