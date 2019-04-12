import { Anomaly } from '@phnq/message';
import { search } from '@phnq/model';
import uuid from 'uuid/v4';
import { ICreateSessionResult, ICreateSessionWithCodeParams } from '../../model/api';
import Session, { AUTH_CODE_SESSION_EXPIRY } from '../../model/session';
import User from '../../model/user';
import Connection from '../connection';
import Service from '../service';

const createSessionWithCode = async (
  p: ICreateSessionWithCodeParams,
  conn: Connection,
): Promise<ICreateSessionResult> => {
  const { authCode: code } = p;

  const user = (await search(User, { authCode: { code } }))[0];

  if (user) {
    const authCodeExpiry = user.authCode ? user.authCode.expiry : undefined;
    if (authCodeExpiry && Date.now() > authCodeExpiry.getTime()) {
      throw new Anomaly('Invalid or expired code');
    }

    conn.user = user;

    const expiry = new Date(Date.now() + AUTH_CODE_SESSION_EXPIRY);

    const session = (await new Session({
      expiry,
      token: uuid(),
      userId: user.id,
    }).save()) as Session;

    conn.session = session;

    return { token: session.token, requires: user.requires };
  }
  throw new Anomaly('Invalid or expired code');
};

export default createSessionWithCode as Service;
