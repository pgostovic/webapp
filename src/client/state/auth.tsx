import { createState } from '@phnq/state';
import { IAccountRequireFlags } from '../../model/account';
import api from '../api';

export enum AuthStatus {
  Unkown,
  NotAuthenticated,
  Authenticated,
}

interface IState {
  authStatus: AuthStatus;
  authRequires: IAccountRequireFlags;
}

interface IActions {
  authenticate: () => void;
  signUp: (email: string) => void;
  setPassword: (password: string) => void;
  signIn: (email: string, password: string) => void;
  signInWithCode: (code: string) => void;
  signOut: () => void;
}

export type IAuthStateProps = IState & IActions;

export default createState<IState, IActions>(
  'auth',
  {
    authRequires: {
      passwordChange: false,
    },
    authStatus: AuthStatus.Unkown,
  },
  (_: any, setState: any) => ({
    async signUp(email: string) {
      const { requires: authRequires } = await api.createAccount({ email });
      setState({ authRequires });
    },

    async authenticate() {
      const token = localStorage.t;

      if (token) {
        const authenticated = (await api.authenticate({ token })).authenticated;
        if (!authenticated) {
          localStorage.removeItem('t');
        }
        setState({ authStatus: authenticated ? AuthStatus.Authenticated : AuthStatus.NotAuthenticated });
      } else {
        setState({ authStatus: AuthStatus.NotAuthenticated });
      }
    },

    async setPassword(password: string) {
      const { passwordSet, requires } = await api.setPassword({ password });
      if (passwordSet) {
        setState({ authRequires: requires });
      }
    },

    async signIn(email: string, password: string) {
      const { token, requires } = await api.createSession({ email, password });
      if (token) {
        localStorage.setItem('t', token);
        setState({ authRequires: requires, authStatus: AuthStatus.Authenticated });
      } else {
        setState({ authStatus: AuthStatus.NotAuthenticated });
      }
    },

    async signInWithCode(authCode: string) {
      const { token, requires } = await api.createSessionWithCode({ authCode });
      if (token) {
        localStorage.setItem('t', token);
        setState({ authRequires: requires, authStatus: AuthStatus.Authenticated });
      } else {
        setState({ authStatus: AuthStatus.NotAuthenticated });
      }
    },

    async signOut() {
      await this.authenticate();
      const { destroyed } = await api.destroySession();
      if (destroyed) {
        localStorage.removeItem('t');
        setState({ authStatus: AuthStatus.NotAuthenticated });
      }
    },
  }),
);
