import { APIEvents, Events } from '../../../utils/mod.ts';
import type { GatewayEventDef } from '../../../interfaces/mod.ts';

export const MessageDeleted: GatewayEventDef = {
  name: APIEvents.MESSAGE.DELETED,
  handle(client, payload) {
    // returns { messageId, channelId, guildId? }
    client.emit(Events.MESSAGE.DELETED, payload.d);
  },
};
