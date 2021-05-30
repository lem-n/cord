import type { Cord } from '../../mod.ts';
import type { Payload } from '../../../interfaces/mod.ts';
import {
  Ready, Resumed, MessageCreated, MessageUpdated, MessageDeleted, GuildCreated,
} from './mod.ts';

export type HandlerFunction = (client: Cord, payload: Payload) => void;

export interface Handler {
  name: string;
  handler: HandlerFunction;
}

export class EventHandler {
  private client: Cord;

  private handlers: { [index: string]: HandlerFunction };

  constructor(client: Cord) {
    this.client = client;
    this.handlers = {
      [Ready.name]: Ready.handle,
      [Resumed.name]: Resumed.handle,
      [MessageCreated.name]: MessageCreated.handle,
      [MessageUpdated.name]: MessageUpdated.handle,
      [MessageDeleted.name]: MessageDeleted.handle,
      [GuildCreated.name]: GuildCreated.handle,
    };
  }

  get eventHandlers() {
    return this.handlers;
  }

  handle(eventName: string, payload: Payload) {
    if (this.handlers[eventName]) {
      this.handlers[eventName](this.client, payload);
    }
  }
}
