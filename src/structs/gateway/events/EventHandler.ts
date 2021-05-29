import type CoreClient from '../../CoreClient.ts';
import MessageCreated from './MessageCreated.ts';
import MessageUpdated from './MessageUpdated.ts';
import MessageDeleted from './MessageDeleted.ts';
import Ready from './Ready.ts';
import GuildCreated from './GuildCreated.ts';
import Resumed from './Resumed.ts';
import type { Payload } from '../../../interfaces/Payload.ts';

export type HandlerFunction = (client: CoreClient, payload: Payload) => void;

export interface Handler {
  name: string;
  handler: HandlerFunction;
}

export class EventHandler {
  private client: CoreClient;

  private handlers: { [index: string]: HandlerFunction };

  constructor(client: CoreClient) {
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
