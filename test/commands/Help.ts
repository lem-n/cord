import Command from '../Command.ts';
import type Client from '../Client.ts';
import Message from '../../src/entities/Message.ts';

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
      // TODO: implement
    } else {
      Message.send(client, message.channelId, '', {
        title: 'Help',
        description: client.commandHelp!,
      });
    }
  }
}
