/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Cord } from '../structs/mod.ts';
import type { Embed } from './mod.ts';
import { User, PartialMember } from './mod.ts';

export class Message {
  public client: Cord;

  public id: string;

  public channelId: string;

  public guildId: string;

  public author: User;

  public member: PartialMember;

  public content: string;

  public timestamp: Date;

  public editedTimestamp: Date;

  public tts: boolean;

  public mentions: {
    everyone: boolean;
    users: User[];
    roles: any[];
    channels: any[];
  };

  public attachments: any[];

  public embeds: any[];

  public reactions: any[];

  public nonce: number | string;

  public pinned: boolean;

  public type: number;

  public activity: any;

  public application: any;

  public messageReference: any;

  public flags: number;

  constructor(client: Cord, data: any) {
    this.client = client;
    this.id = data.id;
    this.channelId = data.channel_id;
    this.guildId = data.guild_id;
    this.author = new User(data.author);
    this.member = data.member && new PartialMember(data.member);
    this.content = data.content;
    this.timestamp = new Date(data.timestamp);
    this.editedTimestamp = new Date(data.edited_timestamp);
    this.tts = data.tts;
    this.mentions = {
      everyone: data.mention_everyone,
      users: data.mentions,
      roles: data.mention_roles,
      channels: data.mention_channels,
    };
    this.attachments = data.attachments;
    this.embeds = data.embeds;
    this.reactions = data.reactions;
    this.nonce = data.nonce;
    this.pinned = data.pinned;
    this.type = data.type;
    this.activity = data.activity;
    this.application = data.application;
    this.messageReference = data.message_reference;
    this.flags = data.flags;
  }

  static send(
    client: Cord,
    channelId: string,
    content: string,
    embed?: Embed,
  ) {
    return client.rest.sendMessage(channelId, content, embed);
  }

  edit(
    client: Cord,
    message: Message,
    newContent: string,
    embed?: Embed,
  ) {
    return client.rest.editMessage(
      message.channelId,
      message.id,
      newContent,
      embed,
    );
  }

  react(client: Cord, message: Message, emoji: string) {
    return client.rest.reactToMessage(message.channelId, message.id, emoji);
  }
}
