import Command from "../Command.ts";
import Client from "../Client.ts";
import Message from "../../src/entities/Message.ts";

export default class Ping extends Command {
  constructor() {
    super({
      name: "test",
      description: "Shows bot latency",
      alias: ["latency"],
      category: "utils",
    });
  }

  async run(client: Client, message: Message) {}
}
