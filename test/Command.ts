import type { Message } from '../mod.ts';
import type Client from './Client.ts';

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

  getContentWithoutName(message: Message) {
    return message.content.slice(this.name.length).trim();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(client: Client, message: Message, args: string[]) {}
}
