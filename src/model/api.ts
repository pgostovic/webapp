import { IAccountRequireFlags } from './account';

export enum AnomalyCode {
  NoSession = 'no-session',
  ExpiredSession = 'expired-session',
  Unauthorized = 'unauthorized',
}

export type MultiResponse<T> = () => AsyncIterableIterator<T>;

// *************** authenticate ***************
export interface IAuthenticateParams {
  token: string;
}

export interface IAuthenticateResult {
  authenticated: boolean;
  requires?: IAccountRequireFlags;
}

// *************** createSession ***************
export interface ICreateSessionParams {
  email: string;
  password: string;
}

export interface ICreateSessionWithCodeParams {
  authCode: string;
}

export interface ICreateSessionResult {
  token: string | undefined;
  requires?: IAccountRequireFlags;
}

export interface IDestroySessionResult {
  destroyed: boolean;
}

// *************** createAccount ***************
export interface ICreateAccountParams {
  email: string;
}

export interface ICreateAccountResult {
  requires: IAccountRequireFlags;
}

// *************** setPassword ***************
export interface ISetPasswordParams {
  password: string;
}

export interface ISetPasswordResult {
  passwordSet: boolean;
  requires?: IAccountRequireFlags;
}

// *************** API ***************
export interface IApi {
  on<T>(type: string, handler: (data: T) => void): void;
  authenticate(p: IAuthenticateParams): Promise<IAuthenticateResult>;
  createSession(p: ICreateSessionParams): Promise<ICreateSessionResult>;
  createSessionWithCode(p: ICreateSessionWithCodeParams): Promise<ICreateSessionResult>;
  destroySession(): Promise<IDestroySessionResult>;
  createAccount(p: ICreateAccountParams): Promise<ICreateAccountResult>;
  setPassword(p: ISetPasswordParams): Promise<ISetPasswordResult>;
}
