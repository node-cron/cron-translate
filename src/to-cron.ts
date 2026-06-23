// cron-translate — English phrase -> Schedule -> cron (node-cron, 6 fields).
// Maps a natural-language schedule into "second minute hour day-of-month month day-of-week".

const HINT = 'Try a simpler phrasing, or write the cron directly: https://www.nodecron.com/cron-syntax.html';

export class CronTranslateError extends Error {
  hint: string;

  constructor(message: string, hint = HINT) {
    super(message);
    this.name = 'CronTranslateError';
    this.hint = hint;
  }
}

const WEEKDAYS: Record<string, number> = {
  sunday: 0, sun: 0, monday: 1, mon: 1, tuesday: 2, tue: 2, tues: 2,
  wednesday: 3, wed: 3, thursday: 4, thu: 4, thur: 4, thurs: 4,
  friday: 5, fri: 5, saturday: 6, sat: 6,
};

const MONTHS: Record<string, number> = {
  january: 1, jan: 1, february: 2, feb: 2, march: 3, mar: 3, april: 4, apr: 4,
  may: 5, june: 6, jun: 6, july: 7, jul: 7, august: 8, aug: 8,
  september: 9, sep: 9, sept: 9, october: 10, oct: 10, november: 11, nov: 11,
  december: 12, dec: 12,
};

// Day-parts and clock words (hour-of-day).
const TIMEWORDS: Record<string, number> = {
  midnight: 0, morning: 6, noon: 12, midday: 12, afternoon: 15, evening: 20, night: 22,
};

const ORDINALS: Record<string, number | 'L'> = {
  first: 1, second: 2, third: 3, fourth: 4, fifth: 5, last: 'L',
};

const UNITS = new Set(['second', 'minute', 'hour', 'day', 'week', 'month', 'year']);

const PLURALS: Record<string, string> = {
  seconds: 'second', minutes: 'minute', hours: 'hour', days: 'day',
  weeks: 'week', months: 'month', years: 'year',
  weekdays: 'weekday', workdays: 'weekday', workday: 'weekday', weekends: 'weekend',
  mondays: 'monday', tuesdays: 'tuesday', wednesdays: 'wednesday',
  thursdays: 'thursday', fridays: 'friday', saturdays: 'saturday', sundays: 'sunday',
};

const LY: Record<string, string> = {
  daily: 'every day', hourly: 'every hour', weekly: 'every week',
  monthly: 'every month', yearly: 'every year', annually: 'every year',
};

type CronField = 'sec' | 'min' | 'hour' | 'dom' | 'month' | 'dow';

interface Domain {
  key: CronField;
  min: number;
  max: number;
  names?: Record<string, number>;
}

// Numeric field names usable in "[at|on|in] <field> <values>".
const FIELDS: Record<string, Domain> = {
  second: { key: 'sec', min: 0, max: 59 },
  minute: { key: 'min', min: 0, max: 59 },
  hour: { key: 'hour', min: 0, max: 23 },
  day: { key: 'dom', min: 1, max: 31 },
  month: { key: 'month', min: 1, max: 12, names: MONTHS },
};
const DOW: Domain = { key: 'dow', min: 0, max: 7, names: WEEKDAYS };

// Start value used when a field finer than the coarsest set field is left implicit.
const STARTS: Record<CronField, string> = {
  sec: '0', min: '0', hour: '0', dom: '1', month: '1', dow: '*',
};

interface TimeMatch {
  hour: number;
  minute: number | null;
  consumedNext: boolean;
}

function normalize(expression: string): string[] {
  const text = expression.toLowerCase().trim().replace(/,/g, ' , ').replace(/\s+/g, ' ');
  if (!text) return [];
  return text
    .split(' ')
    .map((word) => LY[word] ?? word)
    .join(' ')
    .split(' ')
    .map((word) => PLURALS[word] ?? word);
}

const isNumber = (word: string): boolean => /^\d+$/.test(word);

function ordinalDay(word: string): number | null {
  const match = /^(\d+)(st|nd|rd|th)$/.exec(word);
  return match ? Number(match[1]) : null;
}

// Reads a time from `tok` (and maybe `next`, for "9 am").
function readTime(tok: string, next: string): TimeMatch | null {
  if (tok in TIMEWORDS) return { hour: TIMEWORDS[tok], minute: null, consumedNext: false };
  const match = /^(\d{1,2})(?::(\d{2}))?(am|pm)?$/.exec(tok);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : null;
  let ap = match[3];
  let consumedNext = false;
  if (!ap && (next === 'am' || next === 'pm')) {
    ap = next;
    consumedNext = true;
  }
  if (ap === 'pm' && hour < 12) hour += 12;
  if (ap === 'am' && hour === 12) hour = 0;
  if (hour > 23) throw new CronTranslateError(`'${tok}' is not a valid hour.`);
  if (minute !== null && minute > 59) throw new CronTranslateError(`'${tok}' is not a valid time.`);
  return { hour, minute, consumedNext };
}

/**
 * Translate an English scheduling phrase into a 6-field cron expression
 * (`second minute hour day-of-month month day-of-week`) for node-cron.
 *
 * @throws {CronTranslateError} when the phrase is empty, unrecognized, malformed,
 *   out of range, or sets the same cron field twice with conflicting values.
 */
export function toCron(expression: string): string {
  const words = normalize(expression);
  if (!words.length) throw new CronTranslateError('Empty expression.');

  const schedule: Partial<Record<CronField, string>> = {};
  let i = 0;

  const set = (field: CronField, value: string): void => {
    const current = schedule[field];
    if (current !== undefined && current !== value) {
      throw new CronTranslateError(`Conflicting values for ${field}: '${current}' and '${value}'.`);
    }
    schedule[field] = value;
  };
  const peek = (): string => words[i];
  const reject = (token: string): never => {
    throw new CronTranslateError(`I don't understand '${token}' in this expression.`);
  };

  // ----- value expressions: single | list (a, b and c) | range (a to b) -----

  const isTerm = (token: string, domain: Domain): boolean => {
    if (domain.names && token in domain.names) return true;
    if (isNumber(token)) return true;
    return ordinalDay(token) !== null;
  };

  function readTerm(domain: Domain): number {
    const token = peek();
    let value: number | null = null;
    if (domain.names && token in domain.names) value = domain.names[token];
    else if (isNumber(token)) value = Number(token);
    else value = ordinalDay(token);
    if (value === null) return reject(token);
    if (value < domain.min || value > domain.max) {
      throw new CronTranslateError(`'${token}' is out of range for ${domain.key} (${domain.min}-${domain.max}).`);
    }
    i++;
    return value;
  }

  function readValues(domain: Domain): string {
    const first = readTerm(domain);
    if (peek() === 'to' || peek() === 'through') {
      i++;
      return `${first}-${readTerm(domain)}`;
    }
    const list = [first];
    while (peek() === ',' || peek() === 'and') {
      const save = i;
      i++;
      if (isTerm(peek(), domain)) list.push(readTerm(domain));
      else { i = save; break; }
    }
    return list.join(',');
  }

  // ----- field / keyword handlers -----

  function everyUnit(unit: string): void {
    switch (unit) {
      case 'second': set('sec', '*'); return;
      case 'minute': set('min', '*'); return;
      case 'hour': set('hour', '*'); return;
      case 'day': set('dom', '*'); return;
      case 'week': set('dow', '0'); return;
      case 'month': set('dom', '1'); return;
      case 'year': set('dom', '1'); set('month', '1'); return;
      default: reject(unit);
    }
  }

  function everyInterval(unit: string, n: number): void {
    if (!Number.isInteger(n) || n < 1) throw new CronTranslateError(`Invalid interval '${n}'.`);
    switch (unit) {
      case 'second': set('sec', `*/${n}`); return;
      case 'minute': set('min', `*/${n}`); return;
      case 'hour': set('hour', `*/${n}`); return;
      case 'day': set('dom', `*/${n}`); return;
      case 'month': set('month', `*/${n}`); return;
      default:
        throw new CronTranslateError(`Cron can't express 'every ${n} ${unit}s'.`);
    }
  }

  function consumeOfTheMonth(): void {
    if (peek() === 'of') {
      i++;
      if (peek() === 'the' || peek() === 'every') i++;
      if (peek() === 'month') i++;
    }
  }

  function parseEvery(): void {
    i++; // consume 'every'
    const token = peek();
    // "every last monday of the month", "every first monday", "every last day"
    if (token in ORDINALS && (words[i + 1] in WEEKDAYS || (token === 'last' && words[i + 1] === 'day'))) {
      parseOrdinalWeekday();
      return;
    }
    if (token === 'other') { i++; everyInterval(words[i++], 2); return; }
    if (isNumber(token)) { const n = Number(token); i++; everyInterval(words[i++], n); return; }
    if (UNITS.has(token)) { i++; everyUnit(token); return; }
    if (token === 'weekday') { i++; set('dow', '1-5'); return; }
    if (token === 'weekend') { i++; set('dow', '0,6'); return; }
    if (token in WEEKDAYS) { set('dow', readValues(DOW)); return; }
    if (token in MONTHS) { set('month', readValues(FIELDS.month)); set('dom', '1'); return; }
    if (token in TIMEWORDS) { i++; set('hour', String(TIMEWORDS[token])); return; }
    if (ordinalDay(token) !== null) { set('dom', readValues(FIELDS.day)); return; }
    reject(token);
  }

  function parseAt(): void {
    i++; // consume 'at'
    if (peek() in FIELDS) {
      const domain = FIELDS[peek()];
      i++;
      set(domain.key, readValues(domain));
      return;
    }
    const hours: number[] = [];
    for (;;) {
      const time = readTime(peek(), words[i + 1]);
      if (!time) return reject(peek());
      i += time.consumedNext ? 2 : 1;
      hours.push(time.hour);
      if (time.minute !== null) set('min', String(time.minute));
      if (peek() === 'and' && readTime(words[i + 1], words[i + 2])) { i++; continue; }
      break;
    }
    set('hour', hours.join(','));
  }

  function parseBetween(): void {
    i++; // consume 'between'
    const a = readTime(peek(), words[i + 1]);
    if (!a) return reject(peek());
    i += a.consumedNext ? 2 : 1;
    if (peek() !== 'and') return reject(peek() || 'end of input');
    i++;
    const b = readTime(peek(), words[i + 1]);
    if (!b) return reject(peek());
    i += b.consumedNext ? 2 : 1;
    set('hour', `${a.hour}-${b.hour}`);
  }

  function parseOn(): void {
    i++; // consume 'on'
    if (peek() === 'the') i++;
    if (peek() in FIELDS) {
      const domain = FIELDS[peek()];
      i++;
      set(domain.key, readValues(domain));
      return;
    }
    if (peek() === 'weekday') { i++; set('dow', '1-5'); return; }
    if (peek() === 'weekend') { i++; set('dow', '0,6'); return; }
    if (peek() in WEEKDAYS) { set('dow', readValues(DOW)); return; }
    if (ordinalDay(peek()) !== null) { set('dom', readValues(FIELDS.day)); return; }
    reject(peek());
  }

  function parseIn(): void {
    i++; // consume 'in'
    if (peek() === 'month') { i++; set('month', readValues(FIELDS.month)); return; }
    if (peek() in MONTHS) { set('month', readValues(FIELDS.month)); return; }
    reject(peek());
  }

  function parseOrdinalWeekday(): void {
    const ord = ORDINALS[peek()];
    if (peek() === 'last' && words[i + 1] === 'day') {
      i += 2;
      consumeOfTheMonth();
      set('dom', 'L');
      return;
    }
    if (!(words[i + 1] in WEEKDAYS)) return reject(peek());
    const weekday = WEEKDAYS[words[i + 1]];
    i += 2;
    consumeOfTheMonth();
    set('dow', ord === 'L' ? `${weekday}L` : `${weekday}#${ord}`);
  }

  while (i < words.length) {
    const token = peek();
    if (token === 'every') parseEvery();
    else if (token === 'at') parseAt();
    else if (token === 'between') parseBetween();
    else if (token === 'on') parseOn();
    else if (token === 'in') parseIn();
    else if (token in WEEKDAYS) set('dow', readValues(DOW));
    else if (token === 'the' && words[i + 1] in ORDINALS
      && (words[i + 2] in WEEKDAYS || (words[i + 1] === 'last' && words[i + 2] === 'day'))) {
      i++; // consume 'the' before "last monday of the month"
      parseOrdinalWeekday();
    } else if (token === 'the' || ordinalDay(token) !== null) {
      if (token === 'the') i++;
      set('dom', readValues(FIELDS.day));
      consumeOfTheMonth();
    } else if (token in ORDINALS) parseOrdinalWeekday();
    else reject(token);
  }

  return render(schedule);
}

function render(schedule: Partial<Record<CronField, string>>): string {
  const fields: CronField[] = ['sec', 'min', 'hour', 'dom', 'month'];
  const setIdx: number[] = [];
  fields.forEach((field, ix) => {
    if (schedule[field] !== undefined) setIdx.push(ix);
  });
  if (schedule.dow !== undefined) setIdx.push(3);
  if (!setIdx.length) throw new CronTranslateError('Could not understand the expression.');

  const finest = Math.min(...setIdx);
  const out = fields.map((field, ix) => schedule[field] ?? (ix < finest ? STARTS[field] : '*'));
  out.push(schedule.dow ?? '*');
  return out.join(' ');
}
