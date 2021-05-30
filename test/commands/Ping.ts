import Command from '../Command.ts';
import type Client from '../Client.ts';
import { Message } from '../../mod.ts';

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
    const pingMessage = await Message.send(
      client,
      message.channelId,
      'Pinging...',
    );
    const timeDiff = Math.abs(
      message.timestamp.getMilliseconds() - pingMessage.timestamp.getMilliseconds(),
    );
    pingMessage.edit(client, pingMessage, `Ping is \`${timeDiff} ms\``);
  }
}
