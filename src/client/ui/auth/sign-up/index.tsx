import React, { PureComponent } from 'react';
import authState, { IAuthStateProps } from '../../../state/auth';
import AuthLayout from '../auth-layout';
import { View } from './view';

interface IState {
  errorMessage?: string;
  successMessage?: string;
}

@authState.consumer
class SignUp extends PureComponent<IAuthStateProps, IState> {
  public state = {
    errorMessage: undefined,
    successMessage: undefined,
  };

  public render() {
    const { errorMessage, successMessage } = this.state;

    return (
      <AuthLayout>
        <View onSignUp={this.onSignUp} errorMessage={errorMessage} successMessage={successMessage} />
      </AuthLayout>
    );
  }

  private onSignUp = async (email: string) => {
    const { signUp } = this.props;
    try {
      this.setState({ errorMessage: undefined, successMessage: undefined });
      await signUp(email);
      this.setState({ successMessage: 'Click on the link in the email.' });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };
}

export default SignUp;
