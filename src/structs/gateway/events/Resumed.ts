import { APIEvents, Events } from '../../../Constants.ts';
import type CoreClient from '../../CoreClient.ts';
import type { Payload } from '../../../interfaces/Payload.ts';

export default {
  name: APIEvents.RESUMED,
  handle(client: CoreClient, payload: Payload) {
    client.emit(Events.RESUMED, payload.d);
  },
};
