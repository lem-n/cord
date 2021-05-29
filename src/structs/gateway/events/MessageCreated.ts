import { APIEvents, Events } from '../../../Constants.ts';
import type CoreClient from '../../CoreClient.ts';
import type { Payload } from '../../../interfaces/Payload.ts';
import Message from '../../../entities/Message.ts';

export default {
  name: APIEvents.MESSAGE.CREATE,
  handle(client: CoreClient, payload: Payload) {
    const message = new Message(client, payload.d);
    client.emit(Events.MESSAGE.CREATE, message);
  },
};
