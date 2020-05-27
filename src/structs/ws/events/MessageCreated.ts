import { APIEvents, Events } from '../../../Constants.ts';
import CoreClient from '../../CoreClient.ts';
import Payload from '../../../interfaces/Payload.ts';
import Message from '../../../entities/Message.ts';

export default {
  name: APIEvents.MESSAGE.CREATE,
  handle(client: CoreClient, payload: Payload) {
    const message = new Message(payload.d);
    client.emit(Events.MESSAGE.CREATE, message);
  },
};
