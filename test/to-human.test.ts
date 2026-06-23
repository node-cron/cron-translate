import { describe, it, expect } from 'vitest';
import { toCron, toHuman } from '../src/index';

// Reverse direction (readback). The core property: the English toHuman produces
// parses back to the same cron — toCron(toHuman(cron)) === cron.

describe('toHuman — round-trips through toCron', () => {
  const crons = [
    '0 * * * * *', '0 */5 * * * *', '0 */15 * * * *', '0 0 * * * *', '0 0 */2 * * *',
    '0 0 0 * * *', '0 0 0 * * 0', '0 0 0 1 * *', '0 0 0 1 1 *', '0 0 0 */2 * *', '0 0 0 1 */2 *',
    '0 0 9 * * *', '0 0 17 * * *', '0 30 14 * * *', '0 0 12 * * *', '0 */5 9 * * *', '0 */5 12 * * *',
    '0 0 18,20 * * *', '30 * * * * *', '0,30 * * * * *', '0-10 * * * * *', '0 15 * * * *',
    '0 0,15,30,45 * * * *', '0 1-30 * * * *', '0 0 9,12,17 * * *', '0 0 9-17 * * *',
    '0 0 0 15 * *', '0 0 0 1,15 * *', '0 0 0 1-10 * *', '0 0 0 1 3 *', '0 0 0 1 3,6 *', '0 0 0 1 3-6 *',
    '0 0 0 1 1,2,3 *', '0 0 0 * * 1', '0 0 0 * * 1,5', '0 0 0 * * 1-5', '0 0 18 * * 1-5',
    '0 0 0 * * 0,6', '0 0 17 * * 2,4', '0 0 0 L * *', '0 0 0 * * 5L', '0 0 9 * * 1#1',
    '0 0 6 * * *', '0 0 20 * * *', '0 */30 9-17 * * 1-5', '* * * * * *', '30 0 * * * *',
  ];
  it.each(crons)('%s round-trips', (cron) => {
    expect(toCron(toHuman(cron))).toBe(cron);
  });
});

describe('toHuman — 5-field input (seconds implied)', () => {
  const cases: [string, string][] = [
    ['* * * * *', '0 * * * * *'],
    ['0 9 * * 1-5', '0 0 9 * * 1-5'],
    ['*/5 * * * *', '0 */5 * * * *'],
  ];
  it.each(cases)('%s round-trips to %s', (five, six) => {
    expect(toCron(toHuman(five))).toBe(six);
  });
});

describe('toHuman — readable phrasing', () => {
  const cases: [string, string][] = [
    ['0 * * * * *', 'every minute'],
    ['0 */5 * * * *', 'every 5 minutes'],
    ['0 0 * * * *', 'every hour'],
    ['0 0 0 * * *', 'at midnight'],
    ['0 0 9 * * *', 'at 9am'],
    ['0 30 14 * * *', 'at 2:30pm'],
    ['0 0 12 * * *', 'at noon'],
    ['0 0 18 * * 1-5', 'at 6pm on monday to friday'],
    ['0 */5 9 * * *', 'every 5 minutes at 9am'],
    ['0 0 0 * * 5L', 'last friday of the month'],
    ['0 0 0 L * *', 'last day of the month'],
    ['0 0,15,30,45 * * * *', 'at minute 0, 15, 30 and 45'],
    ['0 1-30 * * * *', 'at minute 1 to 30'],
    ['0 0 9-17 * * *', 'between 9am and 5pm'],
    ['0 0 0 1,15 * *', 'on day 1 and 15'],
    ['0 0 0 1 3-6 *', 'on day 1 in march to june'],
    ['0 0 0 * * 0,6', 'on sunday and saturday'],
    ['0 */30 9-17 * * 1-5', 'every 30 minutes between 9am and 5pm on monday to friday'],
    ['30 * * * * *', 'every minute at second 30'],
    ['0 0 0 1 * *', 'on day 1'],
  ];
  it.each(cases)('%s => %s', (cron, expected) => {
    expect(toHuman(cron)).toBe(expected);
  });
});

describe('toHuman — accepts month/weekday names in input', () => {
  it.each([
    ['30 9 * * MON-FRI', '0 30 9 * * 1-5'],
    ['0 0 0 1 JAN *', '0 0 0 1 1 *'],
  ] as [string, string][])('%s round-trips to %s', (cron, six) => {
    expect(toCron(toHuman(cron))).toBe(six);
  });
});

describe('toHuman — treats ? (Quartz no-value) like *', () => {
  const cases: [string, string][] = [
    ['0 0 9 ? * MON', 'at 9am on monday'],
    ['0 0 9 15 * ?', 'at 9am on day 15'],
    ['0 0 0 ? * 1-5', 'on monday to friday'],
  ];
  it.each(cases)('%s => %s', (cron, expected) => {
    expect(toHuman(cron)).toBe(expected);
  });
});

describe('toHuman — rejects malformed input', () => {
  it.each(['', 'a b c', '1 2 3 4 5 6 7'])('rejects %j', (bad) => {
    expect(() => toHuman(bad)).toThrow();
  });
});
