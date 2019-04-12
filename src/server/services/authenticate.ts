import { search } from '@phnq/model';
import { IAuthenticateParams, IAuthenticateResult } from '../../model/api';
import Session from '../../model/session';
import Connection from '../connection';
import Service from '../service';

const authenticate = async (p: IAuthenticateParams, conn: Connection): Promise<IAuthenticateResult> => {
  const user = conn.user;

  if (!user) {
    const sessions = await search(Session, { token: p.token });
    if (sessions.length === 1) {
      conn.session = sessions[0];
      conn.user = await sessions[0].user;
      try {
        conn.validateSession();
      } catch (err) {
        if (err.data.code === 'expired-session') {
          return { authenticated: false };
        }
      }
    }
  }

  if (conn.user) {
    return { authenticated: true, requires: conn.user.requires };
  } else {
    return { authenticated: false };
  }
};

export default authenticate as Service;
