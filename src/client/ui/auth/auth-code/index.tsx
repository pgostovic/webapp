import React, { PureComponent } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import authState, { IAuthStateProps } from '../../../state/auth';
import AuthLayout from '../auth-layout';
import { View } from './view';

interface IParams {
  code: string;
}

interface IState {
  errorMessage?: string;
  renderForm: boolean;
}

@authState.consumer
class AuthCode extends PureComponent<IAuthStateProps & RouteComponentProps<IParams>, IState> {
  public state = {
    errorMessage: undefined,
    renderForm: false,
  };
  private mounted = false;

  public async componentDidMount() {
    const {
      match: {
        params: { code },
      },
    } = this.props;

    this.mounted = true;

    await this.submitCode(code);

    if (this.mounted) {
      this.setState({ renderForm: true });
    }
  }

  public componentWillUnmount() {
    this.mounted = false;
  }

  public render() {
    const { errorMessage, renderForm } = this.state;

    if (!renderForm) {
      return null;
    }

    return (
      <AuthLayout>
        <View onSubmitCode={this.submitCode} errorMessage={errorMessage} />
      </AuthLayout>
    );
  }

  private submitCode = async (code: string) => {
    const {
      signInWithCode,
      history: { replace },
    } = this.props;
    try {
      await signInWithCode(code);
      replace('/set-password');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  };
}

export default AuthCode;
