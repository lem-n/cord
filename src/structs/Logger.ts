// import * as log from 'https://deno.land/std/log/mod.ts';
import { blue, yellow, red } from 'https://deno.land/std/fmt/colors.ts';

export default {
  debug(msg: string, ...args: any[]) {
    console.log(`(${blue('DEBUG')})`, msg, ...args);
  },
  eventDebug(eventName: string, msg: string, ...args: any[]) {
    this.debug(`[${yellow(eventName)}]`, msg, ...args);
  },
  error(msg: string, error?: any) {
    console.error(`(${red('ERROR')})`, msg, error!);
  },
};
