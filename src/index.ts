export { validateCronExpression, type CronValidationResult } from "./validate-cron-expression.js";

import { validateCronExpression } from "./validate-cron-expression.js";

export function isValidCronExpression(expression: string): boolean {
  return validateCronExpression(expression).valid;
}
