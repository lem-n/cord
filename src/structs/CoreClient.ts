import { EventEmitter } from 'https://deno.land/std/node/events.ts';
import type { LevelName } from 'https://deno.land/std/log/levels.ts';
import { Gateway } from './gateway/Gateway.ts';
import { RequestHandler } from './rest/RequestHandler.ts';

import { setLogLevel } from './Logger.ts';

import User from '../entities/User.ts';
import type Guild from '../entities/guild/Guild.ts';

export interface ClientOptions {
  token: string;
  logLevel?: LevelName;
}

export default class CoreClient extends EventEmitter {
  public options: ClientOptions;

  public token: string;

  public me: User;

  public gateway: Gateway;

  public rest: RequestHandler;

  public users: Map<string, User>;

  public guilds: Map<string, Guild>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public channels: Map<string, any>;

  constructor(options: ClientOptions) {
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
