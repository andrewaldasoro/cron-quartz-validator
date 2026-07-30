export function parseCronInt(value: string): number {
  return /^[-+]?\d+$/.test(value) ? Number(value) : NaN;
}
