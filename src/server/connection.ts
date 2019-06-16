import { Anomaly } from '@phnq/message';
import { IValue } from '@phnq/message/constants';
import { IConnection } from '@phnq/message/server';
import { parse } from 'accept-language-parser';
import { i18n, IParams } from '../lib/i18n';
import Account from '../model/account';
import { AnomalyCode } from '../model/api';
import Session from '../model/session';

class Connection {
  private wrapped: IConnection;

  constructor(wrapped: IConnection) {
    this.wrapped = wrapped;

    const headers = wrapped.getUpgradeHeaders();
    const langsHeader = headers['accept-language'];
    if (langsHeader) {
      const langs = parse(langsHeader as string);
      const langCodes = langs.map(l => [l.code, l.region].filter(x => x).join('-'));
      langs.filter(l => !l.region && !langCodes.includes(l.code)).forEach(l => langCodes.push(l.code));
      this.langCodes = langCodes;
    }
  }

  public get session(): Session {
    return this.get('session') as Session;
  }

  public set session(session: Session) {
    this.set('session', session);
  }

  public get account(): Account {
    return this.get('account') as Account;
  }

  public set account(account: Account) {
    this.set('account', account);
  }

  public get serviceTypes(): string[] {
    return this.get('serviceTypes') as string[];
  }

  public set serviceTypes(serviceTypes: string[]) {
    this.set('serviceTypes', serviceTypes);
  }

  public validateSession() {
    if (this.session) {
      if (this.session.expiry && Date.now() > this.session.expiry.getTime()) {
        throw new Anomaly('Expired session', { code: AnomalyCode.ExpiredSession });
      }
    }
  }

  public authenticate() {
    if (!this.session) {
      throw new Anomaly('No session', { code: AnomalyCode.NoSession });
    }
  }

  public push(type: string, data: IValue) {
    this.wrapped.push(type, data);
  }

  public get langCodes(): string[] {
    return this.get('langCodes') as string[];
  }

  public set langCodes(langCodes: string[]) {
    this.set('langCodes', langCodes);
  }

  public i18n(key: string, params?: IParams): string {
    if (process.env.NODE_ENV === 'test') {
      return `TEST:${key}`;
    }
    return i18n(this.langCodes, key, params) as string;
  }

  protected get(name: string): any {
    return this.wrapped.get(name);
  }

  protected set(name: string, value: any) {
    this.wrapped.set(name, value);
  }
}

export default Connection;
