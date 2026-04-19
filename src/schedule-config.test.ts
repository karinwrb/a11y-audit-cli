import {
  getScheduleConfig,
  setScheduleConfig,
  resetScheduleConfig,
  isScheduleEnabled,
  getCron,
  getTimezone,
} from './schedule-config';

beforeEach(() => resetScheduleConfig());

test('defaults', () => {
  const cfg = getScheduleConfig();
  expect(cfg.enabled).toBe(false);
  expect(cfg.cron).toBe('0 * * * *');
  expect(cfg.timezone).toBe('UTC');
});

test('setScheduleConfig updates fields', () => {
  setScheduleConfig({ enabled: true, cron: '*/5 * * * *' });
  expect(isScheduleEnabled()).toBe(true);
  expect(getCron()).toBe('*/5 * * * *');
  expect(getTimezone()).toBe('UTC');
});

test('setScheduleConfig timezone', () => {
  setScheduleConfig({ timezone: 'America/New_York' });
  expect(getTimezone()).toBe('America/New_York');
});

test('resetScheduleConfig restores defaults', () => {
  setScheduleConfig({ enabled: true, cron: '*/10 * * * *' });
  resetScheduleConfig();
  expect(isScheduleEnabled()).toBe(false);
  expect(getCron()).toBe('0 * * * *');
});
