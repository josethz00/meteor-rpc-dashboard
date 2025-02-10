import { ILogTypeEnum } from '/imports/api/logs';

export const logColorMap: Record<ILogTypeEnum, string> = {
  [ILogTypeEnum.UserAction]: '#3B82F6',
  [ILogTypeEnum.UserLogin]: '#10B981',
  [ILogTypeEnum.ApiCall]: '#6B7280',
  [ILogTypeEnum.Error]: '#EF4444',
  [ILogTypeEnum.Warning]: '#FACC15',
};
