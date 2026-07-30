import { describe, expect, it } from "vitest";
import { parseCronInt } from "./parse-cron-int";

describe("parseCronInt", () => {
  it("parses positive integers", () => {
    expect(parseCronInt("5")).toBe(5);
  });

  it("parses signed integers", () => {
    expect(parseCronInt("+5")).toBe(5);
    expect(parseCronInt("-5")).toBe(-5);
  });

  it("parses integers with leading zeros", () => {
    expect(parseCronInt("007")).toBe(7);
  });

  it("returns NaN for non-numeric input", () => {
    expect(parseCronInt("abc")).toBeNaN();
    expect(parseCronInt("")).toBeNaN();
    expect(parseCronInt("*")).toBeNaN();
  });

  it("returns NaN for 'Infinity' rather than treating it as a number", () => {
    expect(parseCronInt("Infinity")).toBeNaN();
  });

  it("returns NaN for a number with trailing garbage", () => {
    expect(parseCronInt("5L")).toBeNaN();
    expect(parseCronInt("5.5")).toBeNaN();
  });
});
