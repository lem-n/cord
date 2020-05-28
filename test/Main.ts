import Client from './Client.ts';
import config from './config.ts';
import Guild from '../src/entities/guild/Guild.ts';
import Message from '../src/entities/Message.ts';
import UserStatus from '../src/entities/UserStatus.ts';
import Activity from '../src/entities/Activity.ts';
import Logger from '../src/structs/Logger.ts';

const client = new Client({ token: config.token, logLevel: 'DEBUG' });

client.loadCommands();

client.on('ready', () => {
  Logger.info('Bot started!');

  setTimeout(() => {
    if (!client.me.presence?.game) {
      const status = new UserStatus({
        since: null,
        afk: false,
        game: new Activity({
          name: 'Made with Cord',
          type: 0,
        }),
        status: 'online',
      });
      client.socket.updateStatus(status);
    }
  }, 3000);
});

client.on('guildCreated', (guild: Guild) => {
  Logger.info('Guild ->', guild.name);
});

client.on('message', (message: Message) => {
  if (message.author.bot || message.author.id === client.me.id) return;
  if (message.content.charAt(0) !== config.prefix) return;

  const commandName = message.content.split(/\s+/g)[0].slice(1);

  // run command
  if (client.commands[commandName]) client.commands[commandName].run(client, message);
  else client.rest.reactToMessage(message.channelId, message.id, '🚫');
});

client.login();
