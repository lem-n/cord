import * as path from 'https://deno.land/std/path/mod.ts';
import CoreClient, { ClientOptions } from '../src/structs/CoreClient.ts';
import Command from './Command.ts';

export default class Client extends CoreClient {
  public commands: { [key: string]: Command };

  constructor(options: ClientOptions) {
    super(options);
    this.commands = {};
  }

  async loadCommands() {
    for (const file of Deno.readDirSync('./test/commands')) {
      const clazz = await import(`./commands/${file.name}`);
      const command: Command = new clazz.default();
      this.commands[command.name] = command;
    }
    console.log('Commands loaded');
  }
}
