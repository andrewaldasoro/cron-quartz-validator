import { DAY_OF_MONTH_BOUNDARIES } from "../constants.js";
import { isWithinBoundaries, validateOperatorExpression } from "../utils/operator-grammar.js";
import { parseCronInt } from "../utils/parse-cron-int.js";

const LAST_DAY_TOKEN = /^(l|lw|[1-7]l)$/i;

export interface DayOfMonthContext {
  dayOfWeek: string;
}

export function validateDayOfMonth(value: string, context: DayOfMonthContext): boolean {
  if (value === "*") return context.dayOfWeek !== "*";
  if (value === "?") return context.dayOfWeek !== "?";
  if (LAST_DAY_TOKEN.test(value)) return true;

  return validateOperatorExpression(value, {
    isValidAtom: (token) => isWithinBoundaries(parseCronInt(token), DAY_OF_MONTH_BOUNDARIES),
    resolveOrderValue: parseCronInt,
  });
}
