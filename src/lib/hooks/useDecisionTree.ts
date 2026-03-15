"use client";

import { useCallback, useMemo } from "react";
import { useWorkflowStore } from "@/lib/store/useWorkflowStore";
import {
  getCurrentNode,
  advance,
  calculateProgress,
  createInitialState,
} from "@/lib/decision-tree/interpreter";
import type { InterpreterState, AdvanceInput } from "@/lib/decision-tree/interpreter";
import type { DecisionTree, TreeNode } from "@/types/decision-tree";

export interface UseDecisionTreeReturn {
  /** The current node to display */
  currentNode: TreeNode;
  /** All data collected so far */
  context: Record<string, unknown>;
  /** Progress percentage (0-100) */
  progress: number;
  /** Whether we've reached a terminal node */
  isComplete: boolean;
  /** The template ID if at a terminal node */
  terminalTemplateId?: string;
  /** Advance to the next node */
  handleAdvance: (input?: AdvanceInput) => void;
  /** Go back one step */
  handleBack: () => void;
  /** Whether the user can go back */
  canGoBack: boolean;
  /** Reset the workflow */
  handleReset: () => void;
}

export function useDecisionTree(tree: DecisionTree): UseDecisionTreeReturn {
  const store = useWorkflowStore();

  // Initialize workflow if not started or if it's a different tree
  const isInitialized =
    store.activeTreeId === tree.id && store.currentNodeId !== null;

  // Build the interpreter state from the store
  const interpreterState: InterpreterState = useMemo(
    () => ({
      currentNodeId: isInitialized
        ? store.currentNodeId!
        : tree.initialNode,
      context: store.context,
      history: store.history,
      isComplete: false,
    }),
    [
      isInitialized,
      store.currentNodeId,
      store.context,
      store.history,
      tree.initialNode,
    ]
  );

  const currentNode = useMemo(
    () => getCurrentNode(tree, interpreterState),
    [tree, interpreterState]
  );

  const progress = useMemo(
    () => calculateProgress(interpreterState, tree),
    [interpreterState, tree]
  );

  const isComplete = currentNode.type === "terminal";
  const terminalTemplateId =
    currentNode.type === "terminal" ? currentNode.templateId : undefined;

  const handleAdvance = useCallback(
    (input?: AdvanceInput) => {
      // Initialize if needed
      if (!isInitialized) {
        store.startWorkflow(tree.id, tree.initialNode);
      }

      const nextState = advance(tree, interpreterState, input);

      // Update context first if there's new data
      if (input?.formData) {
        store.setContextBulk(input.formData);
      }
      if (input?.selectedOption) {
        store.setContext(interpreterState.currentNodeId, input.selectedOption);
      }

      // Then navigate
      if (nextState.currentNodeId !== interpreterState.currentNodeId) {
        // Use goToNode which handles history
        store.goToNode(nextState.currentNodeId);
      }

      // Handle completion
      if (nextState.isComplete && nextState.terminalTemplateId) {
        store.setGeneratedLetter("", nextState.terminalTemplateId);
      }
    },
    [tree, interpreterState, isInitialized, store]
  );

  const handleBack = useCallback(() => {
    store.goBack();
  }, [store]);

  const handleReset = useCallback(() => {
    store.reset();
  }, [store]);

  return {
    currentNode,
    context: store.context,
    progress,
    isComplete,
    terminalTemplateId,
    handleAdvance,
    handleBack,
    canGoBack: store.history.length > 0,
    handleReset,
  };
}
