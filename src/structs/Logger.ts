// import * as log from 'https://deno.land/std/log/mod.ts';
import { blue, yellow, red, cyan, magenta } from 'https://deno.land/std/fmt/colors.ts';

export default {
  info(msg: string, ...args: any[]) {
    console.log(`(${cyan('INFO')})`, msg, ...args);
  },
  debug(msg: string, ...args: any[]) {
    console.log(`(${blue('DEBUG')})`, msg, ...args);
  },
  warn(msg: string, ...args: any[]) {
    console.log(`(${yellow('WARN')})`, msg, ...args);
  },
  eventDebug(eventName: string, msg: string, ...args: any[]) {
    this.debug(`[${magenta(eventName)}]`, msg, ...args);
  },
  error(msg: string, error?: any) {
    console.error(`(${red('ERROR')})`, msg, error!);
  },
};
