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
    const commandStr = Object.keys(client.commands)
      .map((cmd) => `\`${cmd}\` - ${client.commands[cmd].description || 'No description available'}`)
      .join('\n');

    client.rest.sendChannelMessage(message.channelId, '', {
      title: 'Commands',
      description: commandStr,
    });
  }
}
