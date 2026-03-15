"use client";

import { WorkflowRunner } from "@/components/bill-fighter/WorkflowRunner";
import triageTree from "@/data/decision-trees/triage.json";
import type { DecisionTree } from "@/types/decision-tree";

export default function BillFighterPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <WorkflowRunner
        tree={triageTree as unknown as DecisionTree}
        templates={{}}
      />
    </div>
  );
}
