import { Anomaly } from '@phnq/message';
import { search } from '@phnq/model';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import { ICreateSessionParams, ICreateSessionResult } from '../../model/api';
import Session, { CREDENTIALS_SESSION_EXPIRY } from '../../model/session';
import User from '../../model/user';
import Connection from '../connection';
import Service from '../service';

const createSession = async (p: ICreateSessionParams, conn: Connection): Promise<ICreateSessionResult> => {
  const { email, password } = p;

  const user = (await search(User, { email }))[0];

  if (user && user.password && (await bcrypt.compare(password, user.password))) {
    conn.user = user;

    const expiry = new Date(Date.now() + CREDENTIALS_SESSION_EXPIRY);

    const session = (await new Session({
      expiry,
      token: uuid(),
      userId: user.id,
    }).save()) as Session;

    conn.session = session;

    return { token: session.token, requires: user.requires };
  }
  throw new Anomaly('Invalid credentials');
};

export default createSession as Service;
