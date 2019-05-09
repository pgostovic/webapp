import { find, IModel, Model } from '@phnq/model';
import Account from './account';

export const AUTH_CODE_SESSION_EXPIRY = 10 * 60 * 1000; // 10 minutes
export const CREDENTIALS_SESSION_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

interface ISessionData extends IModel {
  token?: string;
  accountId?: string;
  expiry?: Date;
}

class Session extends Model<ISessionData> {
  public token?: string;
  public accountId?: string;
  public expiry?: Date;

  public get account(): Promise<Account> {
    return find(Account, this.accountId) as Promise<Account>;
  }
}

export default Session;
