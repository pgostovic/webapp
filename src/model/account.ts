import { IModel, Model } from '@phnq/model';

export interface IAccountRequireFlags {
  passwordChange: boolean;
}

interface IAccountData extends IModel {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  authCode?: {
    code: string;
    expiry: Date;
  };
  requires?: IAccountRequireFlags;
}

class Account extends Model<IAccountData> {
  public email?: string;
  public firstName?: string;
  public lastName?: string;
  public password?: string;
  public authCode?: {
    code: string;
    expiry: Date;
  };
  public requires?: IAccountRequireFlags;

  constructor(data: IAccountData) {
    super({ requires: { passwordChange: false }, ...data });
  }
}

export default Account;
