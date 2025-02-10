import { Meteor } from 'meteor/meteor';
import { ILog, ILogTypeEnum, LogsCollection } from '/imports/api/logs';
import { CronJob } from 'cron';
import { createModule } from 'meteor-rpc';
import { z } from 'zod';
import { insertRandomLog } from '/imports/api/utils/insert-random-log';
import { logColorMap } from '/imports/api/utils/log-color-map';


const logsModule = createModule('logs')
  .addPublication(
    'logsHistory',
    z.void(),
    () => {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      return LogsCollection.find({ timestamp: { $gte: tenMinutesAgo } })
    }
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
