import Client from './Client.ts';
import auth from './auth.ts';
import Guild from '../src/entities/guild/Guild.ts';
import Message from '../src/entities/Message.ts';
import UserStatus from '../src/entities/UserStatus.ts';
import Activity from '../src/entities/Activity.ts';

const client = new Client({ token: auth.token });

client.loadCommands();

client.on('ready', () => {
  console.log('Bot started!');

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
  console.log('Guild ->', guild.name);
});

client.on('message', (message: Message) => {
  if (message.author.bot || message.author.id === client.me.id) return;
  if (message.content.charAt(0) !== '-') return;

  const commandName = message.content.split(/\s+/g)[0].slice(1);

  // run command
  if (client.commands[commandName]) client.commands[commandName].run(client, message);
  else client.rest.reactToMessage(message.channelId, message.id, '🚫');
});

client.login();
