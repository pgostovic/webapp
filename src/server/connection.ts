import { Anomaly } from '@phnq/message';
import { Connection as MessageConnection } from '@phnq/message/server';
import Session from '../model/session';
import User from '../model/user';

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

  public get user(): User {
    return this.get('user') as User;
  }

  public set user(user: User) {
    this.set('user', user);
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
        throw new Anomaly('Expired session', { code: 'expired-session' });
      }
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
