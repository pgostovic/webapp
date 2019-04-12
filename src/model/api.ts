import { IUserRequireFlags } from './user';

// *************** authenticate ***************
export interface IAuthenticateParams {
  token: string;
}

export interface IAuthenticateResult {
  authenticated: boolean;
  requires?: IUserRequireFlags;
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
  requires?: IUserRequireFlags;
}

export interface IDestroySessionResult {
  destroyed: boolean;
}

// *************** createUser ***************
export interface ICreateUserParams {
  email: string;
}

export interface ICreateUserResult {
  requires: IUserRequireFlags;
}

// *************** setPassword ***************
export interface ISetPasswordParams {
  password: string;
}

export interface ISetPasswordResult {
  passwordSet: boolean;
  requires?: IUserRequireFlags;
}

// *************** API ***************
export interface IApi {
  authenticate: (p: IAuthenticateParams) => Promise<IAuthenticateResult>;
  createSession: (p: ICreateSessionParams) => Promise<ICreateSessionResult>;
  createSessionWithCode: (p: ICreateSessionWithCodeParams) => Promise<ICreateSessionResult>;
  destroySession: () => Promise<IDestroySessionResult>;
  createUser: (p: ICreateUserParams) => Promise<ICreateUserResult>;
  setPassword: (p: ISetPasswordParams) => Promise<ISetPasswordResult>;
}
