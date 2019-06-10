import { createLogger } from '@phnq/log';
import { Anomaly } from '@phnq/message';
import MessageClient from '@phnq/message/client';
import { AnomalyCode, IApi } from '../model/api';

const log = createLogger('api');

export const retrieveClientToken = (): string => localStorage.getItem('t') || '';

export const storeClientToken = (token: string) => {
  localStorage.setItem('t', token);
};

export const removeClientToken = () => {
  localStorage.removeItem('t');
};

const api = {
  on<T>(type: string, handler: (data: T) => void) {
    messageClient.on(type, (data: any) => {
      handler(data as T);
    });
  },
};
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

let messageClient: MessageClient;

export const close = async () => {
  await messageClient.close();
};

export const configure = async ({ secure, host, port }: IApiConfig) => {
  if (messageClient) {
    await messageClient.close();
    typesLoaded = false;
  }

  messageClient = new MessageClient(`${secure ? 'wss' : 'ws'}://${host}:${port}`);

  const { services } = (await messageClient.send('services')) as { services: string[] };

  services.forEach(type => {
    Object.defineProperty(api, type, {
      enumerable: true,
      value: async (data: any) => {
        try {
          const resp = await messageClient.send(type, data);
          return resp;
        } catch (err) {
          if (err instanceof Anomaly && err.data.code === AnomalyCode.NoSession) {
            // if there's no session then try to authenticate, then retry the same message again
            if ((await (apiProxy as IApi).authenticate({ token: retrieveClientToken() })).authenticated) {
              return await messageClient.send(type, data);
            } else {
              throw new Anomaly('Unauthorized', { code: AnomalyCode.Unauthorized });
            }
          } else {
            throw err;
          }
        }
      },
      writable: true,
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
