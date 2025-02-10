import { Random } from 'meteor/random';
import React, { Fragment } from 'react';
import { rpcApiClient } from '/imports/ui/services/rpc-api-client';
import { ILogTypeEnum } from '/imports/api/logs';

const logTypes = [
  { type: ILogTypeEnum.UserAction, label: 'User Action', color: 'bg-blue-500' },
  { type: ILogTypeEnum.UserLogin, label: 'User Login', color: 'bg-green-500' },
  { type: ILogTypeEnum.ApiCall, label: 'API Call', color: 'bg-gray-500' },
  { type: ILogTypeEnum.Error, label: 'Error', color: 'bg-red-500' },
  { type: ILogTypeEnum.Warning, label: 'Warning', color: 'bg-yellow-500' },
];

export const Header = () => {
  const userId = Random.id();

  const handleClick = async (logType: ILogTypeEnum) => {
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

  return (
    <Fragment>
      <h1 className='font-bold text-3xl p-6'>METEOR-RPC DASHBOARD</h1>
      <div className="flex items-center gap-4 pl-6">
        {logTypes.map(({ type, label, color }) => (
          <button
            key={type}
            onClick={() => handleClick(type)}
            className={`${color} text-white font-semibold px-4 py-2 rounded-md shadow-md hover:opacity-80 transition cursor-pointer`}
            aria-label={`Log ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </Fragment>
  );
};
