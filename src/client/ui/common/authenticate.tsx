/**
 * This HOC/decorator is used to mark a component as requiring authentication.
 * The behaviour is that until the auth status is known, nothing will be
 * rendered. When the auth status is known, if it's not authenticated then
 * there's a redirect to /sign-in.
 */
import React, { ComponentType } from 'react';
import { Redirect } from 'react-router-dom';
import authState, { AuthStatus, IAuthStateProps } from '../../state/auth';

export const authenticate = ((): any => (Wrapped: ComponentType): any => (props: any): any => {
  return (
    <AuthWrapper>
      <Wrapped {...props} />
    </AuthWrapper>
  );
})();

interface IAuthWrapperProps extends IAuthStateProps {
  children: JSX.Element[] | JSX.Element;
}

const AuthWrapper = authState.consumer((props: IAuthWrapperProps) => {
  switch (props.authStatus) {
    case AuthStatus.Unkown:
      return null;
    case AuthStatus.NotAuthenticated:
      props.setPostSignInPath(location.pathname);
      return <Redirect to='/sign-in' />;
    default:
      return props.children;
  }
});
