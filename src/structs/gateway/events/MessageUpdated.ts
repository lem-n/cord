import { APIEvents, Events } from '../../../Constants.ts';
import type CoreClient from '../../CoreClient.ts';
import type { Payload } from '../../../interfaces/Payload.ts';

export default {
  name: APIEvents.MESSAGE.UPDATE,
  handle(client: CoreClient, payload: Payload) {
    // const message = new Message(payload.d); // may return PartialMessage
    client.emit(Events.MESSAGE.UPDATE, payload.d);
  },
};
