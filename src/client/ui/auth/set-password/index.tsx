import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router';
import authState, { IAuthStateProps } from '../../../state/auth';
import { authenticate } from '../../common/authenticate';
import AuthLayout from '../auth-layout';
import { View } from './view';

interface IState {
  errorMessage?: string;
  successMessage?: string;
}

@authenticate
@authState.consumer
class SetPassword extends PureComponent<IAuthStateProps & RouteComponentProps, IState> {
  public state = {
    errorMessage: undefined,
  };

  public render() {
    const { errorMessage } = this.state;

    return (
      <AuthLayout>
        <View onSetPassword={this.onSetPassword} errorMessage={errorMessage} />
      </AuthLayout>
    );
  }

  private onSetPassword = async (password: string) => {
    const {
      setPassword,
      history: { replace },
    } = this.props;
    try {
      this.setState({ errorMessage: undefined });
      await setPassword(password);
      replace('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };
}

export default SetPassword;
