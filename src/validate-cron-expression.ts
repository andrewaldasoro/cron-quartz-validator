import { HOURS_BOUNDARIES, MINUTES_BOUNDARIES, SECONDS_BOUNDARIES, YEAR_BOUNDARIES } from "./constants.js";
import { CRON_ERRORS } from "./errors.js";
import { validateDayOfMonth } from "./fields/day-of-month.js";
import { validateDayOfWeek } from "./fields/day-of-week.js";
import { validateMonth } from "./fields/month.js";
import { validateBoundedNumericField } from "./fields/time-fields.js";

export interface CronValidationResult {
  valid: boolean;
  errors: string[];
}

const EXPECTED_FIELD_COUNTS = [6, 7];

export function validateCronExpression(expression: string): CronValidationResult {
  if (!expression.includes(" ")) {
    return { valid: false, errors: [CRON_ERRORS.NO_SPACES] };
  }

  const fields = expression.trim().split(/\s+/);
  if (!EXPECTED_FIELD_COUNTS.includes(fields.length)) {
    return { valid: false, errors: [CRON_ERRORS.WRONG_FIELD_COUNT] };
  }

  const [seconds, minutes, hours, dayOfMonth, month, dayOfWeek, year] = fields;
  const errors: string[] = [];

  if (!validateBoundedNumericField(seconds, SECONDS_BOUNDARIES)) {
    errors.push(CRON_ERRORS.SECONDS_OUT_OF_RANGE);
  }
  if (!validateBoundedNumericField(minutes, MINUTES_BOUNDARIES)) {
    errors.push(CRON_ERRORS.MINUTES_OUT_OF_RANGE);
  }
  if (!validateBoundedNumericField(hours, HOURS_BOUNDARIES)) {
    errors.push(CRON_ERRORS.HOURS_OUT_OF_RANGE);
  }
  if (!validateDayOfMonth(dayOfMonth, { dayOfWeek })) {
    errors.push(resolveDayOfMonthError(dayOfMonth));
  }
  if (!validateMonth(month)) {
    errors.push(CRON_ERRORS.MONTH_OUT_OF_RANGE);
  }
  if (!validateDayOfWeek(dayOfWeek, { dayOfMonth })) {
    errors.push(resolveDayOfWeekError(dayOfWeek));
  }
  if (year !== undefined && !validateBoundedNumericField(year, YEAR_BOUNDARIES)) {
    errors.push(CRON_ERRORS.YEAR_OUT_OF_RANGE);
  }

  return { valid: errors.length === 0, errors };
}

function resolveDayOfMonthError(value: string): string {
  if (value === "*" || value === "?") {
    return CRON_ERRORS.DAY_OF_MONTH_CONFLICTS_WITH_DAY_OF_WEEK;
  }
  return CRON_ERRORS.DAY_OF_MONTH_OUT_OF_RANGE;
}

function resolveDayOfWeekError(value: string): string {
  if (value === "*" || value === "?") {
    return CRON_ERRORS.DAY_OF_WEEK_CONFLICTS_WITH_DAY_OF_MONTH;
  }
  if (value.includes("#")) {
    return CRON_ERRORS.DAY_OF_WEEK_INVALID_OCCURRENCE;
  }
  return CRON_ERRORS.DAY_OF_WEEK_OUT_OF_RANGE;
}
