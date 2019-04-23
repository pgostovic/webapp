import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { configure as configureApi } from './api';
import authState, { IAuthStateProps } from './state/auth';
import AuthCode from './ui/auth/auth-code';
import SetPassword from './ui/auth/set-password';
import SignIn from './ui/auth/sign-in';
import SignOut from './ui/auth/sign-out';
import SignUp from './ui/auth/sign-up';
import Style from './ui/style';

interface IProps {
  server: {
    secure: boolean;
    host: string;
    port: number;
  };
}

class WrappedClient extends Component<IAuthStateProps & IProps> {
  constructor(props: IAuthStateProps & IProps) {
    super(props);

    configureApi(props.server);
  }

  public componentDidMount() {
    const { authenticate } = this.props;
    authenticate();
  }

  public render() {
    const { children } = this.props;
    return (
      <Style>
        <Router>
          <Switch>
            <Route path='/sign-in' component={SignIn} />
            <Route path='/sign-out' component={SignOut} />
            <Route path='/sign-up' component={SignUp} />
            <Route path='/code/:code' component={AuthCode} />
            <Route path='/set-password' component={SetPassword} />
            <Route render={() => children} />
          </Switch>
        </Router>
      </Style>
    );
  }
}

export const Client = authState.provider(authState.consumer(WrappedClient));
