import { APIEvents, Events } from '../../../utils/mod.ts';
import type { GatewayEventDef } from '../../../interfaces/mod.ts';

export const Resumed: GatewayEventDef = {
  name: APIEvents.RESUMED,
  handle(client, payload) {
    client.emit(Events.RESUMED, payload.d);
  },
};
