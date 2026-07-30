import { describe, expect, it } from "vitest";
import { isValidCronExpression, validateCronExpression } from "./index";

describe("public API", () => {
  it("re-exports validateCronExpression", () => {
    expect(validateCronExpression("0 0 12 * * ?").valid).toBe(true);
  });

  describe("isValidCronExpression", () => {
    it("returns true for a valid expression", () => {
      expect(isValidCronExpression("0 0 12 * * ?")).toBe(true);
    });

    it("returns false for an invalid expression", () => {
      expect(isValidCronExpression("not a cron expression")).toBe(false);
    });
  });
});
