import { useEffect, useRef } from 'react';

interface Option {
  id: string;
  label: string;
}

interface SingleSelectQuestionProps {
  questionKey: string;
  prompt: string;
  helpText?: string;
  options: Option[];
  value?: string;
  onChange: (optionId: string) => void;
}

export default function SingleSelectQuestion({
  questionKey,
  prompt,
  helpText,
  options,
  value,
  onChange,
}: SingleSelectQuestionProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [questionKey]);

  return (
    <fieldset className="mx-auto w-full max-w-[720px] px-5 py-6 md:px-0">
      <legend className="w-full">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-xl font-bold text-carbon outline-none sm:text-2xl"
        >
          {prompt}
        </h2>
        {helpText && <p className="mt-2 text-[14.5px] text-carbon/60">{helpText}</p>}
      </legend>

      <div className="mt-6 flex flex-col gap-2.5" role="radiogroup" aria-label={prompt}>
        {options.map((option) => {
          const checked = value === option.id;
          return (
            <label
              key={option.id}
              className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-[15px] transition-colors ${
                checked
                  ? 'border-signal bg-soft-red text-carbon'
                  : 'border-carbon/15 bg-white text-carbon hover:border-carbon/30'
              }`}
            >
              <input
                type="radio"
                name={questionKey}
                value={option.id}
                checked={checked}
                onChange={() => onChange(option.id)}
                className="h-4 w-4 flex-shrink-0 accent-signal"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
