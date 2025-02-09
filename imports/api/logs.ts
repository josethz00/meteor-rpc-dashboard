import { Mongo } from 'meteor/mongo';

export enum ILogTypeEnum {
  UserLogin = 'user_login',
  ApiCall = 'api_call',
  Error = 'error',
  UserAction = 'user_action',
  Warning = 'warning'
}

export interface ILog {
  _id?: string;
  type: ILogTypeEnum;
  message: string;
  timestamp: Date;
  metadata: {
    userId: string;
    ip: string;
    browser: string;
    [key: string]: any;
  }
}

export const LogsCollection = new Mongo.Collection<ILog>('logs');