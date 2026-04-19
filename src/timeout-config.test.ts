import {
  getTimeoutConfig,
  setTimeoutConfig,
  resetTimeoutConfig,
  isTimeoutEnabled,
  getRequestTimeoutMs,
  getPageLoadTimeoutMs,
} from './timeout-config';

afterEach(() => resetTimeoutConfig());

test('returns default config', () => {
  const cfg = getTimeoutConfig();
  expect(cfg.enabled).toBe(true);
  expect(cfg.requestTimeoutMs).toBe(10000);
  expect(cfg.pageLoadTimeoutMs).toBe(30000);
});

test('setTimeoutConfig updates fields', () => {
  setTimeoutConfig({ requestTimeoutMs: 5000 });
  expect(getRequestTimeoutMs()).toBe(5000);
  expect(getPageLoadTimeoutMs()).toBe(30000);
});

test('isTimeoutEnabled reflects config', () => {
  expect(isTimeoutEnabled()).toBe(true);
  setTimeoutConfig({ enabled: false });
  expect(isTimeoutEnabled()).toBe(false);
});

test('resetTimeoutConfig restores defaults', () => {
  setTimeoutConfig({ requestTimeoutMs: 1000, pageLoadTimeoutMs: 2000 });
  resetTimeoutConfig();
  expect(getRequestTimeoutMs()).toBe(10000);
  expect(getPageLoadTimeoutMs()).toBe(30000);
});

test('getTimeoutConfig returns a copy', () => {
  const a = getTimeoutConfig();
  const b = getTimeoutConfig();
  expect(a).not.toBe(b);
});
