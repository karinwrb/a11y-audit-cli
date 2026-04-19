import { parseCronToMs, createScheduledJob, startJob, stopJob } from './schedule-runner';
import { setScheduleConfig, resetScheduleConfig } from './schedule-config';

beforeEach(() => resetScheduleConfig());

test('parseCronToMs wildcard minute', () => {
  expect(parseCronToMs('* * * * *')).toBe(60_000);
});

test('parseCronToMs step minute', () => {
  expect(parseCronToMs('*/5 * * * *')).toBe(300_000);
});

test('parseCronToMs default hourly', () => {
  expect(parseCronToMs('0 * * * *')).toBe(3_600_000);
});

test('parseCronToMs invalid throws', () => {
  expect(() => parseCronToMs('bad')).toThrow('Invalid cron expression');
});

test('createScheduledJob uses config', () => {
  setScheduleConfig({ cron: '*/2 * * * *', timezone: 'Europe/London' });
  const job = createScheduledJob(async () => {});
  expect(job.cron).toBe('*/2 * * * *');
  expect(job.timezone).toBe('Europe/London');
});

test('startJob and stopJob manage timer', () => {
  jest.useFakeTimers();
  const handler = jest.fn().mockResolvedValue(undefined);
  setScheduleConfig({ cron: '* * * * *' });
  const job = createScheduledJob(handler);
  startJob(job);
  expect(job.timer).toBeDefined();
  jest.advanceTimersByTime(60_000);
  expect(handler).toHaveBeenCalledTimes(1);
  stopJob(job);
  expect(job.timer).toBeUndefined();
  jest.useRealTimers();
});
