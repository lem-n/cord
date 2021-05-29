import { APIEvents, Events } from '../../../Constants.ts';
import type CoreClient from '../../CoreClient.ts';
import type { Payload } from '../../../interfaces/Payload.ts';

export default {
  name: APIEvents.MESSAGE.DELETED,
  handle(client: CoreClient, payload: Payload) {
    // returns { messageId, channelId, guildId? }
    client.emit(Events.MESSAGE.DELETED, payload.d);
  },
};
