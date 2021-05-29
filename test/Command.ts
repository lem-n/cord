import CoreClient from "../src/structs/CoreClient.ts";
import Message from "../src/entities/Message.ts";

export interface CommandConfig {
  name: string;
  description?: string;
  category?: string;
  alias?: string[];
}

export default class Command {
  public name: string;
  public description?: string;
  public category?: string;
  public alias?: string[];

  constructor(config: CommandConfig) {
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.alias = config.alias;
  }

  // deno-lint-ignore no-unused-vars
  run(client: CoreClient, message: Message, args: string[]) {}
}
