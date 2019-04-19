import { search } from '@phnq/model';
import { IAuthenticateParams, IAuthenticateResult } from '../../model/api';
import Session from '../../model/session';
import Connection from '../connection';
import Service from '../service';

const authenticate = async (p: IAuthenticateParams, conn: Connection): Promise<IAuthenticateResult> => {
  const account = conn.account;

  if (!account) {
    const sessions = await search(Session, { token: p.token });
    if (sessions.length === 1) {
      conn.session = sessions[0];
      conn.account = await sessions[0].account;
      try {
        conn.validateSession();
      } catch (err) {
        if (err.data.code === 'expired-session') {
          return { authenticated: false };
        }
      }
    }
  }

  if (conn.account) {
    return { authenticated: true, requires: conn.account.requires };
  } else {
    return { authenticated: false };
  }
};

export default authenticate as Service;
