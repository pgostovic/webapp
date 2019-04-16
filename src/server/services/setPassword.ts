import { ISetPasswordParams, ISetPasswordResult } from '../../model/api';
import Session, { CREDENTIALS_SESSION_EXPIRY } from '../../model/session';
import User from '../../model/user';
import Connection from '../connection';
import Service from '../service';

const setPassword = async (p: ISetPasswordParams, conn: Connection): Promise<ISetPasswordResult> => {
  if (conn.user) {
    conn.user = await new User({
      ...conn.user,
      password: p.password,
      requires: {
        ...conn.user.requires,
        passwordChange: false,
      },
    }).save();

    await new Session({
      ...conn.session,
      expiry: new Date(Date.now() + CREDENTIALS_SESSION_EXPIRY),
    }).save();
    return { passwordSet: true, requires: conn.user.requires };
  }
  return { passwordSet: false };
};

export default setPassword as Service;
