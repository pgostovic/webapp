import { Anomaly } from '@phnq/message';
import { Connection as MessageConnection } from '@phnq/message/server';
import Account from '../model/account';
import { AnomalyCode } from '../model/api';
import Session from '../model/session';

class Connection {
  private wrapped: MessageConnection;

  constructor(wrapped: MessageConnection) {
    this.wrapped = wrapped;
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

  protected get(name: string): any {
    return this.wrapped.get(name);
  }

  protected set(name: string, value: any) {
    this.wrapped.set(name, value);
  }
}

export default Connection;
