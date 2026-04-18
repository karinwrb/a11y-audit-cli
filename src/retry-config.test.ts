import {
  getRetryConfig,
  setRetryConfig,
  resetRetryConfig,
  isRetryEnabled,
  getMaxAttempts,
  getDelayMs,
} from './retry-config';

beforeEach(() => {
  resetRetryConfig();
});

describe('getRetryConfig', () => {
  it('returns default config', () => {
    const config = getRetryConfig();
    expect(config.maxAttempts).toBe(3);
    expect(config.delayMs).toBe(500);
    expect(config.backoffFactor).toBe(2);
  });

  it('returns a copy, not reference', () => {
    const config = getRetryConfig();
    config.maxAttempts = 99;
    expect(getRetryConfig().maxAttempts).toBe(3);
  });
});

describe('setRetryConfig', () => {
  it('updates config values', () => {
    setRetryConfig({ maxAttempts: 5, delayMs: 1000 });
    expect(getMaxAttempts()).toBe(5);
    expect(getDelayMs()).toBe(1000);
  });
});

describe('resetRetryConfig', () => {
  it('restores defaults', () => {
    setRetryConfig({ maxAttempts: 10 });
    resetRetryConfig();
    expect(getMaxAttempts()).toBe(3);
  });
});

describe('isRetryEnabled', () => {
  it('returns true when maxAttempts > 1', () => {
    expect(isRetryEnabled()).toBe(true);
  });

  it('returns false when maxAttempts is 1', () => {
    setRetryConfig({ maxAttempts: 1 });
    expect(isRetryEnabled()).toBe(false);
  });
});
