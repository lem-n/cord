import * as log from 'https://deno.land/std/log/mod.ts';
import type { LevelName } from 'https://deno.land/std/log/levels.ts';
import { getLevelByName } from 'https://deno.land/std/log/levels.ts';
import {
  blue,
  cyan,
  magenta,
  red,
  reset,
  white,
  yellow,
} from 'https://deno.land/std/fmt/colors.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatLogLevel(record: any) {
  let str;
  if (
    record.level === log.LogLevels.ERROR
    || record.level === log.LogLevels.CRITICAL
  ) {
    str = `(${red(record.levelName)})`;
  } else if (record.level === log.LogLevels.WARNING) {
    str = `(${yellow(record.levelName)})`;
  } else if (record.level === log.LogLevels.DEBUG) {
    str = `(${blue(record.levelName)})`;
  } else {
    str = `(${cyan(record.levelName)})`;
  }
  return white(str);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatArgs(args: any[]) {
  if (args.length > 0) {
    const str = args.map((arg) => Deno.inspect(arg)).join(' ');
    return str;
  }
  return '';
}

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler('DEBUG', {
      formatter: (record) => {
        const loglevel = formatLogLevel(record);

        let msg = '';
        if (
          record.level === log.LogLevels.ERROR
          || record.level === log.LogLevels.CRITICAL
        ) {
          msg = `${loglevel} ${red(record.msg)}`;
        } else msg = `${loglevel} ${reset(record.msg)}`;

        const args = formatArgs(record.args);
        return `${msg}${args && ` ${args}`}`;
      },
    }),
    events: new log.handlers.ConsoleHandler('DEBUG', {
      formatter: (record) => {
        const loglevel = formatLogLevel(record);
        const msg = `${loglevel} [${
          magenta(record.args[0] as string)
        }] ${record.msg}`;

        const args = formatArgs(record.args.slice(1));
        return `${msg}${args && ` ${args}`}`;
      },
    }),
  },
  loggers: {
    default: {
      level: 'DEBUG',
      handlers: ['console'],
    },
    events: {
      level: 'DEBUG',
      handlers: ['events'],
    },
  },
});

const logger = log.getLogger();
export const eventLogger = log.getLogger('events');

export function setLogLevel(levelName: LevelName) {
  const level = getLevelByName(levelName);
  logger.level = level;
  eventLogger.level = level;
}

export default logger;
