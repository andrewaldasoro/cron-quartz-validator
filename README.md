# cron-quartz-validator

[![npm version](https://img.shields.io/npm/v/cron-quartz-validator.svg)](https://www.npmjs.com/package/cron-quartz-validator)
[![Test](https://github.com/andrewaldasoro/cron-quartz-validator/actions/workflows/test.yml/badge.svg)](https://github.com/andrewaldasoro/cron-quartz-validator/actions/workflows/test.yml)
[![TypeScript](https://img.shields.io/badge/-TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/cron-quartz-validator.svg)](./LICENSE)

cron-quartz-validator is a **Node.js** library (written in TypeScript) to validate **Quartz** cron expressions.

## Installation

```bash
npm install cron-quartz-validator
```

## Usage

**`validateCronExpression`** takes a _string_ (the cron expression) and returns `{ valid: boolean, errors: string[] }`:

```ts
import { validateCronExpression } from "cron-quartz-validator";

validateCronExpression("0 0 12 * * ?");
// { valid: true, errors: [] }

validateCronExpression("* * * * * * *");
// { valid: false, errors: [ ... ] }

validateCronExpression("* * * * 25/2 ? *");
// { valid: false, errors: [ "Month must be between 1 and 12, or JAN-DEC" ] }
```

**`isValidCronExpression`** is a convenience wrapper that just returns the `boolean`:

```ts
import { isValidCronExpression } from "cron-quartz-validator";

if (isValidCronExpression("0 0 12 1/2 * ? *")) {
  // Your code
}
```

## Cron accepted values

    Seconds:      0-59       *  ,  -  /
    Minutes:      0-59       *  ,  -  /
    Hours:        0-23       *  ,  -  /
    Day of Month: 1-31       *  ,  -  /  ?  L  LW
    Month:        1-12 or JAN-DEC   *  ,  -  /
    Day of Week:  1-7  or SUN-SAT   *  ,  -  /  ?  L  #
    Year:         1970-2199  *  ,  -  /  (optional 7th field)

## Development

```bash
pnpm i
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint .
pnpm test       # vitest run
pnpm build      # tsc -p tsconfig.build.json -> dist/
```

CI runs typecheck, lint, and the test suite on every push to `main` and on every pull request (`.github/workflows/test.yml`). Publishing to npm happens via `.github/workflows/publish.yml`, triggered by pushing a `v*.*.*` tag. Dependabot keeps dependencies and workflow actions up to date (`.github/dependabot.yml`).

## License

ISC
