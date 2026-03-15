"use client";

import { WorkflowRunner } from "@/components/bill-fighter/WorkflowRunner";
import nsaTree from "@/data/decision-trees/no-surprises-act.json";
import { templates } from "@/data/templates";
import type { DecisionTree } from "@/types/decision-tree";

function computeDerived(context: Record<string, unknown>): Record<string, unknown> {
  const derived: Record<string, unknown> = {};

  if (
    typeof context.billAmount === "number" &&
    typeof context.gfeAmount === "number"
  ) {
    derived.billGfeDifference = context.billAmount - context.gfeAmount;
  }

  return derived;
}

export default function NoSurprisesActPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <WorkflowRunner
        tree={nsaTree as unknown as DecisionTree}
        templates={templates}
        computeDerived={computeDerived}
      />
    </div>
  );
}
