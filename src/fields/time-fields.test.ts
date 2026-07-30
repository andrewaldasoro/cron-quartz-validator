import { describe, expect, it } from "vitest";
import { validateHours, validateMinutes, validateSeconds, validateYear } from "./time-fields";

describe("validateSeconds / validateMinutes (0-59)", () => {
  it("accepts the wildcard", () => {
    expect(validateSeconds("*")).toBe(true);
  });

  it("accepts boundary values", () => {
    expect(validateSeconds("0")).toBe(true);
    expect(validateSeconds("59")).toBe(true);
    expect(validateMinutes("0")).toBe(true);
    expect(validateMinutes("59")).toBe(true);
  });

  it("rejects out-of-range values", () => {
    expect(validateSeconds("60")).toBe(false);
    expect(validateSeconds("-1")).toBe(false);
  });

  it("accepts a step, a range, and a list", () => {
    expect(validateSeconds("5/10")).toBe(true);
    expect(validateMinutes("10-20")).toBe(true);
    expect(validateMinutes("0,15,30,45")).toBe(true);
  });

  it("rejects a descending range (ranges are now order-checked everywhere)", () => {
    expect(validateMinutes("50-10")).toBe(false);
  });
});

describe("validateHours (0-23)", () => {
  it("accepts boundary values", () => {
    expect(validateHours("0")).toBe(true);
    expect(validateHours("23")).toBe(true);
  });

  it("rejects out-of-range values", () => {
    expect(validateHours("24")).toBe(false);
    expect(validateHours("-1")).toBe(false);
  });
});

describe("validateYear (1970-2199)", () => {
  it("accepts boundary values", () => {
    expect(validateYear("1970")).toBe(true);
    expect(validateYear("2199")).toBe(true);
  });

  it("rejects out-of-range values", () => {
    expect(validateYear("1969")).toBe(false);
    expect(validateYear("2200")).toBe(false);
  });

  it("accepts a valid range and rejects a malformed one", () => {
    expect(validateYear("2020-2030")).toBe(true);
    expect(validateYear("2020-2030-2040")).toBe(false);
  });
});
