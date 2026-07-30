import { describe, expect, it } from "vitest";
import { isWithinBoundaries, validateOperatorExpression, type FieldGrammar } from "./operator-grammar";
import { parseCronInt } from "./parse-cron-int";

const numericGrammar: FieldGrammar = {
  isValidAtom: (token) => isWithinBoundaries(parseCronInt(token), [0, 9]),
  resolveOrderValue: parseCronInt,
};

describe("isWithinBoundaries", () => {
  it("accepts values inside the boundaries, inclusive", () => {
    expect(isWithinBoundaries(0, [0, 9])).toBe(true);
    expect(isWithinBoundaries(9, [0, 9])).toBe(true);
  });

  it("rejects values outside the boundaries", () => {
    expect(isWithinBoundaries(-1, [0, 9])).toBe(false);
    expect(isWithinBoundaries(10, [0, 9])).toBe(false);
  });

  it("rejects NaN", () => {
    expect(isWithinBoundaries(NaN, [0, 9])).toBe(false);
  });
});

describe("validateOperatorExpression", () => {
  it("accepts the wildcard", () => {
    expect(validateOperatorExpression("*", numericGrammar)).toBe(true);
  });

  it("delegates plain values to isValidAtom", () => {
    expect(validateOperatorExpression("5", numericGrammar)).toBe(true);
    expect(validateOperatorExpression("15", numericGrammar)).toBe(false);
  });

  describe("lists", () => {
    it("accepts a list where every item is valid", () => {
      expect(validateOperatorExpression("1,2,3", numericGrammar)).toBe(true);
    });

    it("rejects a list with any invalid item", () => {
      expect(validateOperatorExpression("1,2,15", numericGrammar)).toBe(false);
    });

    it("supports nested operators inside list items", () => {
      expect(validateOperatorExpression("1,3-5,0/2", numericGrammar)).toBe(true);
    });
  });

  describe("ranges", () => {
    it("accepts an ascending range", () => {
      expect(validateOperatorExpression("2-5", numericGrammar)).toBe(true);
    });

    it("accepts a single-value range (start equals end)", () => {
      expect(validateOperatorExpression("5-5", numericGrammar)).toBe(true);
    });

    it("rejects a descending range", () => {
      expect(validateOperatorExpression("5-2", numericGrammar)).toBe(false);
    });

    it("rejects a range with more than two parts", () => {
      expect(validateOperatorExpression("1-2-3", numericGrammar)).toBe(false);
    });

    it("rejects a range with an invalid side", () => {
      expect(validateOperatorExpression("1-15", numericGrammar)).toBe(false);
    });
  });

  describe("steps", () => {
    it("accepts a valid step", () => {
      expect(validateOperatorExpression("1/2", numericGrammar)).toBe(true);
    });

    it("accepts '*' as the step start", () => {
      expect(validateOperatorExpression("*/2", numericGrammar)).toBe(true);
    });

    it("rejects a step where start >= increment", () => {
      expect(validateOperatorExpression("5/5", numericGrammar)).toBe(false);
      expect(validateOperatorExpression("6/5", numericGrammar)).toBe(false);
    });

    it("rejects a step with more than two parts", () => {
      expect(validateOperatorExpression("1/2/3", numericGrammar)).toBe(false);
    });

    it("rejects a step with an invalid increment", () => {
      expect(validateOperatorExpression("1/15", numericGrammar)).toBe(false);
    });
  });

  describe("order resolution with non-numeric atoms", () => {
    const nameGrammar: FieldGrammar = {
      isValidAtom: (token) => ["a", "b", "c"].includes(token),
      resolveOrderValue: (token) => {
        const index = ["a", "b", "c"].indexOf(token);
        return index === -1 ? NaN : index;
      },
    };

    it("enforces order when resolveOrderValue can resolve both sides", () => {
      expect(validateOperatorExpression("a-c", nameGrammar)).toBe(true);
      expect(validateOperatorExpression("c-a", nameGrammar)).toBe(false);
    });

    const partiallyOrderedGrammar: FieldGrammar = {
      isValidAtom: (token) => token === "x" || !Number.isNaN(parseCronInt(token)),
      resolveOrderValue: parseCronInt,
    };

    it("skips the order check when a side can't be resolved to an order value", () => {
      expect(validateOperatorExpression("x-1", partiallyOrderedGrammar)).toBe(true);
    });
  });
});
