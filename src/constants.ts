export type Boundaries = readonly [min: number, max: number];

export const MONTH_NAMES: readonly string[] = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export const DAY_NAMES: readonly string[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

export const SECONDS_BOUNDARIES: Boundaries = [0, 59];
export const MINUTES_BOUNDARIES: Boundaries = SECONDS_BOUNDARIES;
export const HOURS_BOUNDARIES: Boundaries = [0, 23];
export const DAY_OF_MONTH_BOUNDARIES: Boundaries = [1, 31];
export const MONTH_BOUNDARIES: Boundaries = [1, 12];
export const DAY_OF_WEEK_BOUNDARIES: Boundaries = [1, 7];
export const YEAR_BOUNDARIES: Boundaries = [1970, 2199];
