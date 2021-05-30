import Command from '../Command.ts';
import type Client from '../Client.ts';
import { Message } from '../../mod.ts';

export default class Help extends Command {
  constructor() {
    super({
      name: 'help',
      description: 'Shows this menu',
      category: 'utils',
    });
  }

  run(client: Client, message: Message, args: string[]) {
    // give command specific information
    if (args[0]) {
      const cmd = client.commands[args[0]];
      if (cmd) {
        Message.send(client, message.channelId, '', {
          title: `Command \`${cmd.name}\``,
          description: cmd.description,
        });
      } else {
        Message.send(client, message.channelId, `No command with name ${args[0]}`);
      }
    } else {
      Message.send(client, message.channelId, '', {
        title: 'Help',
        description: client.commandHelp!,
      });
    }
  }
}
