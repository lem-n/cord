export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export const API = {
  Base: 'https://discord.com/api/v6',
  Endpoints: {
    GatewayBot: 'gateway/bot',
    Message: {
      Create(channelId: string) {
        return {
          method: HttpMethod.POST,
          route: 'channels/messages',
          url: `channels/${channelId}/messages`,
        };
      },
      Edit(channelId: string, messageId: string) {
        return {
          method: HttpMethod.PATCH,
          route: 'channels/messages',
          url: `channels/${channelId}/messages/${messageId}`,
        };
      },
      React(channelId: string, messageId: string, emoji: string) {
        return {
          method: HttpMethod.PUT,
          route: 'channel/messages/reactions',
          url: `channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`,
        };
      },
    },
  },
};

export const MajorParams = ['channel_id', 'guild_id', 'webook_id'];

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
    UPDATE: 'MESSAGE_UPDATE',
    DELETED: 'MESSAGE_DELETE',
    REACTION: {
      ADDED: 'MESSAGE_REACTION_ADD',
      REMOVED: 'MESSAGE_REACTION_REMOVE',
    },
  },
  PRESENCE: {
    UPDATED: 'PRESENCE_UPDATED',
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
    UPDATE: 'messageUpdated',
    DELETED: 'messageDeleted',
    REACTION: {
      ADDED: 'reactionAdded',
      REMOVED: 'reactionRemoved',
    },
  },
  PRESENCE: {
    UPDATED: 'presenceUpdated',
  },
};
