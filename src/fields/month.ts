import { MONTH_BOUNDARIES, MONTH_NAMES } from "../constants.js";
import { isWithinBoundaries, validateOperatorExpression } from "../utils/operator-grammar.js";
import { parseCronInt } from "../utils/parse-cron-int.js";

function resolveMonthOrderValue(token: string): number {
  const numeric = parseCronInt(token);
  if (!Number.isNaN(numeric)) return numeric;

  const index = MONTH_NAMES.indexOf(token.toLowerCase());
  return index === -1 ? NaN : index + 1;
}

function isValidMonthAtom(token: string): boolean {
  return (
    isWithinBoundaries(parseCronInt(token), MONTH_BOUNDARIES) ||
    MONTH_NAMES.includes(token.toLowerCase())
  );
}

export function validateMonth(value: string): boolean {
  if (value === "*") return true;

  return validateOperatorExpression(value, {
    isValidAtom: isValidMonthAtom,
    resolveOrderValue: resolveMonthOrderValue,
  });
}
