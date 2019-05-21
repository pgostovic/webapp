import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import authState, { AuthStatus, IAuthStateProps } from '../state/auth';
import Style from '../ui/style';
import AuthCode from './auth/auth-code';
import SetPassword from './auth/set-password';
import SignIn from './auth/sign-in';
import SignOut from './auth/sign-out';
import SignUp from './auth/sign-up';

@authState.provider
@authState.consumer
export default class extends Component<IAuthStateProps> {
  public componentDidMount() {
    const { authenticate } = this.props;
    authenticate();
  }

  public render() {
    const { children, authStatus } = this.props;

    if (authStatus === AuthStatus.Unkown) {
      return null;
    }

    return (
      <Style>
        <Router>
          <Switch>
            <Route path='/sign-in' component={SignIn} />
            <Route path='/sign-out' component={SignOut} />
            <Route path='/sign-up' component={SignUp} />
            <Route path='/code/:code' component={AuthCode} />
            <Route path='/set-password' component={SetPassword} />
            <Route children={children} />
          </Switch>
        </Router>
      </Style>
    );
  }
}
