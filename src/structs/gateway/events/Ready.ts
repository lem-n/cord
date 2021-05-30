import { APIEvents, Events } from '../../../utils/mod.ts';
import type { GatewayEventDef } from '../../../interfaces/mod.ts';
import { User } from '../../../entities/mod.ts';

export const Ready: GatewayEventDef = {
  name: APIEvents.READY,
  handle(client, payload) {
    const data = payload.d;

    client.gateway.sessionId = data.session_id;
    client.gateway.identified = true;

    client.me = new User(data.user);
    client.emit(Events.READY, data);
  },
};
