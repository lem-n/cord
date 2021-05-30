import type { ClientOptions } from '../src/structs/CoreClient.ts';
import CoreClient from '../src/structs/CoreClient.ts';
import logger from '../src/structs/Logger.ts';
import type Command from './Command.ts';

export default class Client extends CoreClient {
  public commands: { [key: string]: Command };

  public aliases: { [key: string]: string };

  public commandHelp?: string;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = {};
    this.aliases = {};
  }

  async loadCommands() {
    for (const file of Deno.readDirSync('./test/commands')) {
      const clazz = await import(`./commands/${file.name}`);
      // eslint-disable-next-line new-cap
      const command: Command = new clazz.default();
      this.commands[command.name] = command;
      // map aliases
      if (command.alias && command.alias.length !== 0) {
        for (const alias of command.alias) {
          if (!this.aliases[alias]) this.aliases[alias] = command.name;
        }
      }
    }

    // preformat the command help string

    const groups: { [k: string]: Command[] } = {};
    for (const [_, cmd] of Object.entries(this.commands)) {
      if (cmd.category) {
        if (groups[cmd.category]) groups[cmd.category].push(cmd);
        else {
          groups[cmd.category] = [];
          groups[cmd.category].push(cmd);
        }
      }
    }

    this.commandHelp = Object.keys(groups)
      .map((groupName) => {
        const cmds = groups[groupName];
        const cmdStr = cmds.map((cmd) => `\`${cmd.name}\` - ${cmd.description}`).join('\n');
        return `__**${groupName.charAt(0).toUpperCase() + groupName.slice(1)} commands**__\n${cmdStr}`;
      })
      .join('\n');

    logger.info('Commands loaded');
  }
}
