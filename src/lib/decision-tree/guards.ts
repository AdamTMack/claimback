import type { GuardCondition } from "@/types/decision-tree";

/**
 * Evaluates a guard condition against the current workflow context.
 * Guards are composable — they support AND, OR, NOT, and nested conditions.
 * This is the core routing logic that determines which path a user takes.
 */
export function evaluateGuard(
  guard: GuardCondition,
  context: Record<string, unknown>
): boolean {
  switch (guard.type) {
    case "equals":
      return context[guard.field] === guard.value;

    case "greaterThan":
      return (
        typeof context[guard.field] === "number" &&
        (context[guard.field] as number) > guard.value
      );

    case "lessThan":
      return (
        typeof context[guard.field] === "number" &&
        (context[guard.field] as number) < guard.value
      );

    case "includes":
      return (
        Array.isArray(context[guard.field]) &&
        (context[guard.field] as string[]).includes(guard.value)
      );

    case "exists":
      return (
        context[guard.field] !== undefined &&
        context[guard.field] !== null &&
        context[guard.field] !== ""
      );

    case "not":
      return !evaluateGuard(guard.condition, context);

    case "and":
      return guard.conditions.every((c) => evaluateGuard(c, context));

    case "or":
      return guard.conditions.some((c) => evaluateGuard(c, context));

    case "stateIn":
      return (
        typeof context["userState"] === "string" &&
        guard.states.includes(context["userState"] as string)
      );

    default:
      return false;
  }
}
