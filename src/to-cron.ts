const fields = ['second', 'minute', 'hour', 'day', 'month', 'week'];
const pluralFields = ['seconds', 'minutes', 'hours', 'days', 'months', 'weeks'];
const validCommands = ['every', 'on', 'from'];
const weekDays = [
  'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat',
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
];
const months = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
  'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
  'september', 'october', 'november', 'december',
];

function indexOfField(field: string): number {
  return fields.indexOf(field);
}

/**
 * Whether the token is a (full or abbreviated) month name, e.g. `jan` / `january`.
 * Mirrors the original substring-match idiom so combined names like `jan,feb` match.
 */
function isMonthName(token: string): boolean {
  return months.filter((m) => token.toLowerCase().indexOf(m) >= 0).join(',').indexOf(token) >= 0;
}

/** Whether the token is a (full or abbreviated) week-day name, e.g. `mon` / `monday`. */
function isWeekDayName(token: string): boolean {
  return weekDays.filter((d) => token.toLowerCase().indexOf(d) >= 0).join(',').indexOf(token) >= 0;
}

/** Slice off the tokens that make up the next command, based on its leading keyword. */
function readNextCommand(commands: string[]): string[] {
  const command = commands[0];
  switch (command) {
    case 'every':
      if (validCommands.indexOf(commands[2]) >= 0) {
        return commands.slice(0, 2);
      }
      return commands.slice(0, 3);
    case 'on':
      return commands.slice(0, 3);
    case 'from':
      if (commands.indexOf('week') > 0) return commands.slice(0, 6);
      return commands.slice(0, 5);
    default:
      throw new Error(`invalid expression at ${command}`);
  }
}

/** Fill the more-specific cron slots with their defaults, without overwriting set values. */
function applyDefaultValues(field: string, cron: string[]): void {
  const set = (name: string, value: string): void => {
    if (!cron[indexOfField(name)]) cron[indexOfField(name)] = value;
  };
  switch (field) {
    case 'second':
      set('week', '*'); set('month', '*'); set('day', '*'); set('hour', '*'); set('minute', '*');
      return;
    case 'minute':
      set('week', '*'); set('month', '*'); set('day', '*'); set('hour', '*'); set('second', '0');
      return;
    case 'hour':
      set('week', '*'); set('month', '*'); set('day', '*'); set('minute', '0'); set('second', '0');
      return;
    case 'day':
      set('week', '*'); set('month', '*'); set('hour', '0'); set('minute', '0'); set('second', '0');
      return;
  }
  if (field === 'month' || isMonthName(field)) {
    set('week', '*'); set('day', '1'); set('hour', '0'); set('minute', '0'); set('second', '0');
    return;
  }
  if (field === 'week' || isWeekDayName(field)) {
    set('month', '*'); set('day', '*'); set('hour', '0'); set('minute', '0'); set('second', '0');
  }
}

/** Resolve a single command into the cron array. */
function applyCommand(cron: string[], command: string[]): void {
  switch (command[0]) {
    case 'every':
      if (command.length === 2) { // every [field]
        applyDefaultValues(command[1], cron);
        if (command[1] === 'week') {
          cron[indexOfField(command[1])] = '0';
        } else if (isWeekDayName(command[1])) {
          cron[indexOfField('week')] = command[1].toLowerCase();
        } else if (isMonthName(command[1])) {
          cron[indexOfField('month')] = command[1].toLowerCase();
        } else {
          cron[indexOfField(command[1])] = '*';
        }
      } else if (indexOfField(command[1]) >= 0) { // every [field] [value]
        applyDefaultValues(command[1], cron);
        cron[indexOfField(command[1])] = command[2];
      } else { // every [value] [field]
        applyDefaultValues(command[2], cron);
        cron[indexOfField(command[2])] = `*/${command[1]}`;
      }
      break;
    case 'on':
      applyDefaultValues(command[1], cron);
      if (weekDays.indexOf(command[1]) >= 0) {
        cron[indexOfField('week')] = command[1].toLowerCase();
      } else if (months.indexOf(command[1]) >= 0) {
        cron[indexOfField('month')] = command[1].toLowerCase();
      } else {
        cron[indexOfField(command[1])] = command[2];
      }
      break;
    case 'from':
      applyDefaultValues(command[1], cron);
      if (command[1] === 'week') {
        cron[indexOfField(command[1])] = `${command[3]}-${command[5]}`;
      } else if (isMonthName(command[1])) {
        cron[indexOfField('month')] = `${command[1]}-${command[3]}`;
      } else if (isWeekDayName(command[1])) {
        cron[indexOfField('week')] = `${command[1]}-${command[3]}`;
      } else {
        cron[indexOfField(command[1])] = `${command[2]}-${command[4]}`;
      }
      break;
  }
}

/**
 * Translate an English-like expression into a 6-field cron expression
 * (`second minute hour day month week`).
 *
 * @throws {Error} when the expression is empty/unrecognized or contains an invalid command.
 */
export function toCron(expression: string): string {
  let normalized = expression;
  pluralFields.forEach((item, index) => {
    normalized = normalized.replace(new RegExp(item, 'g'), fields[index]);
  });

  let commands = normalized.split(' ');
  const cron: string[] = [];

  while (commands.length > 0) {
    const nextCommand = readNextCommand(commands);
    applyCommand(cron, nextCommand);
    commands = commands.slice(nextCommand.length);
  }

  const cronExpression = cron.join(' ').trim();
  if (!cronExpression) {
    throw new Error('Invalid expression!');
  }
  return cronExpression;
}
