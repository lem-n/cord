import { APIEvents, Events } from '../../../Constants.ts';
import type CoreClient from '../../CoreClient.ts';
import type { Payload } from '../../../interfaces/Payload.ts';
import Guild from '../../../entities/guild/Guild.ts';

export default {
  name: APIEvents.GUILD.CREATE,
  handle(client: CoreClient, payload: Payload) {
    const guild = new Guild(payload.d);

    guild.members.forEach((member) => !client.users.has(member.user.id)
      && client.users.set(member.user.id, member.user));

    guild.channels.forEach((channel) => !client.channels.has(channel.id)
      && client.channels.set(channel.id, channel));

    if (!client.me.presence) {
      const presence = guild.presences.filter((pres) => pres.user.id === client.me.id)[0];
      client.me.presence = presence;
    }

    client.guilds.set(guild.id, guild);
    client.emit(Events.GUILD.CREATE, guild);
  },
};
