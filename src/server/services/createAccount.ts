import { createLogger } from '@phnq/log';
import { Anomaly } from '@phnq/message';
import cryptoRandomString from 'crypto-random-string';
import isEmail from 'validator/lib/isEmail';
import Account from '../../model/account';
import { ICreateAccountParams, ICreateAccountResult } from '../../model/api';
import Service from '../service';

const log = createLogger('createUAccount');

const createAccount = async (p: ICreateAccountParams): Promise<ICreateAccountResult> => {
  if (!isEmail(p.email)) {
    throw new Anomaly('Invalid email address.');
  }

  const account = (await new Account({
    email: p.email,
    authCode: {
      code: cryptoRandomString(10),
      expiry: new Date(Date.now() + 5 * 60 * 1000),
    },
    requires: {
      passwordChange: true,
    },
  }).save()) as Account;

  if (account.authCode) {
    log(`CREATED ACCOUNT - authCode url:\n\thttp://localhost:7777/code/${account.authCode.code}`);
  }

  if (!account.requires) {
    throw new Error();
  }

  return { requires: account.requires };
};

export default createAccount as Service;
