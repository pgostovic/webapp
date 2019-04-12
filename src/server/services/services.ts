import Connection from '../connection';

interface IServicesResult {
  services: string[];
}

const ping = async (_: any, conn: Connection): Promise<IServicesResult> => {
  return { services: conn.serviceTypes };
};

export default ping;
