import { datastore, field, IData, memoryDataStore, Model } from '@phnq/model';

export interface IUserRequireFlags extends IData {
  passwordChange: boolean;
}

interface IUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  authCode?: {
    code: string;
    expiry: Date;
  };
  requires?: IUserRequireFlags;
}

@datastore(memoryDataStore)
class User extends Model<IUserData> {
  @field public email?: string;
  @field public firstName?: string;
  @field public lastName?: string;
  @field public password?: string;
  @field public authCode?: {
    code: string;
    expiry: Date;
  };
  @field public requires?: IUserRequireFlags;

  constructor(data: IUserData) {
    super({ requires: { passwordChange: false }, ...data });
  }
}

export default User;
