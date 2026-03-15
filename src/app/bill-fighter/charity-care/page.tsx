"use client";

import { WorkflowRunner } from "@/components/bill-fighter/WorkflowRunner";
import charityCareTree from "@/data/decision-trees/charity-care.json";
import { templates } from "@/data/templates";
import type { DecisionTree } from "@/types/decision-tree";

// 2025 Federal Poverty Level thresholds (48 contiguous states + DC)
const FPL_THRESHOLDS: Record<number, number> = {
  1: 15650,
  2: 21150,
  3: 26650,
  4: 32150,
  5: 37650,
  6: 43150,
  7: 48650,
  8: 54150,
};
const FPL_PER_ADDITIONAL = 5500;

function getFplThreshold(householdSize: number): number {
  const size = Math.min(Math.max(Math.round(householdSize), 1), 20);
  if (size <= 8) return FPL_THRESHOLDS[size];
  return FPL_THRESHOLDS[8] + (size - 8) * FPL_PER_ADDITIONAL;
}

function computeDerived(context: Record<string, unknown>): Record<string, unknown> {
  const derived: Record<string, unknown> = {};

  if (
    typeof context.annualIncome === "number" &&
    typeof context.householdSize === "number"
  ) {
    const threshold = getFplThreshold(context.householdSize);
    derived.fplPercentage = Math.round((context.annualIncome / threshold) * 100);
    derived.fplThreshold = threshold;
  }

  return derived;
}

export default function CharityCarePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <WorkflowRunner
        tree={charityCareTree as unknown as DecisionTree}
        templates={templates}
        computeDerived={computeDerived}
      />
    </div>
  );
}
