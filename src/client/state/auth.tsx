import { createState } from '@phnq/state';
import { IAccountRequireFlags } from '../../model/account';
import api, { removeClientToken, retrieveClientToken, storeClientToken } from '../api';

export enum AuthStatus {
  Unkown,
  NotAuthenticated,
  Authenticated,
}

interface IState {
  authStatus: AuthStatus;
  authRequires: IAccountRequireFlags;
  postSignInPath?: string;
}

interface IActions {
  authenticate(): void;
  signUp(email: string): void;
  setPassword(password: string): void;
  signIn(email: string, password: string): void;
  signInWithCode(code: string): void;
  signOut(): void;
  setPostSignInPath(path: string): void;
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
  ({ setState }) => ({
    async signUp(email: string) {
      const { requires: authRequires } = await api.createAccount({ email });
      setState({ authRequires });
    },

    async authenticate() {
      const token = retrieveClientToken();

      if (token) {
        const authenticated = (await api.authenticate({ token })).authenticated;
        if (!authenticated) {
          removeClientToken();
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
        storeClientToken(token);
        setState({ authRequires: requires, authStatus: AuthStatus.Authenticated, postSignInPath: undefined });
      } else {
        setState({ authStatus: AuthStatus.NotAuthenticated });
      }
    },

    async signInWithCode(authCode: string) {
      const { token, requires } = await api.createSessionWithCode({ authCode });
      if (token) {
        storeClientToken(token);
        setState({ authRequires: requires, authStatus: AuthStatus.Authenticated, postSignInPath: undefined });
      } else {
        setState({ authStatus: AuthStatus.NotAuthenticated });
      }
    },

    async signOut() {
      await this.authenticate();
      const { destroyed } = await api.destroySession();
      if (destroyed) {
        removeClientToken();
        setState({ authStatus: AuthStatus.NotAuthenticated });
      }
    },

    setPostSignInPath(path: string) {
      setState({ postSignInPath: path });
    },
  }),
);
