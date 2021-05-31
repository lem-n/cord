import { APIEvents, Events } from '../../../utils/mod.ts';
import type { GatewayEventDef } from '../../../interfaces/mod.ts';
import { logger } from '../../Logger.ts';

export const MessageDeleted: GatewayEventDef = {
  name: APIEvents.MESSAGE.DELETED,
  async handle(client, payload) {
    try {
      // returns { messageId, channelId, guildId? }
      const message = await client.rest.getMessage(payload.d.messageId, payload.d.channelId);
      logger.debug('Message deleted', message);
      client.emit(Events.MESSAGE.DELETED, message);
    } catch (err) {
      logger.error(JSON.stringify(err));
    }
  },
};
