import Command from '../Command.ts';
import Client from '../Client.ts';
import Message from '../../src/entities/Message.ts';

export default class Ping extends Command {
  constructor() {
    super({
      name: 'ping',
      description: 'Shows bot latency',
      alias: ['latency'],
      category: 'utils',
    });
  }

  async run(client: Client, message: Message) {
    client.rest.sendChannelMessage(message.channelId, 'Pinging...').then((msg) => {
      const timeDiff = Math.abs(message.timestamp.getMilliseconds() - msg.timestamp.getMilliseconds());
      client.rest.editMessageText(msg.channelId, msg.id, `Ping is \`${timeDiff} ms\``);
    });
  }
}
