import { createLogger } from '@phnq/log';
import { Anomaly } from '@phnq/message';
import { IValue } from '@phnq/message/constants';
import { IConnection, MessageServer } from '@phnq/message/server';
import { promises as fs } from 'fs';
import http from 'http';
import path from 'path';
import prettyHrtime from 'pretty-hrtime';
import { addL10n, IL10n } from '../lib/i18n';
import Connection from './connection';
import Service from './service';

const messageLog = createLogger('message');

export class WebappServer {
  public static ConnectionClass = Connection;

  private servicePaths: string[] = [];
  private serviceTypes: string[] = [];
  private messageServer: MessageServer;
  private asyncInitPromise: Promise<[void, void]>;

  constructor(httpServer: http.Server) {
    this.messageServer = new MessageServer(httpServer);

    this.messageServer.onMessage = async (type: string, data: IValue, messageConn: IConnection): Promise<any> => {
      try {
        const start = process.hrtime();

        const conn = new WebappServer.ConnectionClass(messageConn);
        conn.serviceTypes = this.serviceTypes;
        conn.validateSession();
        const service = await this.findService(type);
        const result = await service(data, conn);
        messageLog('%s - %s', type, prettyHrtime(process.hrtime(start)));
        return result;
      } catch (err) {
        if (!(err instanceof Anomaly)) {
          messageLog('UNEXPECTED ERROR', err);
        }
        throw err;
      }
    };

    this.asyncInitPromise = this.asyncInit();
  }

  public async waitUntilInitialized() {
    return this.asyncInitPromise;
  }

  public async close() {
    await this.messageServer.close();
  }

  public async addL10nPath(l10nPath: string) {
    messageLog('Add L10n path: ', l10nPath);
    (await fs.readdir(l10nPath))
      .filter(p => p.match(/\.json$/))
      .forEach(async stringsPath => {
        const l10nStrings = JSON.parse((await fs.readFile(path.resolve(l10nPath, stringsPath))).toString()) as IL10n;
        const code = stringsPath.replace(/\.json$/, '');
        addL10n(code, l10nStrings);
      });
  }

  public async addServicePath(servicePath: string) {
    messageLog('Add service path: ', servicePath);
    this.servicePaths.push(servicePath);
    this.serviceTypes = [
      ...new Set(
        this.serviceTypes.concat(
          (await fs.readdir(servicePath)).map(name => path.basename(name).replace(/\.(d\.ts|js|ts)$/, '')),
        ),
      ),
    ];
  }

  private async asyncInit(): Promise<[void, void]> {
    return Promise.all([
      this.addL10nPath(path.resolve(__dirname, '../l10n')),
      this.addServicePath(path.resolve(__dirname, 'services')),
    ]);
  }

  private async findService(type: string): Promise<Service> {
    for (const servicePath of this.servicePaths) {
      try {
        let relServicePath = path.relative(__dirname, servicePath);
        if (relServicePath[0] !== '.') {
          relServicePath = `./${relServicePath}`;
        }
        return (await import(`${relServicePath}/${type}`)).default as Service;
      } catch (err) {
        if (err.code !== 'MODULE_NOT_FOUND') {
          throw err;
        }
      }
    }
    throw new Error(`Unknown service type: ${type}`);
  }
}
