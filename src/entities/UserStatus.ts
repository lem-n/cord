import { Activity } from './mod.ts';

export class UserStatus {
  public since: number | null;

  public game: Activity;

  public status: 'online' | 'dnd' | 'idle' | 'invisible' | 'offline';

  public afk: boolean;

  constructor(data: UserStatus) {
    this.since = data.since;
    this.game = new Activity(data.game);
    this.status = data.status;
    this.afk = data.afk;
  }
}
