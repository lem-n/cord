import { APIEvents, Events } from '../../../utils/mod.ts';
import { Message } from '../../../entities/mod.ts';
import type { GatewayEventDef } from '../../../interfaces/mod.ts';

export const MessageCreated: GatewayEventDef = {
  name: APIEvents.MESSAGE.CREATE,
  handle(client, payload) {
    const message = new Message(client, payload.d);
    client.emit(Events.MESSAGE.CREATE, message);
  },
};
