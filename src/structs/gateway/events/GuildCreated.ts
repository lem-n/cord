import { APIEvents, Events } from '../../../utils./mod.ts';
import { Guild } from '../../../entities/mod.ts';
import type { GatewayEventDef } from '../../../interfaces/mod.ts';

export const GuildCreated: GatewayEventDef = {
  name: APIEvents.GUILD.CREATE,
  handle(client, payload) {
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
