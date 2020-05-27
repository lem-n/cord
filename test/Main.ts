import CoreClient from '../src/structs/CoreClient.ts';
import auth from './auth.ts';
import Guild from '../src/entities/guild/Guild.ts';
import Message from '../src/entities/Message.ts';
import UserStatus from '../src/entities/UserStatus.ts';
import Activity from '../src/entities/Activity.ts';

const client = new CoreClient({ token: auth.token });

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

  const cmd = message.content.split(/\s+/g)[0].slice(1);

  switch (cmd) {
    case 'guilds': {
      console.log(client.guilds);
      client.rest.sendChannelMessage(message.channelId, `In ${client.guilds.size.toString()} guilds`);
      break;
    }
    case 'users': {
      console.log(client.users);
      client.rest
        .sendChannelMessage(message.channelId, `Serving ${client.users.size.toString()} users`)
        .then(() => client.rest.reactToMessage(message.channelId, message.id, '😄'));
      break;
    }
    case 'channels': {
      console.log(client.channels);
      client.rest.sendChannelMessage(message.channelId, `Part of ${client.channels.size.toString()} channels`);
      break;
    }
    default:
      client.rest
        .sendChannelMessage(message.channelId, `Sorry I don't know what that means :(`)
        .then(() => client.rest.reactToMessage(message.channelId, message.id, '🚫'));
  }
});

client.login();
