# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`cron-translate` is a zero-runtime-dependency library that translates an
English-like expression (e.g. `every 10 minutes from hour 2 to 8`) into a 6-field
cron expression (e.g. `0 */10 2-8 * * *`). Public API is a single function,
`toCron(expression)`, available as both a named and default export.

Source is **TypeScript**; the published package is a **dual ESM + CommonJS**
build (`dist/index.js` / `dist/index.cjs`) with type declarations
(`dist/index.d.ts` / `dist/index.d.cts`), produced by rollup. `engines.node >= 20`.

## Commands

- `npm test` runs the Vitest suite once. `npm run test:watch` for watch mode.
- `npm run test:coverage` runs with v8 coverage (text + html + json-summary).
- Run a single test file: `npx vitest run test/to-cron-minute.test.ts`
- Filter by test name: `npx vitest run -t "every 2 minutes"`
- `npm run typecheck` (`tsc --noEmit`), `npm run lint` (ESLint flat config),
  `npm run build` (rollup, emits `dist/`).

## Architecture

The cron output is a **6-field** expression (note: includes seconds, unlike
standard 5-field cron): `second minute hour day month week`. This order is the
`fields` array in `src/to-cron.ts` and the cron output is built as an array
indexed by `fields.indexOf(name)`, then joined with spaces.

`src/to-cron.ts` is the entire engine; `src/index.ts` only re-exports `toCron`.
The translation pipeline in `toCron()`:

1. Normalize plural field names to singular via regex (`minutes` to `minute`,
   etc.) using the parallel `pluralFields` / `fields` arrays.
2. Split the expression on spaces into a flat `commands` token array.
3. Loop: `readNextCommand` slices off the next command's tokens, `applyCommand`
   mutates the `cron` array, then those tokens are dropped. Multiple commands in
   one expression compose by writing to different cron-array slots.

Key functions:

- `readNextCommand(commands)` is the tokenizer. It decides how many tokens the
  next command consumes based on the leading keyword (`every` = 2 or 3, `on` = 3,
  `from` = 5, or 6 when a `week` field is involved because of the extra token).
- `applyCommand(cron, command)` is the writer. It branches on `every` / `on` /
  `from` and writes the resolved value into the correct cron slot.
- `applyDefaultValues(field, cron)` fills the *more-specific* fields with their
  defaults so a coarse command still yields a complete expression (e.g. `every
  hour` zeroes second and minute). Only fills slots not already set, so later
  commands and combined expressions keep their values.

### Names vs numbers

Month and week-day names (full and abbreviated, e.g. `monday`/`mon`,
`january`/`jan`) are valid values, defined in the `months` and `weekDays`
arrays. The "is this token a month/week-day name" check is centralized in the
`isMonthName` / `isWeekDayName` helpers, which use a substring-match idiom
(`names.filter(n => token.toLowerCase().indexOf(n) >= 0).join(',').indexOf(token) >= 0`)
so combined tokens like `jan,feb` match. Note `applyCommand`'s `on` branch
deliberately uses exact `weekDays.indexOf` / `months.indexOf` instead, matching
the original behavior, so don't blindly swap those for the helpers.

Invalid expressions throw `Error` (e.g. `new Error('Invalid expression!')`).

## Tests

Tests live in `test/`, one Vitest file (`*.test.ts`) per cron field plus an
invalid-expression file. They import `toCron` from `../src/index` and assert on
exact output strings with `expect(...).toBe(...)`. Adding a new operator or value
form means adding cases across the relevant per-field files.
