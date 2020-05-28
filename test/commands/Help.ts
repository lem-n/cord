import Command from '../Command.ts';
import Client from '../Client.ts';
import Message from '../../src/entities/Message.ts';

export default class Help extends Command {
  constructor() {
    super({
      name: 'help',
      description: 'Shows this menu',
      category: 'utils',
    });
  }

  run(client: Client, message: Message) {
    Message.send(client, message.channelId, '', {
      title: 'Help',
      description: client.commandHelp!,
    });
  }
}
