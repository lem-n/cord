import { EventEmitter } from 'https://deno.land/std/node/events.ts';
import type { LevelName } from 'https://deno.land/std/log/levels.ts';
import { Gateway } from './gateway/mod.ts';
import { RequestHandler } from './rest/mod.ts';

import { setLogLevel } from './Logger.ts';

import type { Guild } from '../entities/mod.ts';
import { User } from '../entities/mod.ts';

export interface CordOptions {
  token: string;
  logLevel?: LevelName;
  intents: number[]
}

export class Cord extends EventEmitter {
  public options: CordOptions;

  public token: string;

  public me: User;

  public gateway: Gateway;

  public rest: RequestHandler;

  public users: Map<string, User>;

  public guilds: Map<string, Guild>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public channels: Map<string, any>;

  constructor(options: CordOptions) {
    super();

    this.options = options;
    this.options.logLevel = options.logLevel || 'INFO';

    setLogLevel(this.options.logLevel);

    this.token = options.token;
    this.me = new User({});

    this.gateway = new Gateway(this);
    this.rest = new RequestHandler(this);

    this.users = new Map();
    this.guilds = new Map();
    this.channels = new Map();
  }

  login() {
    return this.gateway.connect();
  }
}
