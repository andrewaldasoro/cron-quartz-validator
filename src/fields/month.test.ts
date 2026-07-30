import { describe, expect, it } from "vitest";
import { validateMonth } from "./month";

describe("validateMonth", () => {
  it("accepts the wildcard", () => {
    expect(validateMonth("*")).toBe(true);
  });

  it("accepts boundary numeric values (1-12)", () => {
    expect(validateMonth("1")).toBe(true);
    expect(validateMonth("12")).toBe(true);
  });

  it("rejects out-of-range numeric values", () => {
    expect(validateMonth("0")).toBe(false);
    expect(validateMonth("13")).toBe(false);
  });

  it("accepts month names case-insensitively", () => {
    expect(validateMonth("jan")).toBe(true);
    expect(validateMonth("DEC")).toBe(true);
  });

  it("rejects an unrecognized name", () => {
    expect(validateMonth("foo")).toBe(false);
  });

  it("accepts a valid step", () => {
    expect(validateMonth("3/6")).toBe(true);
  });

  it("rejects a malformed step (extra segment)", () => {
    expect(validateMonth("1/2/3")).toBe(false);
  });

  it("accepts an ascending range using names", () => {
    expect(validateMonth("jan-mar")).toBe(true);
  });

  it("accepts an ascending range mixing a name and a number", () => {
    expect(validateMonth("jan-6")).toBe(true);
  });

  it("fixed: rejects a descending ('backwards') range", () => {
    expect(validateMonth("dec-jan")).toBe(false);
  });

  it("accepts a valid list of names and numbers", () => {
    expect(validateMonth("jan,3,dec")).toBe(true);
  });

  it("rejects a list containing an invalid member", () => {
    expect(validateMonth("jan,foo")).toBe(false);
  });
});
