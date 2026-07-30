import {
  HOURS_BOUNDARIES,
  MINUTES_BOUNDARIES,
  SECONDS_BOUNDARIES,
  YEAR_BOUNDARIES,
  type Boundaries,
} from "../constants.js";
import { isWithinBoundaries, validateOperatorExpression } from "../utils/operator-grammar.js";
import { parseCronInt } from "../utils/parse-cron-int.js";

/** Seconds, minutes, hours, and year are all plain bounded numeric fields. */
export function validateBoundedNumericField(value: string, boundaries: Boundaries): boolean {
  return validateOperatorExpression(value, {
    isValidAtom: (token) => isWithinBoundaries(parseCronInt(token), boundaries),
    resolveOrderValue: parseCronInt,
  });
}

export const validateSeconds = (value: string): boolean =>
  validateBoundedNumericField(value, SECONDS_BOUNDARIES);

export const validateMinutes = (value: string): boolean =>
  validateBoundedNumericField(value, MINUTES_BOUNDARIES);

export const validateHours = (value: string): boolean =>
  validateBoundedNumericField(value, HOURS_BOUNDARIES);

export const validateYear = (value: string): boolean =>
  validateBoundedNumericField(value, YEAR_BOUNDARIES);
