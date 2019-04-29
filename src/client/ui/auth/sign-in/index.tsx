import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router';
import authState, { IAuthStateProps } from '../../../state/auth';
import AuthLayout from '../auth-layout';
import { View } from './view';

interface IState {
  errorMessage?: string;
  successMessage?: string;
}

@authState.consumer
class SignIn extends PureComponent<IAuthStateProps & RouteComponentProps, IState> {
  public state = {
    errorMessage: undefined,
  };

  public render() {
    const { errorMessage } = this.state;

    return (
      <AuthLayout>
        <View onSignIn={this.onSignIn} errorMessage={errorMessage} />
      </AuthLayout>
    );
  }

  private onSignIn = async (email: string, password: string) => {
    const {
      signIn,
      postSignInPath,
      history: { replace },
    } = this.props;
    try {
      this.setState({ errorMessage: undefined, successMessage: undefined });
      await signIn(email, password);
      replace(postSignInPath || '/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };
}

export default SignIn;
