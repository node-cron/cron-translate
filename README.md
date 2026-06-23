# cron-translate

[![CI](https://github.com/node-cron/cron-translate/actions/workflows/ci.yml/badge.svg)](https://github.com/node-cron/cron-translate/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/cron-translate.svg)](https://www.npmjs.com/package/cron-translate)
[![npm downloads](https://img.shields.io/npm/dm/cron-translate.svg)](https://www.npmjs.com/package/cron-translate)
[![types](https://img.shields.io/npm/types/cron-translate.svg)](https://www.npmjs.com/package/cron-translate)
[![license](https://img.shields.io/npm/l/cron-translate.svg)](https://www.npmjs.com/package/cron-translate)

Translate plain English into cron expressions.

`cron-translate` turns the schedule you would describe out loud ("every weekday at
6pm", "every 15 minutes", "last friday of the month") into a 6-field cron
expression for [node-cron](https://www.nodecron.com).

## Usage

Install `cron-translate`

```
npm install --save cron-translate
```

ESM:

```js
import { toCron } from 'cron-translate';

const cron = toCron('every day at 9am'); // "0 0 9 * * *"
```

CommonJS:

```js
const { toCron } = require('cron-translate');

const cron = toCron('every day at 9am'); // "0 0 9 * * *"
```

The package ships both ESM and CommonJS builds plus TypeScript type declarations.
Requires Node.js >= 20.

## Output

`toCron` returns a 6-field node-cron expression:

```
second  minute  hour  day-of-month  month  day-of-week
```

Day-of-week is `0`-`6` with `0` = Sunday. Month and weekday names you write in the
input are converted to numbers in the output.

## Syntax

A schedule is a sentence with one required frequency and optional clauses:

```
every <frequency> [at <time>] [on <day>] [in <month>]
```

### Frequency

- `every <unit>` — `every minute`, `every hour`, `every day`, `every week`, `every month`, `every year`
- `every <n> <unit>` — `every 5 minutes`, `every 2 hours`
- `every other <unit>` — `every other day`

### Time of day

- 12-hour: `at 9am`, `at 6:30pm`
- 24-hour: `at 14:30`
- words: `at noon`, `at midnight`
- day-parts as a whole schedule: `every morning`, `every evening`, `every night`
- multiple times: `at 9am and 5pm`
- hour range: `between 9am and 5pm`

### Days and months

- weekdays: `every monday`, `on friday`, `every weekday`, `every weekend`
- day-of-month: `on day 15`, `the 15th of every month`
- months: `in march`, `every january`
- ordinals (node-cron `L` / `#`): `last day of the month`, `last friday of the month`, `first monday of the month`

### Values, lists, and ranges

Any field can take a single value, a list, or a range. Address a field by name
(`second`, `minute`, `hour`, `day`, `month`) or by weekday/month name:

| | example | result |
|---|---|---|
| single | `at second 30` | `30 * * * * *` |
| list | `at minutes 0, 15, 30 and 45` | `0 0,15,30,45 * * * *` |
| range | `at minute 1 to 30` | `0 1-30 * * * *` |
| day range | `on day 1 to 10` | `0 0 0 1-10 * *` |
| month list | `in march and june` | `0 0 0 1 3,6 *` |
| weekday range | `on monday to friday` | `0 0 0 * * 1-5` |

Lists use `,` / `and`; ranges use `to` / `through`. Names and abbreviations both
work (`january` / `jan`, `monday` / `mon`).

### Combining clauses

Clauses for different fields compose:

- `every weekday at 6pm` → `0 0 18 * * 1-5`
- `every 5 minutes at 9am` → `0 */5 9 * * *`
- `every 30 minutes between 9am and 5pm on weekdays` → `0 */30 9-17 * * 1-5`
- `first monday of the month at 9am` → `0 0 9 * * 1#1`

## Examples

| Input | Cron |
|---|---|
| `every minute` | `0 * * * * *` |
| `every 15 minutes` | `0 */15 * * * *` |
| `every hour` | `0 0 * * * *` |
| `every day at noon` | `0 0 12 * * *` |
| `every monday at 9am` | `0 0 9 * * 1` |
| `every weekend` | `0 0 0 * * 0,6` |
| `every january` | `0 0 0 1 1 *` |
| `last friday of the month` | `0 0 0 * * 5L` |

## Reverse: describe a cron expression

`toHuman` goes the other way, turning a cron expression (5 or 6 fields) back into
plain English. It's the readback for a `toCron` call: "you wrote X, here is the
cron, which reads as Y."

```js
import { toHuman } from 'cron-translate';

toHuman('0 0 9 * * *');        // "at 9am"
toHuman('0 0 18 * * 1-5');     // "at 6pm on monday to friday"
toHuman('0 */5 9 * * *');      // "every 5 minutes at 9am"
toHuman('0 0 0 * * 5L');       // "last friday of the month"
```

The output is phrased so that `toCron` parses it back to the same expression:
`toCron(toHuman(cron))` returns the original cron. The English may read differently
from the phrase you started with, but it describes the same schedule.

## Errors

`toCron` throws a `CronTranslateError` when the phrase can't be turned into a valid
cron expression: unrecognized words, malformed input, conflicting values for the
same field, or values out of range (minute `0`-`59`, day `1`-`31`, an interval
below `1`, and so on). The error carries a `hint` pointing at the node-cron syntax
reference.

```js
import { toCron, CronTranslateError } from 'cron-translate';

try {
  toCron('the weekday nearest the 15th');
} catch (err) {
  if (err instanceof CronTranslateError) {
    console.error(err.message, err.hint);
  }
}
```

Things cron itself (or node-cron) can't express are rejected on purpose rather
than guessed: the `W` nearest-weekday character, counted recurrence (`until`,
`for N times`), and arbitrary natural language. For those, write the cron directly
with the help of the [node-cron syntax docs](https://www.nodecron.com/cron-syntax.html).
