import { datastore, field, find, memoryDataStore, Model } from '@phnq/model';
import User from './user';

export const AUTH_CODE_SESSION_EXPIRY = 10 * 60 * 1000; // 10 minutes
export const CREDENTIALS_SESSION_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

interface ISessionData {
  token?: string;
  userId?: string;
  expiry?: Date;
}

@datastore(memoryDataStore)
class Session extends Model<ISessionData> {
  @field public token?: string;
  @field public userId?: string;
  @field public expiry?: Date;

  public get user(): Promise<User> {
    return find(User, this.userId) as Promise<User>;
  }
}

export default Session;
