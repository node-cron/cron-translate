import { describe, it, expect } from 'vitest';
import { toCron } from '../src/index';

// Executable contract: English phrase -> node-cron 6-field cron
// ("second minute hour day-of-month month day-of-week").

function table(cases: [string, string][]): void {
  it.each(cases)('%s => %s', (input, expected) => {
    expect(toCron(input)).toBe(expected);
  });
}

describe('toCron — frequency / interval', () => {
  table([
    ['every minute', '0 * * * * *'],
    ['every 5 minutes', '0 */5 * * * *'],
    ['every 15 minutes', '0 */15 * * * *'],
    ['every hour', '0 0 * * * *'],
    ['every 2 hours', '0 0 */2 * * *'],
    ['every day', '0 0 0 * * *'],
    ['every week', '0 0 0 * * 0'],
    ['every month', '0 0 0 1 * *'],
    ['every year', '0 0 0 1 1 *'],
    ['every other day', '0 0 0 */2 * *'],
    ['every 2 months', '0 0 0 1 */2 *'], // regression: dom anchors to 1, not 0
  ]);
});

describe('toCron — time of day', () => {
  table([
    ['every day at 9am', '0 0 9 * * *'],
    ['every day at 5pm', '0 0 17 * * *'],
    ['every day at 14:30', '0 30 14 * * *'],
    ['every day at noon', '0 0 12 * * *'],
    ['every day at midnight', '0 0 0 * * *'],
    ['every 5 minutes at 9am', '0 */5 9 * * *'],
    ['every 5 minutes at noon', '0 */5 12 * * *'], // day-part keeps minute open
    ['every day at 6pm and 8pm', '0 0 18,20 * * *'],
  ]);
});

describe('toCron — second field (single / list / range)', () => {
  table([
    ['at second 30', '30 * * * * *'],
    ['at seconds 0 and 30', '0,30 * * * * *'],
    ['at second 0 to 10', '0-10 * * * * *'],
  ]);
});

describe('toCron — minute field (single / list / range)', () => {
  table([
    ['at minute 15', '0 15 * * * *'],
    ['at minutes 0, 15, 30 and 45', '0 0,15,30,45 * * * *'],
    ['at minute 1 to 30', '0 1-30 * * * *'],
  ]);
});

describe('toCron — hour field (single / list / range)', () => {
  table([
    ['at hour 9', '0 0 9 * * *'],
    ['at hours 9, 12 and 17', '0 0 9,12,17 * * *'],
    ['at hour 9 to 17', '0 0 9-17 * * *'],
  ]);
});

describe('toCron — day-of-month field (single / list / range)', () => {
  table([
    ['on day 15', '0 0 0 15 * *'],
    ['on days 1 and 15', '0 0 0 1,15 * *'],
    ['on day 1 to 10', '0 0 0 1-10 * *'],
    ['on the 1st and 15th', '0 0 0 1,15 * *'],
  ]);
});

describe('toCron — month field (single / list / range, names)', () => {
  table([
    ['in march', '0 0 0 1 3 *'],
    ['in march and june', '0 0 0 1 3,6 *'],
    ['in march to june', '0 0 0 1 3-6 *'],
    ['in jan, feb and mar', '0 0 0 1 1,2,3 *'],
    ['every january', '0 0 0 1 1 *'],
    ['every jan', '0 0 0 1 1 *'],
  ]);
});

describe('toCron — day-of-week field (single / list / range, names)', () => {
  table([
    ['every monday', '0 0 0 * * 1'],
    ['every mon', '0 0 0 * * 1'],
    ['on monday and friday', '0 0 0 * * 1,5'],
    ['every monday, friday', '0 0 0 * * 1,5'],
    ['on monday to friday', '0 0 0 * * 1-5'],
    ['monday through friday', '0 0 0 * * 1-5'],
    ['every weekday at 6pm', '0 0 18 * * 1-5'],
    ['every weekend', '0 0 0 * * 0,6'],
    ['every tuesday and thursday at 5pm', '0 0 17 * * 2,4'],
  ]);
});

describe('toCron — ordinals (L / #)', () => {
  table([
    ['the 15th of every month', '0 0 0 15 * *'],
    ['last day of the month', '0 0 0 L * *'],
    ['last friday of the month', '0 0 0 * * 5L'],
    ['first monday of the month at 9am', '0 0 9 * * 1#1'],
    // "every" / "the" prefixes on ordinal weekdays
    ['every last monday of the month', '0 0 0 * * 1L'],
    ['the last monday of the month', '0 0 0 * * 1L'],
    ['every first monday of the month', '0 0 0 * * 1#1'],
    ['every second tuesday of the month', '0 0 0 * * 2#2'],
    ['every last day of the month', '0 0 0 L * *'],
    ['the last day of the month', '0 0 0 L * *'],
  ]);
});

describe('toCron — day-parts and ranges', () => {
  table([
    ['every morning', '0 0 6 * * *'],
    ['every evening', '0 0 20 * * *'],
    ['every weekday between 9am and 5pm', '0 0 9-17 * * 1-5'],
    ['every 30 minutes between 9am and 5pm on weekdays', '0 */30 9-17 * * 1-5'],
  ]);
});

describe('toCron — normalization', () => {
  table([
    ['Every Day At 9AM', '0 0 9 * * *'],
    ['  every   day   at 9 am  ', '0 0 9 * * *'],
  ]);
});

describe('toCron — rejected (out of scope / out of range / malformed)', () => {
  const rejected = [
    'the weekday nearest the 15th', // W: node-cron has no W
    'every day until christmas', // counted recurrence
    'every 5 minutes at 9:30am', // same-field conflict (minute)
    'at minute 99', // minute out of range
    'on day 45', // day-of-month out of range
    'every 0 minutes', // interval must be >= 1
    'at 9:99', // invalid time
    'the 45th', // day-of-month out of range
    'banana', // nonsense
    '', // empty
  ];
  it.each(rejected)('rejects %j', (input) => {
    expect(() => toCron(input)).toThrow();
  });
});
