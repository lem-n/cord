import { EventEmitter } from 'https://deno.land/std/node/events.ts';
import SocketHandler from './ws/SocketHandler.ts';
import RestHandler from './rest/RestHandler.ts';

import User from '../entities/User.ts';
import Guild from '../entities/guild/Guild.ts';

export interface ClientOptions {
  token: string;
  logLevel?: 'info' | 'warn' | 'error' | 'debug';
}

export default class CoreClient extends EventEmitter {
  public options: ClientOptions;
  public token: string;
  public me: User;

  public socket: SocketHandler;
  public rest: RestHandler;

  public users: Map<string, User>;
  public guilds: Map<string, Guild>;
  public channels: Map<string, any>;

  constructor(options: ClientOptions) {
    super();

    this.options = options;
    this.token = options.token;
    this.me = new User({});

    this.socket = new SocketHandler(this);
    this.rest = new RestHandler(this);

    this.users = new Map();
    this.guilds = new Map();
    this.channels = new Map();
  }

  async login() {
    this.socket.connect();
  }
}
