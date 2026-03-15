"use client";

import { WorkflowRunner } from "@/components/bill-fighter/WorkflowRunner";
import itemizedBillTree from "@/data/decision-trees/itemized-bill.json";
import { templates } from "@/data/templates";
import type { DecisionTree } from "@/types/decision-tree";

export default function ItemizedBillPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <WorkflowRunner
        tree={itemizedBillTree as unknown as DecisionTree}
        templates={templates}
      />
    </div>
  );
}
