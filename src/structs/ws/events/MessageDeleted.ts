import { APIEvents, Events } from '../../../Constants.ts';
import CoreClient from '../../CoreClient.ts';
import Payload from '../../../interfaces/Payload.ts';

export default {
  name: APIEvents.MESSAGE.DELETED,
  handle(client: CoreClient, payload: Payload) {
    // returns { messageId, channelId, guildId? }
    client.emit(Events.MESSAGE.DELETED, payload.d);
  },
};
