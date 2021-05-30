import { APIEvents, Events } from '../../../utils/mod.ts';
import type { GatewayEventDef } from '../../../interfaces/mod.ts';

export const MessageUpdated: GatewayEventDef = {
  name: APIEvents.MESSAGE.UPDATE,
  handle(client, payload) {
    // const message = new Message(payload.d); // may return PartialMessage
    client.emit(Events.MESSAGE.UPDATE, payload.d);
  },
};
