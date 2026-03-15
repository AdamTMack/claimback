"use client";

import { WorkflowRunner } from "@/components/bill-fighter/WorkflowRunner";
import debtValidationTree from "@/data/decision-trees/debt-validation.json";
import { templates } from "@/data/templates";
import type { DecisionTree } from "@/types/decision-tree";

function computeDerived(context: Record<string, unknown>): Record<string, unknown> {
  const derived: Record<string, unknown> = {};

  // Compute days since first contact for the 30-day window check
  if (typeof context.firstContactDate === "string" && context.firstContactDate) {
    const firstContact = new Date(context.firstContactDate);
    const today = new Date();
    const diffMs = today.getTime() - firstContact.getTime();
    derived.daysSinceFirstContact = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  return derived;
}

export default function DebtValidationPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <WorkflowRunner
        tree={debtValidationTree as unknown as DecisionTree}
        templates={templates}
        computeDerived={computeDerived}
      />
    </div>
  );
}
