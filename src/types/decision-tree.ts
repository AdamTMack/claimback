/** A single node in the decision tree */
export type TreeNode =
  | QuestionNode
  | InfoNode
  | InputNode
  | BranchNode
  | TerminalNode
  | RedirectNode;

/** Base properties shared by all nodes */
interface BaseNode {
  id: string;
  type: TreeNode["type"];
  meta?: {
    helpText?: string;
    legalBasis?: string;
    warningLevel?: "info" | "caution" | "urgent";
    estimatedTime?: string;
  };
}

/** Presents the user with a choice */
export interface QuestionNode extends BaseNode {
  type: "question";
  prompt: string;
  subtext?: string;
  inputType: "radio" | "checkbox";
  options: {
    label: string;
    value: string;
    helpText?: string;
    next: string;
    guard?: GuardCondition;
  }[];
}

/** Collects structured data from the user */
export interface InputNode extends BaseNode {
  type: "input";
  prompt: string;
  subtext?: string;
  fields: InputField[];
  next: string;
}

export interface InputField {
  key: string;
  label: string;
  inputType:
    | "text"
    | "number"
    | "currency"
    | "date"
    | "email"
    | "phone"
    | "textarea"
    | "state-select";
  placeholder?: string;
  required: boolean;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    message: string;
  };
}

/** Displays information without collecting input */
export interface InfoNode extends BaseNode {
  type: "info";
  title: string;
  body: string;
  callout?: {
    type: "tip" | "warning" | "deadline" | "legal-right";
    text: string;
  };
  next: string;
}

/** Invisible routing node — evaluates guards to determine next step */
export interface BranchNode extends BaseNode {
  type: "branch";
  conditions: {
    guard: GuardCondition;
    next: string;
  }[];
  fallback: string;
}

/** End of a workflow path — triggers letter generation */
export interface TerminalNode extends BaseNode {
  type: "terminal";
  templateId: string;
  letterTitle: string;
  nextSteps: NextStep[];
  relatedWorkflows?: string[];
  relatedGuides?: string[];
  deadlineInfo?: {
    description: string;
    daysFromField?: string;
    statutoryDays: number;
  };
}

/** Routes to a different decision tree entirely */
export interface RedirectNode extends BaseNode {
  type: "redirect";
  targetTree: string;
  targetNode?: string;
  reason: string;
}

/** Guard conditions evaluated against collected workflow context */
export type GuardCondition =
  | { type: "equals"; field: string; value: string | number | boolean }
  | { type: "greaterThan"; field: string; value: number }
  | { type: "lessThan"; field: string; value: number }
  | { type: "includes"; field: string; value: string }
  | { type: "exists"; field: string }
  | { type: "not"; condition: GuardCondition }
  | { type: "and"; conditions: GuardCondition[] }
  | { type: "or"; conditions: GuardCondition[] }
  | { type: "stateIn"; states: string[] };

export interface NextStep {
  text: string;
  details?: string;
  deadlineDays?: number;
  critical: boolean;
}

/** Top-level tree definition */
export interface DecisionTree {
  id: string;
  version: string;
  title: string;
  description: string;
  initialNode: string;
  nodes: Record<string, TreeNode>;
  requiredContext?: string[];
  lastUpdated: string;
  legalReviewDate?: string;
}
