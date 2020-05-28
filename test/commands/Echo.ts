import Command from '../Command.ts';
import Client from '../Client.ts';
import Message from '../../src/entities/Message.ts';

export default class Echo extends Command {
  constructor() {
    super({
      name: 'echo',
      description: 'Repeats a message',
      category: 'test',
    });
  }

  async run(client: Client, message: Message) {
    const messageContent = message.content.slice(this.name.length + 1);
    Message.send(client, message.channelId, messageContent);
  }
}
