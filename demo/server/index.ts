import { createLogger } from '@phnq/log';
import { setDefaultDataStore } from '@phnq/model';
import { memoryDataStore } from '@phnq/model/datastores/memoryDataStore';
import { promises as fs } from 'fs';
import http from 'http';
import Koa from 'koa';
import koaWebpack from 'koa-webpack';
import path from 'path';
import { WebappServer } from '../../src/server';
import { webpackConfig } from '../etc/webpack';

const serverLog = createLogger('server');

const koaApp = new Koa();

(async () => {
  koaApp.use(await koaWebpack({ config: webpackConfig }));
  const html = (await fs.readFile(path.resolve(__dirname, '../client/index.html'))).toString();
  koaApp.use(async ctx => {
    ctx.body = html;
  });
})();

const httpServer = http.createServer(koaApp.callback());
httpServer.listen(17777);
serverLog('Server started on port 17777');

setDefaultDataStore(memoryDataStore);

new WebappServer(httpServer);

// const server = new Server(httpServer);
// server.addServicePath(path.resolve(__dirname, 'services'));
