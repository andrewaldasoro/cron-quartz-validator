import { describe, expect, it } from "vitest";
import { CRON_ERRORS } from "./errors";
import { validateCronExpression } from "./validate-cron-expression";

describe("validateCronExpression", () => {
  it("accepts a valid 6-field expression", () => {
    expect(validateCronExpression("0 0 12 * * ?")).toEqual({ valid: true, errors: [] });
  });

  it("accepts a valid 7-field expression with a year", () => {
    expect(validateCronExpression("0 0 12 * * ? 2025").valid).toBe(true);
  });

  it("rejects an expression with no spaces at all", () => {
    expect(validateCronExpression("0*12***")).toEqual({
      valid: false,
      errors: [CRON_ERRORS.NO_SPACES],
    });
  });

  it("rejects an expression with too few fields", () => {
    expect(validateCronExpression("0 0 12 * *")).toEqual({
      valid: false,
      errors: [CRON_ERRORS.WRONG_FIELD_COUNT],
    });
  });

  it("rejects an expression with too many fields", () => {
    expect(validateCronExpression("0 0 12 * * ? 2025 extra").valid).toBe(false);
  });

  it("fixed: collapses repeated whitespace instead of letting it misalign fields", () => {
    expect(validateCronExpression("0  0 12 * * ?").valid).toBe(true);
  });

  it("collects an error for every invalid field, not just the first", () => {
    const result = validateCronExpression("60 0 99 * * ?");
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([CRON_ERRORS.SECONDS_OUT_OF_RANGE, CRON_ERRORS.HOURS_OUT_OF_RANGE]);
  });

  it("reports a conflict error when both dayOfMonth and dayOfWeek are '?'", () => {
    expect(validateCronExpression("0 0 12 ? * ?")).toEqual({
      valid: false,
      errors: [
        CRON_ERRORS.DAY_OF_MONTH_CONFLICTS_WITH_DAY_OF_WEEK,
        CRON_ERRORS.DAY_OF_WEEK_CONFLICTS_WITH_DAY_OF_MONTH,
      ],
    });
  });

  it("rejects both dayOfMonth and dayOfWeek being '*'", () => {
    expect(validateCronExpression("0 0 12 * * *").valid).toBe(false);
  });

  it("rejects a year field outside 1970-2199", () => {
    expect(validateCronExpression("0 0 12 * * ? 1969").errors).toContain(
      CRON_ERRORS.YEAR_OUT_OF_RANGE
    );
  });

  it("reports a distinct occurrence error for an invalid '#' day-of-week", () => {
    expect(validateCronExpression("0 0 12 ? * 1#9").errors).toContain(
      CRON_ERRORS.DAY_OF_WEEK_INVALID_OCCURRENCE
    );
  });

  it("accepts a complex, fully valid expression", () => {
    expect(validateCronExpression("0 15 10 ? * MON-FRI 2025-2030").valid).toBe(true);
  });

  it("is a pure function: repeated calls don't share or accumulate state", () => {
    const first = validateCronExpression("0 0 12 * *");
    const second = validateCronExpression("0 0 12 * * ?");

    expect(first.errors).toHaveLength(1);
    expect(second.errors).toHaveLength(0);
    expect(first.errors).not.toBe(second.errors);
  });
});
