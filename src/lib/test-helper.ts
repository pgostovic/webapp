import { setDefaultDataStore } from '@phnq/model';
import { memoryDataStore } from '@phnq/model/datastores/memoryDataStore';
import bcrypt from 'bcrypt';
import http from 'http';
// import { close } from '../client/api';
import Account from '../model/account';
import Session from '../model/session';
import { WebappServer } from '../server';

setDefaultDataStore(memoryDataStore);

const PORT = 12953;
export const SERVER_CONFIG = { host: 'localhost', port: PORT, secure: false };

let httpServer: http.Server;
let webappServer: WebappServer;

export const setupServer = async () => {
  httpServer = http.createServer();

  webappServer = new WebappServer(httpServer);

  await new Promise(resolve => {
    httpServer.listen({ port: PORT }, resolve);
  });

  await new Account({
    email: 'test@test.com',
    password: await bcrypt.hash('abcd1234', 5),
  }).save();
};

export const tearDownServer = async () => {
  await webappServer.close();

  if (httpServer.listening) {
    // await close();
    await new Promise((resolve, reject) => {
      try {
        httpServer.close(() => {
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  await Account.drop();
  await Session.drop();
};
