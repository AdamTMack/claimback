"use client";

import type { InfoNode } from "@/types/decision-tree";

interface InfoStepProps {
  node: InfoNode;
  onAdvance: () => void;
  onBack?: () => void;
  canGoBack: boolean;
}

const calloutStyles = {
  tip: "bg-[#eef5f0] border-[#c2dcc9] text-[#3d6b4e]",
  warning: "bg-[#faf3e8] border-[#e2ddd3] text-[#7a5c28]",
  deadline: "bg-[#fdf0ee] border-[#e8ccc7] text-[#8b3d33]",
  "legal-right": "bg-[#eef3fa] border-[#c8d8ec] text-[#2d5590]",
};

const calloutIcons = {
  tip: "\u2714",
  warning: "\u26A0",
  deadline: "\u23F0",
  "legal-right": "\u2696",
};

export function InfoStep({ node, onAdvance, onBack, canGoBack }: InfoStepProps) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-2xl font-normal font-[family-name:var(--font-fraunces)] text-[#1f2a24]">{node.title}</h2>
      </div>

      <div className="font-light text-[#5c6b62] leading-[1.7] whitespace-pre-line">
        {node.body}
      </div>

      {node.callout && (
        <div
          className={`border rounded-[14px] p-4 ${calloutStyles[node.callout.type]}`}
          role="note"
          aria-label={`${node.callout.type.replace("-", " ")}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg" aria-hidden="true">
              {calloutIcons[node.callout.type]}
            </span>
            <p className="text-sm font-medium">{node.callout.text}</p>
          </div>
        </div>
      )}

      {node.meta?.helpText && (
        <div className="bg-[#eee9df] border border-[#e2ddd3] rounded-[14px] p-4 text-sm text-[#5c6b62]">
          {node.meta.helpText}
        </div>
      )}

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
          onClick={onAdvance}
          className="px-8 py-3 bg-[#3868a8] text-white rounded-[10px] font-medium hover:bg-[#2d5590] shadow-sm transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
