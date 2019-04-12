import { IData } from '@phnq/model';
import Connection from './connection';

type Service = (data: any & IData, conn: Connection) => any & IData;

export default Service;
