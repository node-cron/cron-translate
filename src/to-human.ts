// cron-translate — reverse direction: cron -> Schedule -> English (readback).
// Produces a readable sentence that toCron() parses back to the same expression,
// so `toCron(toHuman(cron))` round-trips. See PRODUCT.md §9.

import { CronTranslateError } from './to-cron';

const MONTH_NAMES = [
  '', 'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];
const DOW_NAMES = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];
const ORD_WORDS = ['', 'first', 'second', 'third', 'fourth', 'fifth'];

const MONTH_NUMS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
const DOW_NUMS: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

const wild = (v: string): boolean => v === '*';
const stepOf = (v: string): number | null => {
  const m = /^\*\/(\d+)$/.exec(v);
  return m ? Number(m[1]) : null;
};
const isSpecific = (v: string): boolean => !wild(v) && stepOf(v) === null;
const isSingle = (v: string): boolean => /^\d+$/.test(v);
const isRange = (v: string): boolean => /^\d+-\d+$/.test(v);

// Map full/abbreviated names in a field to numbers (e.g. "MON-FRI" -> "1-5").
function mapNames(field: string, table: Record<string, number>): string {
  return field.replace(/[a-z]+/gi, (word) => {
    const key = word.toLowerCase().slice(0, 3);
    return key in table ? String(table[key]) : word;
  });
}

function clock(h: number, m: number): string {
  if (m === 0 && h === 0) return 'midnight';
  if (m === 0 && h === 12) return 'noon';
  const ampm = h < 12 ? 'am' : 'pm';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${ampm}` : `${h12}:${String(m).padStart(2, '0')}${ampm}`;
}

// Render a field value (single / list / range) into English, optionally via names.
function renderValues(field: string, names?: string[]): string {
  const name = (v: string): string => (names ? names[Number(v)] : v);
  const parts = field.split(',').map((part) => {
    const dash = part.indexOf('-');
    if (dash > 0) return `${name(part.slice(0, dash))} to ${name(part.slice(dash + 1))}`;
    return name(part);
  });
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

// A specific (non-wild, non-step) hour value rendered as a time clause.
function hourClause(hour: string): string {
  if (isSingle(hour)) return `at ${clock(Number(hour), 0)}`;
  if (isRange(hour)) {
    const dash = hour.indexOf('-');
    return `between ${clock(Number(hour.slice(0, dash)), 0)} and ${clock(Number(hour.slice(dash + 1)), 0)}`;
  }
  return `at hour ${renderValues(hour)}`;
}

function renderTime(sec: string, min: string, hour: string): string[] {
  const cl: string[] = [];
  const second = (): void => { if (sec !== '0' && isSpecific(sec)) cl.push(`at second ${renderValues(sec)}`); };
  const coarserHour = (): void => { if (isSpecific(hour)) cl.push(hourClause(hour)); };

  const secStep = stepOf(sec);
  const minStep = stepOf(min);
  const hourStep = stepOf(hour);

  // Base frequency = the finest wild / step field.
  if (wild(sec)) { cl.push('every second'); coarserHour(); return cl; }
  if (secStep !== null) { cl.push(`every ${secStep} seconds`); coarserHour(); return cl; }

  if (wild(min)) { cl.push('every minute'); coarserHour(); second(); return cl; }
  if (minStep !== null) { cl.push(`every ${minStep} minutes`); coarserHour(); second(); return cl; }

  if (wild(hour)) {
    if (min === '0') {
      if (sec === '0') { cl.push('every hour'); return cl; }
      cl.push(`at second ${renderValues(sec)}`);
      cl.push('at minute 0');
      return cl;
    }
    cl.push(`at minute ${renderValues(min)}`);
    second();
    return cl;
  }
  if (hourStep !== null) {
    cl.push(`every ${hourStep} hours`);
    if (min !== '0') cl.push(`at minute ${renderValues(min)}`);
    second();
    return cl;
  }

  // Hour is specific: a clock time.
  if (sec === '0' && min === '0') { cl.push(hourClause(hour)); return cl; }
  if (sec === '0' && isSingle(hour) && isSingle(min)) {
    cl.push(`at ${clock(Number(hour), Number(min))}`);
    return cl;
  }
  cl.push(`at hour ${renderValues(hour)}`);
  if (min !== '0') cl.push(`at minute ${renderValues(min)}`);
  second();
  return cl;
}

function renderConstraints(dom: string, month: string, dow: string): string[] {
  const cl: string[] = [];

  if (dom !== '*') {
    const step = stepOf(dom);
    if (step !== null) cl.push(`every ${step} days`);
    else if (dom === 'L') cl.push('last day of the month');
    else cl.push(`on day ${renderValues(dom)}`);
  }

  if (month !== '*') {
    const step = stepOf(month);
    if (step !== null) cl.push(`every ${step} months`);
    else cl.push(`in ${renderValues(month, MONTH_NAMES)}`);
  }

  if (dow !== '*') {
    const last = /^(\d+)L$/.exec(dow);
    const nth = /^(\d+)#(\d+)$/.exec(dow);
    if (last) cl.push(`last ${DOW_NAMES[Number(last[1])]} of the month`);
    else if (nth) cl.push(`${ORD_WORDS[Number(nth[2])]} ${DOW_NAMES[Number(nth[1])]} of the month`);
    else cl.push(`on ${renderValues(dow, DOW_NAMES)}`);
  }

  return cl;
}

/**
 * Describe a node-cron expression (5 or 6 fields) in plain English.
 *
 * The output is phrased so that `toCron()` parses it back to the same
 * expression — `toCron(toHuman(cron))` round-trips.
 *
 * @throws {CronTranslateError} when the expression doesn't have 5 or 6 fields.
 */
export function toHuman(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5 && parts.length !== 6) {
    throw new CronTranslateError(`Expected a 5- or 6-field cron expression, got ${parts.length} fields.`);
  }
  const [sec, min, hour, dom, monthRaw, dowRaw] = parts.length === 6
    ? parts
    : ['0', ...parts];
  const month = mapNames(monthRaw, MONTH_NUMS);
  const dow = mapNames(dowRaw, DOW_NUMS);

  const time = renderTime(sec, min, hour);
  const constraints = renderConstraints(dom, month, dow);

  // "at midnight" (the all-zero day-level time) is the default cron defaults to,
  // so drop it when a coarser constraint already carries the schedule.
  const midnightDefault = sec === '0' && min === '0' && hour === '0';
  const clauses = midnightDefault && constraints.length ? constraints : [...time, ...constraints];

  return clauses.join(' ');
}
