import { APIEvents, Events } from "../../../Constants.ts";
import CoreClient from "../../CoreClient.ts";
import Payload from "../../../interfaces/Payload.ts";
import User from "../../../entities/User.ts";

export default {
  name: APIEvents.READY,
  handle(client: CoreClient, payload: Payload) {
    const data = payload.d;

    client.gateway.sessionId = data.session_id;
    client.gateway.identified = true;

    client.me = new User(data.user);
    client.emit(Events.READY, data);
  },
};
