import { describe, expect, it } from "vitest";
import { validateDayOfWeek } from "./day-of-week";

describe("validateDayOfWeek", () => {
  it("accepts '*' when dayOfMonth is not also '*'", () => {
    expect(validateDayOfWeek("*", { dayOfMonth: "?" })).toBe(true);
  });

  it("rejects '*' when dayOfMonth is also '*'", () => {
    expect(validateDayOfWeek("*", { dayOfMonth: "*" })).toBe(false);
  });

  it("accepts '?' when dayOfMonth is not also '?'", () => {
    expect(validateDayOfWeek("?", { dayOfMonth: "*" })).toBe(true);
  });

  it("rejects '?' when dayOfMonth is also '?'", () => {
    expect(validateDayOfWeek("?", { dayOfMonth: "?" })).toBe(false);
  });

  const context = { dayOfMonth: "?" };

  it("accepts 'L'", () => {
    expect(validateDayOfWeek("L", context)).toBe(true);
  });

  it("accepts '<0-7>L'", () => {
    expect(validateDayOfWeek("0L", context)).toBe(true);
    expect(validateDayOfWeek("7L", context)).toBe(true);
  });

  it("rejects '8L' (outside the supported 0-7 range)", () => {
    expect(validateDayOfWeek("8L", context)).toBe(false);
  });

  it("accepts day names case-insensitively", () => {
    expect(validateDayOfWeek("sun", context)).toBe(true);
    expect(validateDayOfWeek("FRI", context)).toBe(true);
  });

  it("fixed: rejects a plain weekday number above 7 (was accepted up to 12)", () => {
    expect(validateDayOfWeek("8", context)).toBe(false);
  });

  it("accepts a valid '#nth-weekday' expression", () => {
    expect(validateDayOfWeek("1#2", context)).toBe(true);
  });

  it("accepts occurrence 0", () => {
    expect(validateDayOfWeek("1#0", context)).toBe(true);
  });

  it("rejects '#' occurrence values above 5", () => {
    expect(validateDayOfWeek("1#6", context)).toBe(false);
  });

  it("fixed: rejects a '#' weekday above 7 (was accepted up to 31)", () => {
    expect(validateDayOfWeek("10#2", context)).toBe(false);
  });

  it("rejects a malformed '#' expression", () => {
    expect(validateDayOfWeek("1#", context)).toBe(false);
    expect(validateDayOfWeek("#2", context)).toBe(false);
  });

  it("accepts an ascending range using names", () => {
    expect(validateDayOfWeek("mon-fri", context)).toBe(true);
  });

  it("rejects a descending range", () => {
    expect(validateDayOfWeek("fri-mon", context)).toBe(false);
  });

  it("fixed: accepts a list of day names (was validated against month rules)", () => {
    expect(validateDayOfWeek("mon,fri", context)).toBe(true);
  });

  it("accepts a numeric list", () => {
    expect(validateDayOfWeek("2,5", context)).toBe(true);
  });
});
