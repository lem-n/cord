import Command from '../Command.ts';

export default class Ping extends Command {
  constructor() {
    super({
      name: 'test',
      description: 'Shows bot latency',
      alias: ['latency'],
      category: 'utils',
    });
  }
}
