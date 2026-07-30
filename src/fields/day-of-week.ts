import { DAY_NAMES, DAY_OF_WEEK_BOUNDARIES } from "../constants.js";
import { isWithinBoundaries, validateOperatorExpression } from "../utils/operator-grammar.js";
import { parseCronInt } from "../utils/parse-cron-int.js";

const WEEKDAY_OF_LAST_WEEK_TOKEN = /^[0-7]l$/i;
const MAX_NTH_OCCURRENCE = 5;

export interface DayOfWeekContext {
  dayOfMonth: string;
}

function resolveDayOfWeekOrderValue(token: string): number {
  const numeric = parseCronInt(token);
  if (!Number.isNaN(numeric)) return numeric;

  const index = DAY_NAMES.indexOf(token.toLowerCase());
  return index === -1 ? NaN : index + 1;
}

function isValidDayOfWeekAtom(token: string): boolean {
  return (
    isWithinBoundaries(parseCronInt(token), DAY_OF_WEEK_BOUNDARIES) ||
    DAY_NAMES.includes(token.toLowerCase())
  );
}

function isValidNthWeekdayOccurrence(value: string): boolean {
  const parts = value.split("#");
  if (parts.length !== 2) return false;

  const [weekday, occurrence] = parts.map(parseCronInt);
  if (Number.isNaN(weekday) || Number.isNaN(occurrence)) return false;

  return (
    isWithinBoundaries(weekday, DAY_OF_WEEK_BOUNDARIES) &&
    occurrence >= 0 &&
    occurrence <= MAX_NTH_OCCURRENCE
  );
}

export function validateDayOfWeek(value: string, context: DayOfWeekContext): boolean {
  if (value === "*") return context.dayOfMonth !== "*";
  if (value === "?") return context.dayOfMonth !== "?";
  if (value.toLowerCase() === "l") return true;
  if (WEEKDAY_OF_LAST_WEEK_TOKEN.test(value)) return true;
  if (value.includes("#")) return isValidNthWeekdayOccurrence(value);

  return validateOperatorExpression(value, {
    isValidAtom: isValidDayOfWeekAtom,
    resolveOrderValue: resolveDayOfWeekOrderValue,
  });
}
