import { describe, it, expect } from "vitest";
import type { DecisionTree, TreeNode } from "@/types/decision-tree";

// Import all decision trees
import triage from "@/data/decision-trees/triage.json";
import itemizedBill from "@/data/decision-trees/itemized-bill.json";
import charityCare from "@/data/decision-trees/charity-care.json";
import noSurprisesAct from "@/data/decision-trees/no-surprises-act.json";
import debtValidation from "@/data/decision-trees/debt-validation.json";

const allTrees: Record<string, DecisionTree> = {
  triage: triage as unknown as DecisionTree,
  "itemized-bill": itemizedBill as unknown as DecisionTree,
  "charity-care": charityCare as unknown as DecisionTree,
  "no-surprises-act": noSurprisesAct as unknown as DecisionTree,
  "debt-validation": debtValidation as unknown as DecisionTree,
};

const validNodeTypes = [
  "question",
  "info",
  "input",
  "branch",
  "terminal",
  "redirect",
];

describe("Decision tree schema validation", () => {
  for (const [name, tree] of Object.entries(allTrees)) {
    describe(`${name}.json`, () => {
      it("has required top-level fields", () => {
        expect(tree.id).toBeTruthy();
        expect(tree.version).toBeTruthy();
        expect(tree.title).toBeTruthy();
        expect(tree.description).toBeTruthy();
        expect(tree.initialNode).toBeTruthy();
        expect(tree.nodes).toBeTruthy();
        expect(typeof tree.nodes).toBe("object");
      });

      it("initialNode refers to an existing node", () => {
        expect(tree.nodes[tree.initialNode]).toBeTruthy();
      });

      it("all nodes have valid type", () => {
        for (const [nodeId, node] of Object.entries(tree.nodes)) {
          expect(
            validNodeTypes.includes((node as TreeNode).type),
            `Node "${nodeId}" has invalid type "${(node as TreeNode).type}"`
          ).toBe(true);
        }
      });

      it("all node ids match their key in the nodes object", () => {
        for (const [key, node] of Object.entries(tree.nodes)) {
          expect(
            (node as TreeNode).id,
            `Node key "${key}" does not match node.id`
          ).toBe(key);
        }
      });

      it("all 'next' references point to existing nodes", () => {
        for (const [nodeId, node] of Object.entries(tree.nodes)) {
          const n = node as TreeNode;
          if (n.type === "question") {
            for (const opt of n.options) {
              expect(
                tree.nodes[opt.next],
                `Question "${nodeId}" option "${opt.value}" points to missing node "${opt.next}"`
              ).toBeTruthy();
            }
          } else if (n.type === "info" || n.type === "input") {
            expect(
              tree.nodes[n.next],
              `Node "${nodeId}" points to missing node "${n.next}"`
            ).toBeTruthy();
          } else if (n.type === "branch") {
            for (const cond of n.conditions) {
              expect(
                tree.nodes[cond.next],
                `Branch "${nodeId}" condition points to missing node "${cond.next}"`
              ).toBeTruthy();
            }
            expect(
              tree.nodes[n.fallback],
              `Branch "${nodeId}" fallback points to missing node "${n.fallback}"`
            ).toBeTruthy();
          }
        }
      });

      it("has at least one terminal node", () => {
        const terminals = Object.values(tree.nodes).filter(
          (n) => (n as TreeNode).type === "terminal"
        );
        // Triage tree uses redirect nodes instead of terminals
        if (name === "triage") {
          const redirects = Object.values(tree.nodes).filter(
            (n) => (n as TreeNode).type === "redirect"
          );
          expect(redirects.length).toBeGreaterThan(0);
        } else {
          expect(terminals.length).toBeGreaterThan(0);
        }
      });

      it("terminal nodes have required fields", () => {
        for (const [nodeId, node] of Object.entries(tree.nodes)) {
          const n = node as TreeNode;
          if (n.type === "terminal") {
            expect(n.letterTitle, `Terminal "${nodeId}" missing letterTitle`).toBeTruthy();
            expect(n.nextSteps, `Terminal "${nodeId}" missing nextSteps`).toBeTruthy();
            expect(Array.isArray(n.nextSteps)).toBe(true);
            expect(n.nextSteps.length).toBeGreaterThan(0);
          }
        }
      });

      it("question nodes have at least 2 options", () => {
        for (const [nodeId, node] of Object.entries(tree.nodes)) {
          const n = node as TreeNode;
          if (n.type === "question") {
            expect(
              n.options.length,
              `Question "${nodeId}" has fewer than 2 options`
            ).toBeGreaterThanOrEqual(2);
          }
        }
      });

      it("input nodes have at least one field", () => {
        for (const [nodeId, node] of Object.entries(tree.nodes)) {
          const n = node as TreeNode;
          if (n.type === "input") {
            expect(
              n.fields.length,
              `Input "${nodeId}" has no fields`
            ).toBeGreaterThan(0);
            for (const field of n.fields) {
              expect(field.key, `Input "${nodeId}" has field without key`).toBeTruthy();
              expect(field.label, `Input "${nodeId}" has field without label`).toBeTruthy();
              expect(field.inputType, `Input "${nodeId}" field "${field.key}" has no inputType`).toBeTruthy();
            }
          }
        }
      });

      it("has no orphaned nodes (unreachable from initialNode)", () => {
        const reachable = new Set<string>();
        const queue = [tree.initialNode];

        while (queue.length > 0) {
          const nodeId = queue.shift()!;
          if (reachable.has(nodeId)) continue;
          reachable.add(nodeId);

          const node = tree.nodes[nodeId] as TreeNode;
          if (!node) continue;

          if (node.type === "question") {
            for (const opt of node.options) {
              queue.push(opt.next);
            }
          } else if (node.type === "info" || node.type === "input") {
            queue.push(node.next);
          } else if (node.type === "branch") {
            for (const cond of node.conditions) {
              queue.push(cond.next);
            }
            queue.push(node.fallback);
          }
        }

        const allNodeIds = Object.keys(tree.nodes);
        const orphans = allNodeIds.filter((id) => !reachable.has(id));
        expect(
          orphans,
          `Tree "${name}" has orphaned nodes: ${orphans.join(", ")}`
        ).toEqual([]);
      });
    });
  }
});
