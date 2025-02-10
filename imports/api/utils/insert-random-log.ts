import { Random } from 'meteor/random';
import { ILogTypeEnum, LogsCollection } from '/imports/api/logs';
import { generateRandomLogMetadata } from './generate-random-log-metadata';
import { logColorMap } from './log-color-map';

export const insertRandomLog = async () => {
  const type = Random.choice(Object.values(ILogTypeEnum))!;
  await LogsCollection.insertAsync({
    type,
    message: `Random log message ${Random.id()}`,
    timestamp: new Date(),
    metadata: { ...generateRandomLogMetadata(), color: logColorMap[type] ?? '#000' },
  });
};
