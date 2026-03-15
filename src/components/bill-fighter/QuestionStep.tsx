"use client";

import { useState } from "react";
import type { QuestionNode } from "@/types/decision-tree";

interface QuestionStepProps {
  node: QuestionNode;
  onAdvance: (selectedOption: string) => void;
  onBack?: () => void;
  canGoBack: boolean;
}

export function QuestionStep({
  node,
  onAdvance,
  onBack,
  canGoBack,
}: QuestionStepProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected) {
      onAdvance(selected);
      setSelected(null);
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24]">{node.prompt}</h2>
        {node.subtext && (
          <p className="mt-2 font-light text-[#5c6b62]">{node.subtext}</p>
        )}
      </div>

      {node.meta?.helpText && (
        <div className="bg-[#eef3fa] border border-[#c8d8ec] rounded-[14px] p-4 text-sm text-[#2d5590]">
          {node.meta.helpText}
        </div>
      )}

      <div className="space-y-3" role="radiogroup" aria-label={node.prompt}>
        {node.options.map((option) => (
          <label
            key={option.value}
            className={`
              block w-full p-4 rounded-lg border-2 cursor-pointer transition-all
              ${
                selected === option.value
                  ? "border-[#3868a8] bg-[#eef3fa] ring-2 ring-[#3868a8]/20"
                  : "border-[#e2ddd3] hover:border-[#d0cbc2] hover:bg-[#faf8f5]"
              }
            `}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name={node.id}
                value={option.value}
                checked={selected === option.value}
                onChange={() => setSelected(option.value)}
                aria-describedby={option.helpText ? `help-${option.value}` : undefined}
                className="mt-1 h-4 w-4 text-[#3868a8] focus:ring-[#3868a8]"
              />
              <div>
                <span className="font-medium text-[#1f2a24]">
                  {option.label}
                </span>
                {option.helpText && (
                  <p id={`help-${option.value}`} className="mt-1 text-sm font-light text-[#5c6b62]">
                    {option.helpText}
                  </p>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        {canGoBack ? (
          <button
            onClick={onBack}
            className="px-6 py-3 text-[#5c6b62] hover:text-[#1f2a24] font-medium transition-colors"
            aria-label="Go back to previous step"
          >
            Back
          </button>
        ) : (
          <div />
        )}
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className={`
            px-8 py-3 rounded-[10px] font-medium transition-all
            ${
              selected
                ? "bg-[#3868a8] text-white hover:bg-[#2d5590] shadow-sm"
                : "bg-[#e2ddd3] text-[#7a8a80] cursor-not-allowed"
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
