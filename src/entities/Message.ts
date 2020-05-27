import User from './User.ts';
import PartialMember from './guild/PartialMember.ts';

export default class Message {
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

  constructor(data: any) {
    this.id = data.id;
    this.channelId = data.channel_id;
    this.guildId = data.guild_id;
    this.author = new User(data.author);
    this.member = new PartialMember(data.member);
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
}
