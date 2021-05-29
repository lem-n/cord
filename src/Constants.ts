export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export interface EndpointOptions {
  method: HttpMethod;
  route: string;
  url: string;
}

export const API = {
  Base: "https://discord.com/api/v9",
  Endpoints: {
    GatewayBot: "gateway/bot",
    Message: {
      Create(channelId: string) {
        return {
          method: HttpMethod.POST,
          route: "channels/messages",
          url: `channels/${channelId}/messages`,
        };
      },
      Edit(channelId: string, messageId: string) {
        return {
          method: HttpMethod.PATCH,
          route: "channels/messages",
          url: `channels/${channelId}/messages/${messageId}`,
        };
      },
      React(channelId: string, messageId: string, emoji: string) {
        return {
          method: HttpMethod.PUT,
          route: "channel/messages/reactions",
          url:
            `channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`,
        };
      },
    },
  },
};

export const MajorParams = ["channel_id", "guild_id", "webook_id"];

export const Headers = {
  "User-Agent": "Cord (https://github.com/lem-n/cord)",
  "Content-Type": "application/json",
};

export const Gateway = {
  version: 9,
  encoding: "json",
};

export const IdentityProps = {
  $os: Deno.build.os,
  $browser: "Cord",
  $device: "Cord",
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

export const GatewayIntents = {
  Guilds: 1 << 0,
  GuildMembers: 1 << 1,
  GuildBans: 1 << 2,
  GuildEmojis: 1 << 3,
  GuildIntegrations: 1 << 4,
  GuildWebhooks: 1 << 5,
  GuildInvites: 1 << 6,
  GuildVoiceStates: 1 << 7,
  GuildPresences: 1 << 8,
  GuildMessages: 1 << 9,
  GuildMessageReactions: 1 << 10,
  GuildMessageTyping: 1 << 11,
  DirectMessages: 1 << 12,
  DirectMessageReactions: 1 << 13,
  DirectMessageTyping: 1 << 14,
};

export const APIEvents = {
  READY: "READY",
  RESUMED: "RESUMED",
  GUILD: {
    CREATE: "GUILD_CREATE",
  },
  MESSAGE: {
    CREATE: "MESSAGE_CREATE",
    UPDATE: "MESSAGE_UPDATE",
    DELETED: "MESSAGE_DELETE",
    REACTION: {
      ADDED: "MESSAGE_REACTION_ADD",
      REMOVED: "MESSAGE_REACTION_REMOVE",
    },
  },
  PRESENCE: {
    UPDATED: "PRESENCE_UPDATED",
  },
};

export const Events = {
  READY: "ready",
  RESUMED: "resumed",
  GUILD: {
    CREATE: "guildCreated",
  },
  MESSAGE: {
    CREATE: "message",
    UPDATE: "messageUpdated",
    DELETED: "messageDeleted",
    REACTION: {
      ADDED: "reactionAdded",
      REMOVED: "reactionRemoved",
    },
  },
  PRESENCE: {
    UPDATED: "presenceUpdated",
  },
};
