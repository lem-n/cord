/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Activity {
  public name: string;

  public type: number;

  public url: string;

  public createdAt: Date;

  public timestamps: any;

  public applicationId: string;

  public details: string;

  public state: string;

  public emoji: any;

  public party: any;

  public assets: any;

  public secrets: any;

  public instance: boolean;

  public flags: number;

  constructor(data: any) {
    this.name = data.name;
    this.type = data.type;
    this.createdAt = data.created_at;
    this.url = data.url;
    this.timestamps = data.timestamps;
    this.applicationId = data.application_id;
    this.details = data.details;
    this.state = data.state;
    this.emoji = data.emoji;
    this.party = data.party;
    this.assets = data.assets;
    this.secrets = data.secrets;
    this.instance = data.instance;
    this.flags = data.flags;
  }
}
