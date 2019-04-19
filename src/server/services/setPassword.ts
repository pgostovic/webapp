import bcrypt from 'bcrypt';
import Account from '../../model/account';
import { ISetPasswordParams, ISetPasswordResult } from '../../model/api';
import Session, { CREDENTIALS_SESSION_EXPIRY } from '../../model/session';
import Connection from '../connection';
import Service from '../service';

const setPassword = async (p: ISetPasswordParams, conn: Connection): Promise<ISetPasswordResult> => {
  if (conn.account) {
    conn.account = await new Account({
      ...conn.account,
      password: await bcrypt.hash(p.password, 5),
      requires: {
        ...conn.account.requires,
        passwordChange: false,
      },
    }).save();

    await new Session({
      ...conn.session,
      expiry: new Date(Date.now() + CREDENTIALS_SESSION_EXPIRY),
    }).save();
    return { passwordSet: true, requires: conn.account.requires };
  }
  return { passwordSet: false };
};

export default setPassword as Service;
