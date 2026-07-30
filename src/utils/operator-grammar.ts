import type { Boundaries } from "../constants.js";

export function isWithinBoundaries(value: number, [min, max]: Boundaries): boolean {
  return value >= min && value <= max;
}

export interface FieldGrammar {
  isValidAtom: (token: string) => boolean;
  resolveOrderValue: (token: string) => number;
}

/**
 * Shared grammar for cron field values: wildcard, comma lists, dashed
 * ranges, and slash steps. Each field supplies its own notion of "valid
 * atom" and "order value" (e.g. plain bounded numbers, or names like
 * JAN/SUN resolved to a numeric position) and gets list/range/step support
 * for free.
 */
export function validateOperatorExpression(expression: string, grammar: FieldGrammar): boolean {
  if (expression === "*") return true;
  if (expression.includes(",")) return validateList(expression, grammar);
  if (expression.includes("/")) return validateStep(expression, grammar);
  if (expression.includes("-")) return validateRange(expression, grammar);
  return grammar.isValidAtom(expression);
}

function validateList(expression: string, grammar: FieldGrammar): boolean {
  return expression.split(",").every((item) => validateOperatorExpression(item, grammar));
}

function validateStep(expression: string, grammar: FieldGrammar): boolean {
  const parts = expression.split("/");
  if (parts.length !== 2) return false;

  const [start, increment] = parts;
  if (!validateOperatorExpression(start, grammar)) return false;
  if (!grammar.isValidAtom(increment)) return false;

  return isOrdered(start, increment, grammar, (a, b) => a < b);
}

function validateRange(expression: string, grammar: FieldGrammar): boolean {
  const parts = expression.split("-");
  if (parts.length !== 2) return false;

  const [start, end] = parts;
  if (!grammar.isValidAtom(start) || !grammar.isValidAtom(end)) return false;

  return isOrdered(start, end, grammar, (a, b) => a <= b);
}

function isOrdered(
  start: string,
  end: string,
  grammar: FieldGrammar,
  isInOrder: (start: number, end: number) => boolean
): boolean {
  const startValue = grammar.resolveOrderValue(start);
  const endValue = grammar.resolveOrderValue(end);

  // When either side has no meaningful order (e.g. "*"), let atom validity
  // alone decide — there's nothing sensible to compare.
  if (Number.isNaN(startValue) || Number.isNaN(endValue)) return true;

  return isInOrder(startValue, endValue);
}
