# @phnq/webapp

[![CircleCI](https://circleci.com/gh/pgostovic/webapp.svg?style=svg)](https://circleci.com/gh/pgostovic/webapp)

[![npm version](https://badge.fury.io/js/%40phnq%2Fwebapp.svg)](https://badge.fury.io/js/%40phnq%2Fwebapp)

Aggressively opinionated framework for building webapps. It's so opinionated that nobody should use it except me. This module is really just to help me repeat myself less in web projects.

- React frontend, Node.js backend
- Authentication, account management, including bare bones UI
- WebSocket-based client/server communication with [@phnq/message](https://www.npmjs.com/package/@phnq/message)
- State management with [@phnq/state](https://www.npmjs.com/package/@phnq/state)
- Data persistence with [@phnq/model](https://www.npmjs.com/package/@phnq/model)

## Usage

### Client

```tsx
import { WebappClient } from "@phnq/webapp/client";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import UI from "./ui";

const server = {
  host: process.env.HOST,
  port: Number(process.env.PORT),
  secure: process.env.SECURE === "true"
};

class App extends Component {
  public render() {
    return (
      <WebappClient server={server}>
        <UI />
      </WebappClient>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
```

### Server

```ts
import { WebappServer } from "@phnq/webapp/server";

// Native Node.js HTTP server
const httpServer = http.createServer();
httpServer.listen(process.env.PORT);

// The Phnq Server just wraps the native server
const server = new WebappServer(httpServer);

// Tell the server where to discover the backend services
server.addServicePath(path.resolve(__dirname, "services"));
```
