import { describe, it, expect } from "vitest";
import {
  createInitialState,
  getCurrentNode,
  advance,
} from "@/lib/decision-tree/interpreter";
import type { DecisionTree } from "@/types/decision-tree";

import itemizedBill from "@/data/decision-trees/itemized-bill.json";
import charityCare from "@/data/decision-trees/charity-care.json";
import noSurprisesAct from "@/data/decision-trees/no-surprises-act.json";
import debtValidation from "@/data/decision-trees/debt-validation.json";

/**
 * Walk a decision tree from start to a terminal, providing answers for each step.
 * Returns the final state (should be isComplete === true at a terminal).
 */
function walkTree(
  tree: DecisionTree,
  answers: Record<string, string | Record<string, unknown>>
) {
  let state = createInitialState(tree);
  let iterations = 0;
  const maxIterations = 50;

  while (!state.isComplete && iterations < maxIterations) {
    iterations++;
    const node = getCurrentNode(tree, state);

    switch (node.type) {
      case "question": {
        const answer = answers[node.id] as string | undefined;
        if (!answer) {
          throw new Error(
            `No answer provided for question "${node.id}" (prompt: "${node.prompt}")`
          );
        }
        state = advance(tree, state, { selectedOption: answer });
        break;
      }
      case "input": {
        const formData = answers[node.id] as
          | Record<string, unknown>
          | undefined;
        if (!formData) {
          throw new Error(
            `No form data provided for input "${node.id}" (prompt: "${node.prompt}")`
          );
        }
        state = advance(tree, state, { formData });
        break;
      }
      case "info": {
        state = advance(tree, state);
        break;
      }
      case "terminal": {
        state = advance(tree, state);
        break;
      }
      case "redirect": {
        return state;
      }
      default:
        throw new Error(`Unexpected node type: ${node.type}`);
    }
  }

  if (iterations >= maxIterations) {
    throw new Error(`Infinite loop detected — visited ${iterations} nodes`);
  }

  return state;
}

describe("Workflow integration tests", () => {
  describe("Itemized Bill workflow", () => {
    const tree = itemizedBill as unknown as DecisionTree;

    it("completes happy path: not in collections", () => {
      const state = walkTree(tree, {
        // info: why_itemize (auto)
        collect_provider_info: {
          providerName: "Springfield Hospital",
          providerStreet: "800 E Carpenter",
          providerCity: "Springfield",
          providerState: "IL",
          providerZip: "62769",
        },
        collect_bill_details: {
          accountNumber: "ACC-123",
          dateOfService: "2025-12-15",
          billAmount: 5000,
        },
        collect_sender_info: {
          senderName: "Jane Doe",
          senderStreet: "123 Main St",
          senderCity: "Springfield",
          senderState: "IL",
          senderZip: "62701",
        },
        already_itemized: "no",
        in_collections: "no",
      });

      expect(state.isComplete).toBe(true);
      expect(state.terminalTemplateId).toBe("itemized-bill-request");
      expect(state.context.senderName).toBe("Jane Doe");
      expect(state.context.billAmount).toBe(5000);
    });

    it("handles collections path", () => {
      const state = walkTree(tree, {
        collect_provider_info: {
          providerName: "Hospital",
          providerStreet: "1 Dr",
          providerCity: "City",
          providerState: "IL",
          providerZip: "60601",
        },
        collect_bill_details: {
          dateOfService: "2025-01-01",
          billAmount: 3000,
        },
        collect_sender_info: {
          senderName: "Jane Doe",
          senderStreet: "123 Main St",
          senderCity: "City",
          senderState: "IL",
          senderZip: "60601",
        },
        already_itemized: "no",
        in_collections: "yes",
        // info: collections_warning (auto)
      });

      expect(state.isComplete).toBe(true);
      expect(state.terminalTemplateId).toBe("itemized-bill-request");
    });
  });

  describe("Charity Care workflow", () => {
    const tree = charityCare as unknown as DecisionTree;

    it("completes happy path: nonprofit hospital", () => {
      const state = walkTree(tree, {
        // info: what_is_charity_care (auto)
        hospital_type: "nonprofit",
        collect_hospital_info: {
          providerName: "University Hospital",
          providerStreet: "1 Medical Center",
          providerCity: "Chicago",
          providerState: "IL",
          providerZip: "60602",
        },
        collect_bill_info: {
          dateOfService: "2025-11-01",
          billAmount: 25000,
        },
        collect_financial_info: {
          annualIncome: 25000,
          householdSize: 2,
        },
        collect_sender_info: {
          senderName: "John Smith",
          senderStreet: "456 Oak Ave",
          senderCity: "Chicago",
          senderState: "IL",
          senderZip: "60601",
        },
        // branch: check_eligibility (auto)
        // info: likely_eligible/possibly_eligible (auto)
      });

      expect(state.isComplete).toBe(true);
      expect(state.terminalTemplateId).toBe("charity-care-application");
      expect(state.context.annualIncome).toBe(25000);
      expect(state.context.householdSize).toBe(2);
    });
  });

  describe("No Surprises Act workflow", () => {
    const tree = noSurprisesAct as unknown as DecisionTree;

    it("completes happy path: has GFE, uninsured, bill exceeds by $400+", () => {
      const state = walkTree(tree, {
        // info: what_is_nsa (auto)
        gfe_received: "yes",
        insurance_status: "uninsured",
        collect_gfe_details: {
          gfeAmount: 3000,
          billAmount: 5500,
          dateOfService: "2025-10-15",
          dateBillReceived: "2025-11-01",
          billGfeDifference: 2500, // computed derived
        },
        // branch: check_threshold (auto, uses billGfeDifference)
        // info: eligible_info (auto)
        collect_provider_info: {
          providerName: "Austin Surgical Center",
          providerStreet: "500 Medical Pkwy",
          providerCity: "Austin",
          providerState: "TX",
          providerZip: "73301",
        },
        collect_sender_info: {
          senderName: "Alice Brown",
          senderStreet: "789 Pine St",
          senderCity: "Austin",
          senderState: "TX",
          senderZip: "73301",
        },
      });

      expect(state.isComplete).toBe(true);
      expect(state.terminalTemplateId).toBe("no-surprises-dispute");
      expect(state.context.gfeAmount).toBe(3000);
      expect(state.context.billAmount).toBe(5500);
    });
  });

  describe("Debt Validation workflow", () => {
    const tree = debtValidation as unknown as DecisionTree;

    it("completes happy path: no lawsuit, within 30-day window", () => {
      const state = walkTree(tree, {
        // info: what_is_fdcpa (auto)
        lawsuit_check: "no",
        first_contact: {
          firstContactDate: new Date(Date.now() - 10 * 86400000)
            .toISOString()
            .split("T")[0],
          daysSinceFirstContact: 10,
        },
        // branch: check_30_day_window (auto)
        // info: within_window (auto)
        collect_collector_info: {
          collectorName: "ABC Collections",
          collectorStreet: "999 Debt Blvd",
          collectorCity: "Tampa",
          collectorState: "FL",
          collectorZip: "33601",
          referenceNumber: "REF-99999",
        },
        collect_debt_details: {
          amountClaimed: 8500,
          originalCreditor: "Miami General Hospital",
          dateOfService: "2025-06-15",
        },
        collect_sender_info: {
          senderName: "Bob Wilson",
          senderStreet: "321 Elm St",
          senderCity: "Miami",
          senderState: "FL",
          senderZip: "33101",
        },
        // info: important_warnings (auto)
      });

      expect(state.isComplete).toBe(true);
      expect(state.terminalTemplateId).toBe("debt-validation-demand");
      expect(state.context.collectorName).toBe("ABC Collections");
      expect(state.context.amountClaimed).toBe(8500);
    });

    it("handles lawsuit path (need lawyer terminal)", () => {
      const state = walkTree(tree, {
        // info: what_is_fdcpa (auto)
        lawsuit_check: "yes",
        // info: need_lawyer (auto)
      });

      expect(state.isComplete).toBe(true);
      // The need_lawyer_terminal has no template
      expect(state.context.lawsuit_check).toBe("yes");
    });
  });
});
