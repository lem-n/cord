import { APIEvents, Events } from '../../../Constants.ts';
import CoreClient from '../../CoreClient.ts';
import Payload from '../../../interfaces/Payload.ts';

export default {
  name: APIEvents.MESSAGE.UPDATE,
  handle(client: CoreClient, payload: Payload) {
    // const message = new Message(payload.d); // may return PartialMessage
    client.emit(Events.MESSAGE.UPDATE, payload.d);
  },
};
