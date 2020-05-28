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
    const groups: { [k: string]: Command[] } = {};
    for (const [_, cmd] of Object.entries(client.commands)) {
      if (cmd.category) {
        if (groups[cmd.category]) groups[cmd.category].push(cmd);
        else {
          groups[cmd.category] = [];
          groups[cmd.category].push(cmd);
        }
      }
    }

    const helpStr = Object.keys(groups)
      .map((groupName) => {
        const cmds = groups[groupName];
        const cmdStr = cmds.map((cmd) => `\`${cmd.name}\` - ${cmd.description}`).join('\n');
        return `__**${groupName.charAt(0).toUpperCase() + groupName.slice(1)} commands**__\n${cmdStr}`;
      })
      .join('\n');

    Message.send(client, message.channelId, '', {
      title: 'Help',
      description: helpStr,
    });
  }
}
