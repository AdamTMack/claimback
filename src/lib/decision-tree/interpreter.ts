import type { DecisionTree, TreeNode } from "@/types/decision-tree";
import { evaluateGuard } from "./guards";

/** The interpreter's state — everything needed to know where the user is */
export interface InterpreterState {
  currentNodeId: string;
  context: Record<string, unknown>;
  history: string[];
  isComplete: boolean;
  terminalTemplateId?: string;
}

/** Input the user provides when advancing past a node */
export interface AdvanceInput {
  selectedOption?: string;
  formData?: Record<string, unknown>;
}

/**
 * Get the current node from the tree.
 * Throws if the node doesn't exist (indicates a broken tree definition).
 */
export function getCurrentNode(
  tree: DecisionTree,
  state: InterpreterState
): TreeNode {
  const node = tree.nodes[state.currentNodeId];
  if (!node) {
    throw new Error(
      `Node "${state.currentNodeId}" not found in tree "${tree.id}"`
    );
  }
  return node;
}

/**
 * Advance to the next node based on user input.
 * This is a pure function — it takes the current state and returns the next state.
 * The caller (React hook or test) is responsible for persisting the state.
 */
export function advance(
  tree: DecisionTree,
  state: InterpreterState,
  input?: AdvanceInput
): InterpreterState {
  const node = getCurrentNode(tree, state);
  let nextNodeId: string;
  let newContext = { ...state.context };

  switch (node.type) {
    case "question": {
      const selected = node.options.find(
        (o) => o.value === input?.selectedOption
      );
      if (!selected) {
        throw new Error(
          `Invalid option "${input?.selectedOption}" for question "${node.id}"`
        );
      }
      newContext[node.id] = input!.selectedOption;
      nextNodeId = selected.next;
      break;
    }

    case "input": {
      if (input?.formData) {
        newContext = { ...newContext, ...input.formData };
      }
      nextNodeId = node.next;
      break;
    }

    case "info": {
      nextNodeId = node.next;
      break;
    }

    case "branch": {
      const match = node.conditions.find((c) =>
        evaluateGuard(c.guard, newContext)
      );
      nextNodeId = match ? match.next : node.fallback;
      break;
    }

    case "terminal": {
      return {
        ...state,
        context: newContext,
        isComplete: true,
        terminalTemplateId: node.templateId,
      };
    }

    case "redirect": {
      // Redirect nodes signal that the caller should load a different tree.
      // We mark the state but don't change the node — the caller handles it.
      return {
        ...state,
        context: newContext,
        currentNodeId: node.id,
      };
    }

    default:
      throw new Error(`Unhandled node type: ${(node as TreeNode).type}`);
  }

  // Automatically skip branch nodes (they're invisible routing)
  const nextNode = tree.nodes[nextNodeId];
  if (nextNode && nextNode.type === "branch") {
    return advance(
      tree,
      {
        currentNodeId: nextNodeId,
        context: newContext,
        history: [...state.history, state.currentNodeId],
        isComplete: false,
      },
      undefined
    );
  }

  return {
    currentNodeId: nextNodeId,
    context: newContext,
    history: [...state.history, state.currentNodeId],
    isComplete: false,
  };
}

/**
 * Go back one step in the history.
 * Returns null if there's no history to go back to.
 */
export function goBack(state: InterpreterState): InterpreterState | null {
  if (state.history.length === 0) return null;
  const newHistory = [...state.history];
  const previousNodeId = newHistory.pop()!;
  return {
    ...state,
    currentNodeId: previousNodeId,
    history: newHistory,
    isComplete: false,
    terminalTemplateId: undefined,
  };
}

/** Create the initial interpreter state for a tree */
export function createInitialState(tree: DecisionTree): InterpreterState {
  return {
    currentNodeId: tree.initialNode,
    context: {},
    history: [],
    isComplete: false,
  };
}

/**
 * Count the total number of user-facing nodes (question + input + info) in a tree.
 * Used for progress calculation. This is approximate since branching means
 * different paths have different lengths.
 */
export function countUserFacingNodes(tree: DecisionTree): number {
  return Object.values(tree.nodes).filter(
    (n) => n.type === "question" || n.type === "input" || n.type === "info"
  ).length;
}

/**
 * Calculate progress as a percentage based on history length vs estimated total.
 */
export function calculateProgress(
  state: InterpreterState,
  tree: DecisionTree
): number {
  const total = countUserFacingNodes(tree);
  if (total === 0) return 0;
  const visited = state.history.filter((id) => {
    const node = tree.nodes[id];
    return (
      node &&
      (node.type === "question" || node.type === "input" || node.type === "info")
    );
  }).length;
  return Math.min(Math.round((visited / total) * 100), 100);
}
