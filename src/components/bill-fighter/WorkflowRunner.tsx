"use client";

import { useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useDecisionTree } from "@/lib/hooks/useDecisionTree";
import { renderTemplate } from "@/lib/templates/engine";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { QuestionStep } from "./QuestionStep";
import { InputStep } from "./InputStep";
import { InfoStep } from "./InfoStep";
import { TerminalStep } from "./TerminalStep";
import type { DecisionTree } from "@/types/decision-tree";

interface WorkflowRunnerProps {
  tree: DecisionTree;
  templates: Record<string, string>;
  /** Compute derived context values (e.g., FPL percentage) from merged context.
   *  Returns only the additional derived fields to inject. */
  computeDerived?: (context: Record<string, unknown>) => Record<string, unknown>;
}

export function WorkflowRunner({ tree, templates, computeDerived }: WorkflowRunnerProps) {
  const {
    currentNode,
    context,
    progress,
    isComplete,
    terminalTemplateId,
    handleAdvance,
    handleBack,
    canGoBack,
    handleReset,
  } = useDecisionTree(tree);

  // Focus management: move focus to the step heading on step change
  const stepRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const heading = stepRef.current?.querySelector("h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus();
    }
  }, [currentNode.id]);

  // Generate letter HTML when at a terminal node
  const letterHtml = useMemo(() => {
    if (!isComplete || !terminalTemplateId || !templates[terminalTemplateId]) {
      return "";
    }
    try {
      return renderTemplate(templates[terminalTemplateId], {
        ...context,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    } catch (e) {
      console.error("Template rendering error:", e);
      return "<p>Error generating letter. Please try again.</p>";
    }
  }, [isComplete, terminalTemplateId, templates, context]);

  const renderCurrentStep = () => {
    switch (currentNode.type) {
      case "question":
        return (
          <QuestionStep
            node={currentNode}
            onAdvance={(selectedOption) => handleAdvance({ selectedOption })}
            onBack={handleBack}
            canGoBack={canGoBack}
          />
        );

      case "input":
        return (
          <InputStep
            node={currentNode}
            existingData={context}
            onAdvance={(formData) => {
              if (computeDerived) {
                const merged = { ...context, ...formData };
                const derived = computeDerived(merged);
                handleAdvance({ formData: { ...formData, ...derived } });
              } else {
                handleAdvance({ formData });
              }
            }}
            onBack={handleBack}
            canGoBack={canGoBack}
          />
        );

      case "info":
        return (
          <InfoStep
            node={currentNode}
            onAdvance={() => handleAdvance()}
            onBack={handleBack}
            canGoBack={canGoBack}
          />
        );

      case "terminal":
        return (
          <TerminalStep
            node={currentNode}
            letterHtml={letterHtml}
            onBack={handleBack}
            canGoBack={canGoBack}
            onReset={handleReset}
          />
        );

      case "redirect":
        return (
          <div className="space-y-6">
            <div className="bg-[#eef3fa] border border-[#c8d8ec] rounded-[14px] p-6">
              <h2 className="text-xl font-normal font-[family-name:var(--font-fraunces)] text-[#2d5590]">
                {currentNode.reason}
              </h2>
              <p className="mt-2 font-light text-[#3868a8]">
                Based on your answers, we&apos;ll take you to the right tool.
              </p>
            </div>
            <div className="flex justify-between items-center">
              {canGoBack ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-[#5c6b62] hover:text-[#1f2a24] font-medium"
                  aria-label="Go back to previous step"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              <Link
                href={`/bill-fighter/${currentNode.targetTree}/`}
                className="px-8 py-3 bg-[#3868a8] text-white rounded-[10px] font-medium hover:bg-[#2d5590] shadow-sm transition-all inline-block"
              >
                Continue <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-[#b04a3c]">
            Unknown node type. This shouldn&apos;t happen.
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar - hidden at terminal */}
      {currentNode.type !== "terminal" && (
        <div className="mb-8">
          <ProgressBar progress={progress} label={tree.title} />
        </div>
      )}

      {/* Current step */}
      <div
        ref={stepRef}
        className="animate-fadeIn"
        aria-live="polite"
        aria-atomic="true"
      >
        {renderCurrentStep()}
      </div>
    </div>
  );
}
