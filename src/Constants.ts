export const API = {
  Base: 'https://discord.com/api/v6',
  Endpoints: {
    GatewayBot: 'gateway/bot',
    Message: {
      Create(channelId: string) {
        return `channels/${channelId}/messages`;
      },
      React(channelId: string, messageId: string, emoji: string) {
        return `channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`;
      },
      // Edit(channelId: string, messageId: string) { return `` },
    },
  },
};

export const Headers = {
  'User-Agent': 'Cord (https://github.com/lem-n/cord)',
  'Content-Type': 'application/json',
};

export const Gateway = {
  version: 6,
  encoding: 'json',
};

export const IdentityProps = {
  $os: Deno.build.os,
  $browser: 'Cord',
  $device: 'Cord',
};

export const WS = {
  OP: {
    DISPATCH: 0,
    HEARTBEAT: 1,
    IDENTIFY: 2,
    UPDATE_STATUS: 3,
    RESUME: 6,
    INVALID_SESSION: 9,
    HELLO: 10,
    HEARTBEAT_ACK: 11,
  },
};

export const APIEvents = {
  READY: 'READY',
  RESUMED: 'RESUMED',
  GUILD: {
    CREATE: 'GUILD_CREATE',
  },
  MESSAGE: {
    CREATE: 'MESSAGE_CREATE',
  },
};

export const Events = {
  READY: 'ready',
  RESUMED: 'resumed',
  GUILD: {
    CREATE: 'guildCreated',
  },
  MESSAGE: {
    CREATE: 'message',
  },
};
