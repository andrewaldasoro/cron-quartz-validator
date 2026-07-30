export const CRON_ERRORS = {
  NO_SPACES: "Cron expression fields must be separated by spaces",
  WRONG_FIELD_COUNT: "Cron expression must have 6 fields, or 7 including a year",
  SECONDS_OUT_OF_RANGE: "Seconds must be between 0 and 59",
  MINUTES_OUT_OF_RANGE: "Minutes must be between 0 and 59",
  HOURS_OUT_OF_RANGE: "Hours must be between 0 and 23",
  DAY_OF_MONTH_OUT_OF_RANGE:
    "Day-of-month must be between 1 and 31, or use *, ?, L, LW, -, /, ,",
  DAY_OF_MONTH_CONFLICTS_WITH_DAY_OF_WEEK:
    "Exactly one of day-of-month or day-of-week must be '*' or '?', not both",
  MONTH_OUT_OF_RANGE: "Month must be between 1 and 12, or JAN-DEC",
  DAY_OF_WEEK_OUT_OF_RANGE: "Day-of-week must be between 1 and 7, or SUN-SAT",
  DAY_OF_WEEK_CONFLICTS_WITH_DAY_OF_MONTH:
    "Exactly one of day-of-month or day-of-week must be '*' or '?', not both",
  DAY_OF_WEEK_INVALID_OCCURRENCE: "The occurrence after '#' must be between 0 and 5",
  YEAR_OUT_OF_RANGE: "Year must be between 1970 and 2199",
} as const;
