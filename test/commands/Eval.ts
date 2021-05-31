import Command from '../Command.ts';
import type Client from '../Client.ts';
import { Message } from '../../mod.ts';

export default class Eval extends Command {
  constructor() {
    super({
      name: 'eval',
      description: 'Evaluates a JS expression',
      category: 'dev',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redactOutput(client: Client, output: any) {
    const filter = new RegExp(`${client.token}`, 'g');
    const inspected = Deno.inspect(output, { depth: 2 });
    const final = inspected.replace(filter, '[REDACTED]');
    return final;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(client: Client, message: Message) {
    try {
      const code = this.getContentWithoutName(message);
      const startTime = Date.now();
      // eslint-disable-next-line no-eval
      let result = eval(code);
      const elapsed = Date.now() - startTime;

      const type = typeof result;
      result = this.redactOutput(client, result);

      const inputStr = `\`\`\`js\n${code}\n\`\`\``;
      const outputStr = `\`\`\`js\n${result}\n\`\`\``;

      const finalStr = `:inbox_tray: **Input** ${inputStr}`
        + `\n:outbox_tray: **Output** - **Type**: \`${type}\` ${outputStr}`
        + `\n*Executed in \`${elapsed.toFixed(4)}ms\`*`;

      Message.send(client, message.channelId, '', {
        title: 'Eval',
        description: finalStr,
      });
    } catch (err) {
      Message.send(client, message.channelId, `\`\`\`js\n${err.toString()}\n\`\`\``);
    }
  }
}
