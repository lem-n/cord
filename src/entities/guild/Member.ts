/* eslint-disable @typescript-eslint/no-explicit-any */
import User from '../User.ts';

export default class Member {
  public user: User;

  public nick: string;

  public roles: string[];

  public joinedAt: Date;

  public boosterSince: Date;

  public deaf: boolean;

  public mute: boolean;

  constructor(data: any) {
    this.user = new User(data.user);
    this.nick = data.nick;
    this.roles = data.roles;
    this.joinedAt = new Date(data.joined_at);
    this.boosterSince = new Date(data.premium_since);
    this.deaf = data.deaf;
    this.mute = data.mute;
  }
}
