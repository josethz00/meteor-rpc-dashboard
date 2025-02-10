import { Random } from 'meteor/random';
import { rpcApiClient } from '/imports/ui/services/rpc-api-client';
import { ILogTypeEnum } from '/imports/api/logs';

export const logTypes = [
  { type: ILogTypeEnum.UserAction, label: 'User Action', color: 'bg-blue-500' },
  { type: ILogTypeEnum.UserLogin, label: 'User Login', color: 'bg-green-500' },
  { type: ILogTypeEnum.ApiCall, label: 'API Call', color: 'bg-gray-500' },
  { type: ILogTypeEnum.Error, label: 'Error', color: 'bg-red-500' },
  { type: ILogTypeEnum.Warning, label: 'Warning', color: 'bg-yellow-500' },
];

export const useLogGenerator = () => {
  const userId = Random.id();

  const handleLogGeneration = async (logType: ILogTypeEnum) => {
    const logData = {
      type: logType,
      message: `Random log message ${Random.id()}`,
      metadata: {
        userId,
        ip: Array.from({ length: 4 }, () => Math.floor(Random.fraction() * 255)).join('.'),
        browser: Random.choice(['Chrome', 'Firefox', 'Safari', 'Edge'])!,
      },
    };

    try {
      await rpcApiClient.logs.registerLog(logData);
    } catch (error) {
      console.error('Error registering log:', error);
    }
  };

  return {
    logTypes,
    handleLogGeneration,
  };
};
