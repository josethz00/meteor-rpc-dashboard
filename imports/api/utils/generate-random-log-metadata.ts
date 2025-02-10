import { Random } from 'meteor/random';

export const generateRandomLogMetadata = () => ({
  userId: Random.id(),
  ip: `${Array.from({ length: 4 }, () => Math.floor(Random.fraction() * 255)).join('.')}`,
  browser: Random.choice(['Chrome', 'Firefox', 'Safari', 'Edge'])!,
});
