import type { Message } from '../../mod.ts';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(client: Client, message: Message, args: string[]) {
    // TODO: implement
  }
}
