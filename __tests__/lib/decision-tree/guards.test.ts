import { describe, it, expect } from "vitest";
import { evaluateGuard } from "@/lib/decision-tree/guards";
import type { GuardCondition } from "@/types/decision-tree";

describe("evaluateGuard", () => {
  describe("equals", () => {
    it("returns true when field matches value", () => {
      const guard: GuardCondition = {
        type: "equals",
        field: "status",
        value: "insured",
      };
      expect(evaluateGuard(guard, { status: "insured" })).toBe(true);
    });

    it("returns false when field does not match", () => {
      const guard: GuardCondition = {
        type: "equals",
        field: "status",
        value: "insured",
      };
      expect(evaluateGuard(guard, { status: "uninsured" })).toBe(false);
    });

    it("handles boolean values", () => {
      const guard: GuardCondition = {
        type: "equals",
        field: "isNonprofit",
        value: true,
      };
      expect(evaluateGuard(guard, { isNonprofit: true })).toBe(true);
      expect(evaluateGuard(guard, { isNonprofit: false })).toBe(false);
    });

    it("returns false when field is missing", () => {
      const guard: GuardCondition = {
        type: "equals",
        field: "status",
        value: "insured",
      };
      expect(evaluateGuard(guard, {})).toBe(false);
    });
  });

  describe("greaterThan", () => {
    it("returns true when field is greater", () => {
      const guard: GuardCondition = {
        type: "greaterThan",
        field: "billAmount",
        value: 400,
      };
      expect(evaluateGuard(guard, { billAmount: 500 })).toBe(true);
    });

    it("returns false when field equals value", () => {
      const guard: GuardCondition = {
        type: "greaterThan",
        field: "billAmount",
        value: 400,
      };
      expect(evaluateGuard(guard, { billAmount: 400 })).toBe(false);
    });

    it("returns false when field is not a number", () => {
      const guard: GuardCondition = {
        type: "greaterThan",
        field: "billAmount",
        value: 400,
      };
      expect(evaluateGuard(guard, { billAmount: "500" })).toBe(false);
    });
  });

  describe("lessThan", () => {
    it("returns true when field is less", () => {
      const guard: GuardCondition = {
        type: "lessThan",
        field: "daysSinceContact",
        value: 30,
      };
      expect(evaluateGuard(guard, { daysSinceContact: 15 })).toBe(true);
    });

    it("returns false when field equals value", () => {
      const guard: GuardCondition = {
        type: "lessThan",
        field: "daysSinceContact",
        value: 30,
      };
      expect(evaluateGuard(guard, { daysSinceContact: 30 })).toBe(false);
    });
  });

  describe("includes", () => {
    it("returns true when array includes value", () => {
      const guard: GuardCondition = {
        type: "includes",
        field: "selectedIssues",
        value: "overcharge",
      };
      expect(
        evaluateGuard(guard, {
          selectedIssues: ["overcharge", "duplicate"],
        })
      ).toBe(true);
    });

    it("returns false when array doesn't include value", () => {
      const guard: GuardCondition = {
        type: "includes",
        field: "selectedIssues",
        value: "overcharge",
      };
      expect(
        evaluateGuard(guard, { selectedIssues: ["duplicate"] })
      ).toBe(false);
    });

    it("returns false when field is not an array", () => {
      const guard: GuardCondition = {
        type: "includes",
        field: "selectedIssues",
        value: "overcharge",
      };
      expect(
        evaluateGuard(guard, { selectedIssues: "overcharge" })
      ).toBe(false);
    });
  });

  describe("exists", () => {
    it("returns true when field has a value", () => {
      const guard: GuardCondition = { type: "exists", field: "email" };
      expect(evaluateGuard(guard, { email: "user@test.com" })).toBe(true);
    });

    it("returns false for undefined", () => {
      const guard: GuardCondition = { type: "exists", field: "email" };
      expect(evaluateGuard(guard, {})).toBe(false);
    });

    it("returns false for null", () => {
      const guard: GuardCondition = { type: "exists", field: "email" };
      expect(evaluateGuard(guard, { email: null })).toBe(false);
    });

    it("returns false for empty string", () => {
      const guard: GuardCondition = { type: "exists", field: "email" };
      expect(evaluateGuard(guard, { email: "" })).toBe(false);
    });

    it("returns true for zero (valid value)", () => {
      const guard: GuardCondition = { type: "exists", field: "amount" };
      expect(evaluateGuard(guard, { amount: 0 })).toBe(true);
    });
  });

  describe("not", () => {
    it("negates a true condition", () => {
      const guard: GuardCondition = {
        type: "not",
        condition: { type: "equals", field: "status", value: "insured" },
      };
      expect(evaluateGuard(guard, { status: "insured" })).toBe(false);
    });

    it("negates a false condition", () => {
      const guard: GuardCondition = {
        type: "not",
        condition: { type: "equals", field: "status", value: "insured" },
      };
      expect(evaluateGuard(guard, { status: "uninsured" })).toBe(true);
    });
  });

  describe("and", () => {
    it("returns true when all conditions are true", () => {
      const guard: GuardCondition = {
        type: "and",
        conditions: [
          { type: "equals", field: "isNonprofit", value: true },
          { type: "greaterThan", field: "billAmount", value: 1000 },
        ],
      };
      expect(
        evaluateGuard(guard, { isNonprofit: true, billAmount: 5000 })
      ).toBe(true);
    });

    it("returns false when any condition is false", () => {
      const guard: GuardCondition = {
        type: "and",
        conditions: [
          { type: "equals", field: "isNonprofit", value: true },
          { type: "greaterThan", field: "billAmount", value: 1000 },
        ],
      };
      expect(
        evaluateGuard(guard, { isNonprofit: false, billAmount: 5000 })
      ).toBe(false);
    });
  });

  describe("or", () => {
    it("returns true when any condition is true", () => {
      const guard: GuardCondition = {
        type: "or",
        conditions: [
          { type: "equals", field: "status", value: "uninsured" },
          { type: "equals", field: "status", value: "self-pay" },
        ],
      };
      expect(evaluateGuard(guard, { status: "self-pay" })).toBe(true);
    });

    it("returns false when all conditions are false", () => {
      const guard: GuardCondition = {
        type: "or",
        conditions: [
          { type: "equals", field: "status", value: "uninsured" },
          { type: "equals", field: "status", value: "self-pay" },
        ],
      };
      expect(evaluateGuard(guard, { status: "insured" })).toBe(false);
    });
  });

  describe("stateIn", () => {
    it("returns true when user state is in the list", () => {
      const guard: GuardCondition = {
        type: "stateIn",
        states: ["CA", "NY", "TX"],
      };
      expect(evaluateGuard(guard, { userState: "CA" })).toBe(true);
    });

    it("returns false when user state is not in the list", () => {
      const guard: GuardCondition = {
        type: "stateIn",
        states: ["CA", "NY", "TX"],
      };
      expect(evaluateGuard(guard, { userState: "FL" })).toBe(false);
    });

    it("returns false when userState is not a string", () => {
      const guard: GuardCondition = {
        type: "stateIn",
        states: ["CA", "NY"],
      };
      expect(evaluateGuard(guard, {})).toBe(false);
    });
  });

  describe("nested composition", () => {
    it("handles deeply nested conditions", () => {
      // "User is uninsured AND (bill > $400 OR hospital is nonprofit)"
      const guard: GuardCondition = {
        type: "and",
        conditions: [
          { type: "equals", field: "insuranceStatus", value: "uninsured" },
          {
            type: "or",
            conditions: [
              { type: "greaterThan", field: "billAmount", value: 400 },
              { type: "equals", field: "isNonprofit", value: true },
            ],
          },
        ],
      };

      // Uninsured + high bill = true
      expect(
        evaluateGuard(guard, {
          insuranceStatus: "uninsured",
          billAmount: 500,
          isNonprofit: false,
        })
      ).toBe(true);

      // Uninsured + nonprofit = true
      expect(
        evaluateGuard(guard, {
          insuranceStatus: "uninsured",
          billAmount: 200,
          isNonprofit: true,
        })
      ).toBe(true);

      // Insured = false regardless
      expect(
        evaluateGuard(guard, {
          insuranceStatus: "insured",
          billAmount: 500,
          isNonprofit: true,
        })
      ).toBe(false);
    });
  });
});
