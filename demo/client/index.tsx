import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { WebappClient } from '../../src/client';

const server = {
  host: 'localhost',
  port: 17777,
  secure: false,
};

class App extends Component {
  public render() {
    return (
      <WebappClient server={server}>
        <h1>DEMO</h1>
        <Link to='/sign-up'>Sign up</Link>
        <Link to='/sign-in'>Sign in</Link>
        <Link to='/sign-out'>Sign out</Link>
      </WebappClient>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
