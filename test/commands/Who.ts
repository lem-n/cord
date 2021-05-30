import Message from '../../src/entities/Message.ts';
import type User from '../../src/entities/User.ts';
import logger from '../../src/structs/Logger.ts';
import type Client from '../Client.ts';
import Command from '../Command.ts';

export default class Who extends Command {
  constructor() {
    super({
      name: 'who',
      category: 'utils',
      description: 'Does a search for users in the server',
    });
  }

  run(client: Client, message: Message) {
    const content = this.getContentWithoutName(message);
    let retUser: User | undefined;

    const searchTag = /^#[0-9]{4}$/.test(content.trim());

    console.dir(client.users);

    client.users.forEach((user) => {
      logger.info('user tag:', user.discriminator);
      if (searchTag && user.discriminator === content.trim()) {
        retUser = user;
      } else if (user.username.includes(content)) {
        retUser = user;
      }
    });

    if (!retUser) return;

    Message.send(client, message.channelId, `${retUser.username}:#${retUser.discriminator}`);
  }
}
