/* eslint-disable @typescript-eslint/no-explicit-any */
import { Member } from './Member.ts';

export class Guild {
  public id: string;

  public name: string;

  public icon: string;

  public splash: string;

  public discoverySplash: string;

  public owner: boolean;

  public ownerId: string;

  public permissions: number;

  public region: string;

  public afkChannelId: string;

  public afkTimeout: number;

  public embedEnabled: boolean;

  public embedChannelId: string;

  public verificationLevel: number;

  public defaultMessageNotifications: number;

  public explicitContentFilter: number;

  public mfaLevel: number;

  public applicationId: string;

  public widgetEnabled: boolean;

  public widgetChannelId: string;

  public systemChannelId: string;

  public systemChannelFlags: number;

  public rulesChannelId: string;

  public joinedAt: Date;

  public large: boolean;

  public unavailable: boolean;

  public memberCount: number;

  public maxPresences: number;

  public maxMembers: number;

  public vanityUrlCode: string;

  public description: string;

  public banner: string;

  public premiumTier: number;

  public premiumSubscriptionCount: number;

  public preferredLocale: string;

  public publicUpdatesChannelId: string;

  public maxVideoChannelUsers: number;

  public approximateMemberCount: number;

  public approximatePresenceCount: number;

  public voiceStates: any[];

  public members: Map<string, Member>;

  public channels: any[];

  public presences: any[];

  public roles: any[];

  public emojis: any[];

  public features: any[];

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.splash = data.splash;
    this.discoverySplash = data.discovery_splash;
    this.owner = data.owner;
    this.ownerId = data.owner_id;
    this.permissions = data.permissions;
    this.region = data.region;
    this.afkChannelId = data.afk_channel_id;
    this.afkTimeout = data.afk_timeout;
    this.embedEnabled = data.embed_enabled;
    this.embedChannelId = data.embed_channel_id;
    this.verificationLevel = data.verification_level;
    this.defaultMessageNotifications = data.default_message_notifications;
    this.explicitContentFilter = data.explicit_content_filter;
    this.mfaLevel = data.mfa_level;
    this.applicationId = data.application_id;
    this.widgetEnabled = data.widget_enabled;
    this.widgetChannelId = data.widget_channel_id;
    this.systemChannelId = data.system_channel_id;
    this.systemChannelFlags = data.system_channel_flags;
    this.rulesChannelId = data.rules_channel_id;
    this.joinedAt = data.joined_at;
    this.large = data.large;
    this.unavailable = data.unavailable;
    this.memberCount = data.member_count;
    this.maxPresences = data.max_presences;
    this.maxMembers = data.max_members;
    this.vanityUrlCode = data.vanity_url_code;
    this.description = data.description;
    this.banner = data.banner;
    this.premiumTier = data.premium_tier;
    this.premiumSubscriptionCount = data.premium_subscription_count;
    this.preferredLocale = data.preferred_locale;
    this.publicUpdatesChannelId = data.public_updates_channel_id;
    this.maxVideoChannelUsers = data.max_video_channel_users;
    this.approximateMemberCount = data.approximate_member_count;
    this.approximatePresenceCount = data.approximate_presence_count;

    this.voiceStates = data.voice_states;

    this.members = new Map();
    data.members?.forEach((member: any) => {
      if (!member) return;
      if (this.members.has(member.id)) return;
      this.members.set(member.id, new Member(member));
    });

    this.channels = data.channels;
    this.presences = data.presences;
    this.roles = data.roles;
    this.emojis = data.emojis;
    this.features = data.features;
  }
}
