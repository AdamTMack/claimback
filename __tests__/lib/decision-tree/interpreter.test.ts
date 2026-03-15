import { describe, it, expect } from "vitest";
import {
  createInitialState,
  getCurrentNode,
  advance,
  goBack,
  countUserFacingNodes,
  calculateProgress,
} from "@/lib/decision-tree/interpreter";
import type { DecisionTree } from "@/types/decision-tree";

/** A test decision tree that exercises all node types */
const testTree: DecisionTree = {
  id: "test-workflow",
  version: "1.0.0",
  title: "Test Workflow",
  description: "A test tree for unit testing",
  initialNode: "welcome",
  lastUpdated: "2026-03-15",
  nodes: {
    welcome: {
      id: "welcome",
      type: "info",
      title: "Welcome",
      body: "This tool will help you dispute your medical bill.",
      next: "ask_insurance",
    },
    ask_insurance: {
      id: "ask_insurance",
      type: "question",
      prompt: "Are you insured?",
      inputType: "radio",
      options: [
        { label: "Yes", value: "yes", next: "ask_network" },
        { label: "No", value: "no", next: "collect_info" },
      ],
    },
    ask_network: {
      id: "ask_network",
      type: "question",
      prompt: "Was the provider in-network?",
      inputType: "radio",
      options: [
        { label: "Yes", value: "yes", next: "collect_info" },
        { label: "No", value: "no", next: "collect_info" },
      ],
    },
    collect_info: {
      id: "collect_info",
      type: "input",
      prompt: "Tell us about your bill",
      fields: [
        {
          key: "providerName",
          label: "Provider name",
          inputType: "text",
          required: true,
        },
        {
          key: "billAmount",
          label: "Bill amount",
          inputType: "currency",
          required: true,
        },
      ],
      next: "check_amount",
    },
    check_amount: {
      id: "check_amount",
      type: "branch",
      conditions: [
        {
          guard: { type: "greaterThan", field: "billAmount", value: 400 },
          next: "high_amount_terminal",
        },
      ],
      fallback: "low_amount_terminal",
    },
    high_amount_terminal: {
      id: "high_amount_terminal",
      type: "terminal",
      templateId: "dispute-letter",
      letterTitle: "Dispute Letter",
      nextSteps: [
        { text: "Send via certified mail", critical: true },
        { text: "Keep a copy", critical: false },
      ],
    },
    low_amount_terminal: {
      id: "low_amount_terminal",
      type: "terminal",
      templateId: "itemized-request",
      letterTitle: "Itemized Bill Request",
      nextSteps: [
        { text: "Request itemized bill first", critical: true },
      ],
    },
    redirect_node: {
      id: "redirect_node",
      type: "redirect",
      targetTree: "charity-care",
      reason: "You may qualify for financial assistance",
    },
  },
};

describe("createInitialState", () => {
  it("creates state starting at the initial node", () => {
    const state = createInitialState(testTree);
    expect(state.currentNodeId).toBe("welcome");
    expect(state.context).toEqual({});
    expect(state.history).toEqual([]);
    expect(state.isComplete).toBe(false);
  });
});

describe("getCurrentNode", () => {
  it("returns the current node", () => {
    const state = createInitialState(testTree);
    const node = getCurrentNode(testTree, state);
    expect(node.type).toBe("info");
    expect(node.id).toBe("welcome");
  });

  it("throws for invalid node ID", () => {
    const state = { ...createInitialState(testTree), currentNodeId: "bogus" };
    expect(() => getCurrentNode(testTree, state)).toThrow(
      'Node "bogus" not found'
    );
  });
});

describe("advance", () => {
  it("advances past an info node", () => {
    const state = createInitialState(testTree);
    const next = advance(testTree, state);
    expect(next.currentNodeId).toBe("ask_insurance");
    expect(next.history).toEqual(["welcome"]);
  });

  it("advances past a question node with selected option", () => {
    const state = {
      ...createInitialState(testTree),
      currentNodeId: "ask_insurance",
      history: ["welcome"],
    };
    const next = advance(testTree, state, { selectedOption: "no" });
    expect(next.currentNodeId).toBe("collect_info");
    expect(next.context.ask_insurance).toBe("no");
  });

  it("throws for invalid question option", () => {
    const state = {
      ...createInitialState(testTree),
      currentNodeId: "ask_insurance",
    };
    expect(() =>
      advance(testTree, state, { selectedOption: "maybe" })
    ).toThrow('Invalid option "maybe"');
  });

  it("advances past an input node with form data", () => {
    const state = {
      ...createInitialState(testTree),
      currentNodeId: "collect_info",
      history: ["welcome", "ask_insurance"],
      context: { ask_insurance: "no" },
    };
    const next = advance(testTree, state, {
      formData: { providerName: "General Hospital", billAmount: 500 },
    });
    // Should skip the branch node and land on high_amount_terminal
    expect(next.context.providerName).toBe("General Hospital");
    expect(next.context.billAmount).toBe(500);
  });

  it("evaluates branch nodes automatically", () => {
    const state = {
      ...createInitialState(testTree),
      currentNodeId: "collect_info",
      context: {},
      history: [],
    };
    // Bill amount > 400 should route to high_amount_terminal
    const next = advance(testTree, state, {
      formData: { billAmount: 500 },
    });
    expect(next.currentNodeId).toBe("high_amount_terminal");
  });

  it("uses branch fallback when no guard matches", () => {
    const state = {
      ...createInitialState(testTree),
      currentNodeId: "collect_info",
      context: {},
      history: [],
    };
    // Bill amount <= 400 should fall back to low_amount_terminal
    const next = advance(testTree, state, {
      formData: { billAmount: 200 },
    });
    expect(next.currentNodeId).toBe("low_amount_terminal");
  });

  it("marks state as complete at terminal nodes", () => {
    const state = {
      ...createInitialState(testTree),
      currentNodeId: "high_amount_terminal",
      context: { billAmount: 500 },
      history: ["welcome", "ask_insurance", "collect_info", "check_amount"],
    };
    const next = advance(testTree, state);
    expect(next.isComplete).toBe(true);
    expect(next.terminalTemplateId).toBe("dispute-letter");
  });

  it("preserves redirect node for caller to handle", () => {
    const state = {
      ...createInitialState(testTree),
      currentNodeId: "redirect_node",
      context: {},
      history: [],
    };
    const next = advance(testTree, state);
    expect(next.currentNodeId).toBe("redirect_node");
  });
});

describe("goBack", () => {
  it("returns to the previous node", () => {
    const state = {
      ...createInitialState(testTree),
      currentNodeId: "ask_insurance",
      history: ["welcome"],
    };
    const prev = goBack(state);
    expect(prev).not.toBeNull();
    expect(prev!.currentNodeId).toBe("welcome");
    expect(prev!.history).toEqual([]);
  });

  it("returns null when there is no history", () => {
    const state = createInitialState(testTree);
    expect(goBack(state)).toBeNull();
  });

  it("clears terminal state when going back", () => {
    const state = {
      ...createInitialState(testTree),
      currentNodeId: "high_amount_terminal",
      history: ["welcome", "ask_insurance", "collect_info"],
      isComplete: true,
      terminalTemplateId: "dispute-letter",
      context: {},
    };
    const prev = goBack(state);
    expect(prev!.isComplete).toBe(false);
    expect(prev!.terminalTemplateId).toBeUndefined();
  });
});

describe("full workflow walkthrough", () => {
  it("completes the insured path with high bill", () => {
    let state = createInitialState(testTree);

    // Step 1: Info node (welcome)
    state = advance(testTree, state);
    expect(state.currentNodeId).toBe("ask_insurance");

    // Step 2: Question (insured? -> yes)
    state = advance(testTree, state, { selectedOption: "yes" });
    expect(state.currentNodeId).toBe("ask_network");

    // Step 3: Question (in-network? -> no)
    state = advance(testTree, state, { selectedOption: "no" });
    expect(state.currentNodeId).toBe("collect_info");

    // Step 4: Input (bill details)
    state = advance(testTree, state, {
      formData: { providerName: "City Hospital", billAmount: 1500 },
    });
    // Branch auto-evaluates: 1500 > 400 -> high_amount_terminal
    expect(state.currentNodeId).toBe("high_amount_terminal");

    // Step 5: Terminal
    state = advance(testTree, state);
    expect(state.isComplete).toBe(true);
    expect(state.terminalTemplateId).toBe("dispute-letter");

    // Verify full context
    expect(state.context.ask_insurance).toBe("yes");
    expect(state.context.ask_network).toBe("no");
    expect(state.context.providerName).toBe("City Hospital");
    expect(state.context.billAmount).toBe(1500);
  });

  it("completes the uninsured path with low bill", () => {
    let state = createInitialState(testTree);

    state = advance(testTree, state); // welcome -> ask_insurance
    state = advance(testTree, state, { selectedOption: "no" }); // -> collect_info
    state = advance(testTree, state, {
      formData: { providerName: "Clinic", billAmount: 250 },
    }); // -> low_amount_terminal (via branch fallback)

    expect(state.currentNodeId).toBe("low_amount_terminal");

    state = advance(testTree, state);
    expect(state.isComplete).toBe(true);
    expect(state.terminalTemplateId).toBe("itemized-request");
  });
});

describe("countUserFacingNodes", () => {
  it("counts question, input, and info nodes", () => {
    const count = countUserFacingNodes(testTree);
    // welcome (info) + ask_insurance (question) + ask_network (question) + collect_info (input) = 4
    expect(count).toBe(4);
  });
});

describe("calculateProgress", () => {
  it("returns 0 at the start", () => {
    const state = createInitialState(testTree);
    expect(calculateProgress(state, testTree)).toBe(0);
  });

  it("increases as user progresses", () => {
    const state = {
      ...createInitialState(testTree),
      currentNodeId: "collect_info",
      history: ["welcome", "ask_insurance"],
    };
    const progress = calculateProgress(state, testTree);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(100);
  });
});
