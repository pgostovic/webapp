import { field, IData, Model } from '@phnq/model';

export interface IAccountRequireFlags extends IData {
  passwordChange: boolean;
}

interface IAccountData {
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
  @field public email?: string;
  @field public firstName?: string;
  @field public lastName?: string;
  @field public password?: string;
  @field public authCode?: {
    code: string;
    expiry: Date;
  };
  @field public requires?: IAccountRequireFlags;

  constructor(data: IAccountData) {
    super({ requires: { passwordChange: false }, ...data });
  }
}

export default Account;
