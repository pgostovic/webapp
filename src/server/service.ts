import { IValue } from '@phnq/message/constants';
import Connection from './connection';

type Service = (data: any & IValue, conn: Connection) => any & IValue;

export default Service;
