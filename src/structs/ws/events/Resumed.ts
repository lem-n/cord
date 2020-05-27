import { APIEvents, Events } from '../../../Constants.ts';
import CoreClient from '../../CoreClient.ts';
import Payload from '../../../interfaces/Payload.ts';

export default {
  name: APIEvents.RESUMED,
  handle(client: CoreClient, payload: Payload) {
    client.emit(Events.RESUMED, payload.d);
  },
};
