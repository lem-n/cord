import { EventEmitter } from 'https://deno.land/std/node/events.ts';
import SocketHandler from './ws/SocketHandler.ts';
import RestHandler from './rest/RestHandler.ts';

import { LevelName } from 'https://deno.land/std/log/levels.ts';
import { setLogLevel } from './Logger.ts';

import User from '../entities/User.ts';
import Guild from '../entities/guild/Guild.ts';

export interface ClientOptions {
  token: string;
  logLevel?: LevelName;
}

export default class CoreClient extends EventEmitter {
  public options: ClientOptions;
  public token: string;
  public me: User;

  public ws: SocketHandler;
  public rest: RestHandler;

  public users: Map<string, User>;
  public guilds: Map<string, Guild>;
  public channels: Map<string, any>;

  constructor(options: ClientOptions) {
    super();

    this.options = options;
    this.options.logLevel = options.logLevel || 'INFO';

    setLogLevel(this.options.logLevel);

    this.token = options.token;
    this.me = new User({});

    this.ws = new SocketHandler(this);
    this.rest = new RestHandler(this);

    this.users = new Map();
    this.guilds = new Map();
    this.channels = new Map();
  }

  async login() {
    this.ws.connect();
  }
}
