import { createLogger } from '@phnq/log';
import MessageClient from '@phnq/message/client';
import { IApi } from '../model/api';

const log = createLogger('api');

const api = {};
const q: Array<{ key: string; args: any[]; resolve: (msg: any) => void; reject: (err: Error) => void }> = [];
let typesLoaded = false;

const apiProxy = new Proxy(api, {
  get: (target: any, key: string) => {
    return (
      target[key] ||
      (typesLoaded
        ? undefined
        : (...args: any[]) =>
          new Promise((resolve, reject) => {
            q.push({ key, args, resolve, reject });
          }))
    );
  },
});

interface IApiConfig {
  secure: boolean;
  host: string;
  port: number;
}

export const configure = async ({ secure, host, port }: IApiConfig) => {
  const messageClient = new MessageClient(
    `${secure ? 'wss' : 'ws'}://${host}:${port}`,
  );

  const { services } = (await messageClient.send('services')) as { services: string[] };

  services.forEach(type => {
    Object.defineProperty(api, type, {
      enumerable: true,
      value: async (data: any) => await messageClient.send(type, data),
      writable: false,
    });
  });

  log('loaded service types: ', services);

  typesLoaded = true;

  if (q.length > 0) {
    log('flushing message queue: ', q.map(({ key }) => key));
  }

  q.forEach(async ({ key, args, resolve, reject }) => {
    try {
      resolve(await apiProxy[key].apply(apiProxy[key], args));
    } catch (err) {
      reject(err);
    }
  });

  q.length = 0;
};

declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    api: IApi;
  }
}

window.api = apiProxy as IApi;

export default apiProxy as IApi;
