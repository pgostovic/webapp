import React, { PureComponent } from 'react';
import { View } from './view';

class AuthLayout extends PureComponent {
  public render() {
    const { children } = this.props;
    return <View>{children}</View>;
  }
}

export default AuthLayout;
