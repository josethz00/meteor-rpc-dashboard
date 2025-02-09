import { Meteor } from 'meteor/meteor';
import { ILog, ILogTypeEnum, LogsCollection } from '/imports/api/logs';
import { CronJob } from 'cron';
import { Random } from 'meteor/random';
import { createModule } from 'meteor-rpc';
import { z } from 'zod';

const logColorMap: Record<ILogTypeEnum, string> = {
  [ILogTypeEnum.UserAction]: '#3B82F6',
  [ILogTypeEnum.UserLogin]: '#10B981',
  [ILogTypeEnum.ApiCall]: '#6B7280',
  [ILogTypeEnum.Error]: '#EF4444',
  [ILogTypeEnum.Warning]: '#FACC15',
};


const generateRandomMetadata = () => ({
  userId: Random.id(),
  ip: `${Array.from({ length: 4 }, () => Math.floor(Random.fraction() * 255)).join('.')}`,
  browser: Random.choice(['Chrome', 'Firefox', 'Safari', 'Edge'])!,
});

const insertRandomLog = async () => {
  const type = Random.choice(Object.values(ILogTypeEnum))!;
  await LogsCollection.insertAsync({
    type,
    message: `Random log message ${Random.id()}`,
    timestamp: new Date(),
    metadata: { ...generateRandomMetadata(), color: logColorMap[type] ?? '#000' },
  });
};

const logsModule = createModule('logs')
  .addPublication(
    'logsHistory',
    z.void(),
    () => LogsCollection.find({})
  )
  .addMethod(
    'registerLog',
    z.object({
      type: z.nativeEnum(ILogTypeEnum),
      message: z.string(),
      metadata: z.object({ userId: z.string(), ip: z.string(), browser: z.string() }),
    }),
    async (logData) => {
      const log: ILog = {
        ...logData,
        timestamp: new Date(),
        metadata: { ...logData.metadata, color: logColorMap[logData.type] ?? '#000' },
      };
      await LogsCollection.insertAsync(log);
      return log;
    }
  )
  .addMethod('getLogCountByStatus', z.void(), async () => { 
    return LogsCollection
      .rawCollection()
      .aggregate([
        { $group: { _id: `$type`, count: { $sum: 1 } } },
        { $project: { type: '$_id', count: 1, _id: 0 } },
      ])
      .toArray()
  })
  .addMethod('getLogTimeSeries', z.void(), async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    return LogsCollection.rawCollection()
      .aggregate([
        { $match: { timestamp: { $gte: tenMinutesAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%dT%H:%M:00', date: '$timestamp', timezone: 'UTC' } },
            count: { $sum: 1 },
            color: { $first: '$metadata.color' }
          },
        },
        { $project: { timestamp: '$_id', count: '$count', color: '$color' } },
        { $unset: '_id' },
        { $sort: { timestamp: 1 } },
      ])
      .toArray();
  })
  .buildSubmodule();

const server = createModule().addSubmodule(logsModule).build();

Meteor.startup(() => {
  new CronJob('*/10 * * * * *', insertRandomLog, null, true, 'America/Sao_Paulo');
});

export type Server = typeof server;
