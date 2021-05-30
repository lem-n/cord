/* eslint-disable @typescript-eslint/no-explicit-any */
export class PartialMember {
  public roles: string[];

  public hoistedRole: any;

  public joinedAt: Date;

  public mute: boolean;

  public deaf: boolean;

  constructor(data: any) {
    this.roles = data.roles;
    this.hoistedRole = data.hoisted_role;
    this.joinedAt = new Date(data.joined_at);
    this.mute = data.mute;
    this.deaf = data.deaf;
  }
}
