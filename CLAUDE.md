# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Quartz-style cron expression validator, written in TypeScript as a small set of pure functions under `src/`. There is no build step — it's a library consumed as source (`main` points at `src/index.ts`). Tests are colocated next to the code they cover (`src/**/*.test.ts`) and are the source of truth for behavior — if you change a field's semantics, update its test file in the same commit.

## Commands

Package manager is pnpm (`packageManager` field in `package.json`).

```bash
pnpm i              # install dependencies
pnpm test           # run the Vitest suite once
pnpm test:watch     # run Vitest in watch mode
pnpm typecheck      # tsc --noEmit
pnpm lint           # eslint . (flat config in eslint.config.mjs)
```

## Architecture

Everything is a pure function — no classes, no shared mutable state. Every `validate*` function takes a string (plus a small context object for the two cross-referencing fields) and returns a `boolean`; nothing is stored on an instance, so there's no equivalent of the old aliasing/accumulation bugs a stateful validator would have.

- **Entry point**: `src/validate-cron-expression.ts` exports `validateCronExpression(expression): { valid, errors }`. It splits on whitespace (collapsing repeats), checks the field count (6, or 7 with a year), calls one `validate<Field>` per field, and **collects every field's error** (no short-circuiting) into a fresh `errors` array each call. `src/index.ts` re-exports it and adds `isValidCronExpression(expression): boolean` as sugar for callers who just want a boolean — the return *shape* never depends on a flag (unlike the old `verbose` option).
- **Shared operator grammar**: `src/utils/operator-grammar.ts`'s `validateOperatorExpression(expression, grammar)` is the one place that understands `*`, lists (`,`), ranges (`-`), and steps (`/`) — every field routes through it instead of re-implementing the same split/recurse logic. A `grammar` is just `{ isValidAtom, resolveOrderValue }`: `isValidAtom` decides if a single token (no operators) is valid for this field (bounds check, and/or a name like `JAN`/`SUN`); `resolveOrderValue` maps a token to a comparable number so ranges/steps can enforce ascending order (returning `NaN` opts a token out of the order check, e.g. an unresolvable name). Add a new operator here, once, rather than per field.
- **Field modules** (`src/fields/`): `time-fields.ts` covers seconds/minutes/hours/year (identical shape, different `Boundaries` — see `validateBoundedNumericField`). `day-of-month.ts`, `month.ts`, `day-of-week.ts` each handle their own special tokens (`*`/`?` mutual-exclusivity, `L`/`LW`, `#N`) before falling through to the shared grammar for everything else.
- **Mutual exclusivity of day-of-month/day-of-week**: Quartz requires exactly one of the two to be `*`/`?`. `validateDayOfMonth(value, { dayOfWeek })` and `validateDayOfWeek(value, { dayOfMonth })` take the sibling field's raw value explicitly as a parameter — no hidden `this` state.
- **Errors**: `src/errors.ts` (`CRON_ERRORS`) is a flat catalog with exactly one entry per real failure case — no unused/dead messages. The orchestrator maps a failing field to the right message itself (see `resolveDayOfMonthError`/`resolveDayOfWeekError` in `validate-cron-expression.ts`); field validators never know about error text.
- **Numeric parsing**: `src/utils/parse-cron-int.ts`'s `parseCronInt()` is the only numeric coercion path (`^[-+]?\d+$`, so `"Infinity"` is rejected, unlike the old regex). Boundary checks (`isWithinBoundaries`) rely on `NaN` comparisons always being `false` — keep using `parseCronInt`/`isWithinBoundaries` rather than `parseInt`/manual checks.

Fixed relative to the original class-based version (previously undocumented bugs, corrected during the functional rewrite): day-of-week's numeric bound was `1-12` instead of `1-7`; its `#N` occurrence check bounded the weekday against `31` instead of `7`; day-of-week comma-lists were validated against month rules instead of weekday rules; `month` ranges never checked that start ≤ end (now enforced for all ranges, via `resolveOrderValue`).

## Style

ESLint uses the flat config in `eslint.config.mjs`: `@eslint/js` recommended + `typescript-eslint` recommended, no project-specific rule overrides.
