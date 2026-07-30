import { describe, expect, it } from "vitest";
import { validateDayOfMonth } from "./day-of-month";

describe("validateDayOfMonth", () => {
  it("accepts '*' when dayOfWeek is not also '*'", () => {
    expect(validateDayOfMonth("*", { dayOfWeek: "?" })).toBe(true);
  });

  it("rejects '*' when dayOfWeek is also '*'", () => {
    expect(validateDayOfMonth("*", { dayOfWeek: "*" })).toBe(false);
  });

  it("accepts '?' when dayOfWeek is not also '?'", () => {
    expect(validateDayOfMonth("?", { dayOfWeek: "*" })).toBe(true);
  });

  it("rejects '?' when dayOfWeek is also '?'", () => {
    expect(validateDayOfMonth("?", { dayOfWeek: "?" })).toBe(false);
  });

  const context = { dayOfWeek: "?" };

  it("accepts 'L' and 'LW' (case-insensitive)", () => {
    expect(validateDayOfMonth("L", context)).toBe(true);
    expect(validateDayOfMonth("lw", context)).toBe(true);
  });

  it("accepts '<1-7>L'", () => {
    expect(validateDayOfMonth("3L", context)).toBe(true);
  });

  it("rejects '8L' (digit out of the supported 1-7 range)", () => {
    expect(validateDayOfMonth("8L", context)).toBe(false);
  });

  it("accepts boundary values (1-31)", () => {
    expect(validateDayOfMonth("1", context)).toBe(true);
    expect(validateDayOfMonth("31", context)).toBe(true);
  });

  it("rejects out-of-range values", () => {
    expect(validateDayOfMonth("0", context)).toBe(false);
    expect(validateDayOfMonth("32", context)).toBe(false);
  });

  it("accepts a valid step", () => {
    expect(validateDayOfMonth("1/5", context)).toBe(true);
  });

  it("rejects a step where start >= increment", () => {
    expect(validateDayOfMonth("10/5", context)).toBe(false);
  });

  it("accepts an ascending range and rejects a descending one", () => {
    expect(validateDayOfMonth("10-20", context)).toBe(true);
    expect(validateDayOfMonth("20-10", context)).toBe(false);
  });

  it("rejects a range ending in 'L'", () => {
    expect(validateDayOfMonth("10-L", context)).toBe(false);
  });

  it("accepts a valid list and rejects one with an out-of-range member", () => {
    expect(validateDayOfMonth("1,15,31", context)).toBe(true);
    expect(validateDayOfMonth("1,32", context)).toBe(false);
  });
});
