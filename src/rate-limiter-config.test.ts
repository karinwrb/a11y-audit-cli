import {
  getRateLimiterConfig,
  setRateLimiterConfig,
  resetRateLimiterConfig,
  isRateLimitingEnabled,
  getDelayMs,
} from './rate-limiter-config';

describe('rate-limiter-config', () => {
  afterEach(() => {
    resetRateLimiterConfig();
  });

  it('returns default config', () => {
    const config = getRateLimiterConfig();
    expect(config.enabled).toBe(true);
    expect(config.delayMs).toBe(1000);
    expect(config.maxConcurrent).toBe(3);
  });

  it('sets custom config', () => {
    setRateLimiterConfig({ delayMs: 500, maxConcurrent: 5 });
    const config = getRateLimiterConfig();
    expect(config.delayMs).toBe(500);
    expect(config.maxConcurrent).toBe(5);
  });

  it('resets to defaults', () => {
    setRateLimiterConfig({ delayMs: 200 });
    resetRateLimiterConfig();
    expect(getDelayMs()).toBe(1000);
  });

  it('isRateLimitingEnabled reflects config', () => {
    expect(isRateLimitingEnabled()).toBe(true);
    setRateLimiterConfig({ enabled: false });
    expect(isRateLimitingEnabled()).toBe(false);
  });

  it('getDelayMs returns current delay', () => {
    setRateLimiterConfig({ delayMs: 750 });
    expect(getDelayMs()).toBe(750);
  });
});
