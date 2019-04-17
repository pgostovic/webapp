import { createLogger } from '@phnq/log';
import { Anomaly } from '@phnq/message';
import { Connection as MessageConnection, MessageServer } from '@phnq/message/server';
import { IData } from '@phnq/model';
import fs from 'fs';
import http from 'http';
import path from 'path';
import Connection from './connection';
import Service from './service';

const messageLog = createLogger('message');

export class Server {
  public static ConnectionClass = Connection;

  private servicePaths: string[] = [];
  private serviceTypes: string[] = [];
  private messageServer: MessageServer;

  constructor(httpServer: http.Server) {
    this.messageServer = new MessageServer(httpServer);

    this.messageServer.onMessage = async (type: string, data: IData, messageConn: MessageConnection): Promise<any> => {
      try {
        const conn = new Server.ConnectionClass(messageConn);
        conn.serviceTypes = this.serviceTypes;
        conn.validateSession();
        messageLog(type);
        const service = await this.findService(type);
        return await service(data, conn);
      } catch (err) {
        if (!(err instanceof Anomaly)) {
          messageLog('UNEXPECTED ERROR', err);
        }
        throw err;
      }
    };

    this.addServicePath(path.resolve(__dirname, 'services'));
  }

  public addServicePath(servicePath: string): void {
    messageLog('Add service path: ', servicePath);
    this.servicePaths.push(servicePath);
    this.serviceTypes = [
      ...new Set(
        this.serviceTypes.concat(
          fs.readdirSync(servicePath).map(name => path.basename(name).replace(/\.(d\.ts|js|ts)$/, '')),
        ),
      ),
    ];
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
