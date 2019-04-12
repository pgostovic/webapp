import { createLogger } from '@phnq/log';
import { Anomaly } from '@phnq/message';
import cryptoRandomString from 'crypto-random-string';
import isEmail from 'validator/lib/isEmail';
import { ICreateUserParams, ICreateUserResult } from '../../model/api';
import User from '../../model/user';
import Service from '../service';

const log = createLogger('createUser');

const createUser = async (p: ICreateUserParams): Promise<ICreateUserResult> => {
  if (!isEmail(p.email)) {
    throw new Anomaly('Invalid email address.');
  }

  const user = (await new User({
    email: p.email,
    authCode: {
      code: cryptoRandomString(10),
      expiry: new Date(Date.now() + 5 * 60 * 1000),
    },
    requires: {
      passwordChange: true,
    },
  }).save()) as User;

  if (user.authCode) {
    log(`CREATED USER - authCode url:\n\thttp://localhost:7777/code/${user.authCode.code}`);
  }

  if (!user.requires) {
    throw new Error();
  }

  return { requires: user.requires };
};

export default createUser as Service;
