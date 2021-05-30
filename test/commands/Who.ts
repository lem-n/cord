import { Message } from '../../mod.ts';
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
    Message.send(client, message.channelId, 'WIP');

    // const content = this.getContentWithoutName(message);
    // let retUser: User | undefined;

    // const searchTag = /^#[0-9]{4}$/.test(content.trim());

    // console.dir(client.users);

    // client.users.forEach((user) => {
    //   if (searchTag && user.discriminator === content.trim()) {
    //     retUser = user;
    //   } else if (user.username.includes(content)) {
    //     retUser = user;
    //   }
    // });

    // if (!retUser) return;

    // Message.send(client, message.channelId, `${retUser.username}:#${retUser.discriminator}`);
  }
}
