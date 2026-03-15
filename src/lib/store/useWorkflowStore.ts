import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserInfo {
  fullName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  email: string;
}

interface WorkflowState {
  // Current session
  activeTreeId: string | null;
  currentNodeId: string | null;
  history: string[];

  // Collected data from user inputs
  context: Record<string, unknown>;

  // Generated output
  generatedLetter: string | null;
  selectedTemplateId: string | null;

  // User info (persisted across sessions)
  userInfo: UserInfo | null;

  // Actions
  startWorkflow: (treeId: string, initialNodeId: string) => void;
  goToNode: (nodeId: string) => void;
  goBack: () => void;
  setContext: (key: string, value: unknown) => void;
  setContextBulk: (data: Record<string, unknown>) => void;
  setGeneratedLetter: (html: string, templateId: string) => void;
  setUserInfo: (info: UserInfo) => void;
  reset: () => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      activeTreeId: null,
      currentNodeId: null,
      history: [],
      context: {},
      generatedLetter: null,
      selectedTemplateId: null,
      userInfo: null,

      startWorkflow: (treeId: string, initialNodeId: string) =>
        set({
          activeTreeId: treeId,
          currentNodeId: initialNodeId,
          history: [],
          context: {},
          generatedLetter: null,
          selectedTemplateId: null,
        }),

      goToNode: (nodeId: string) =>
        set((state) => ({
          currentNodeId: nodeId,
          history: state.currentNodeId
            ? [...state.history, state.currentNodeId]
            : state.history,
        })),

      goBack: () =>
        set((state) => {
          if (state.history.length === 0) return state;
          const newHistory = [...state.history];
          const previousNodeId = newHistory.pop()!;
          return {
            currentNodeId: previousNodeId,
            history: newHistory,
            generatedLetter: null,
            selectedTemplateId: null,
          };
        }),

      setContext: (key: string, value: unknown) =>
        set((state) => ({
          context: { ...state.context, [key]: value },
        })),

      setContextBulk: (data: Record<string, unknown>) =>
        set((state) => ({
          context: { ...state.context, ...data },
        })),

      setGeneratedLetter: (html: string, templateId: string) =>
        set({
          generatedLetter: html,
          selectedTemplateId: templateId,
        }),

      setUserInfo: (info: UserInfo) => set({ userInfo: info }),

      reset: () =>
        set({
          activeTreeId: null,
          currentNodeId: null,
          history: [],
          context: {},
          generatedLetter: null,
          selectedTemplateId: null,
          // Note: userInfo is intentionally NOT cleared — persists across sessions
        }),
    }),
    {
      name: "claimback-workflow",
      // Only persist userInfo across sessions — workflow state resets on revisit
      partialize: (state) => ({ userInfo: state.userInfo }),
    }
  )
);
