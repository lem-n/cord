/* eslint-disable @typescript-eslint/no-explicit-any */
export class User {
  public id: string;

  public username: string;

  public discriminator: string;

  public avatar: string;

  public bot: boolean;

  public system: boolean;

  public multiFactorAuth: boolean;

  public locale: string;

  public verified: boolean;

  public email: string;

  public flags: number;

  public premiumType: number;

  public publicFlags: number;

  public presence?: any;

  constructor(data: any) {
    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar;
    this.bot = data.bot;
    this.system = data.system;
    this.multiFactorAuth = data.mfa_enabled;
    this.locale = data.locale;
    this.verified = data.verified;
    this.email = data.email;
    this.flags = data.flags;
    this.premiumType = data.premium_type;
    this.publicFlags = data.public_flags;
  }
}
