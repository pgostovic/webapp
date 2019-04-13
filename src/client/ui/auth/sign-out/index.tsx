import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router';
import authState, { IAuthStateProps } from '../../../state/auth';
import AuthLayout from '../auth-layout';

@authState.consumer
class SignOut extends PureComponent<IAuthStateProps & RouteComponentProps> {
  public async componentDidMount() {
    const {
      signOut,
      history: { replace },
    } = this.props;
    await signOut();
    replace('/');
  }

  public render() {
    return <AuthLayout>Buh Bye...</AuthLayout>;
  }
}

export default SignOut;
