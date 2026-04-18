import { createRateLimiter, withRateLimit } from './rate-limiter';
import { getRateLimiterConfig, setRateLimiterConfig, resetRateLimiterConfig } from './rate-limiter-config';

describe('createRateLimiter', () => {
  it('should acquire and release slots', async () => {
    const limiter = createRateLimiter({ delayMs: 0, maxConcurrent: 2 });
    await limiter.acquire();
    await limiter.acquire();
    limiter.release();
    limiter.release();
  });

  it('should queue requests beyond maxConcurrent', async () => {
    const limiter = createRateLimiter({ delayMs: 0, maxConcurrent: 1 });
    const order: number[] = [];
    await limiter.acquire();
    const second = limiter.acquire().then(() => { order.push(2); limiter.release(); });
    order.push(1);
    limiter.release();
    await second;
    expect(order).toEqual([1, 2]);
  });

  it('should delay between requests', async () => {
    const limiter = createRateLimiter({ delayMs: 50, maxConcurrent: 1 });
    const start = Date.now();
    await withRateLimit(limiter, async () => 'ok');
    expect(Date.now() - start).toBeGreaterThanOrEqual(50);
  });

  it('withRateLimit returns function result', async () => {
    const limiter = createRateLimiter({ delayMs: 0, maxConcurrent: 2 });
    const result = await withRateLimit(limiter, async () => 42);
    expect(result).toBe(42);
  });

  it('withRateLimit releases on error', async () => {
    const limiter = createRateLimiter({ delayMs: 0, maxConcurrent: 1 });
    await expect(withRateLimit(limiter, async () => { throw new Error('fail'); })).rejects.toThrow('fail');
    const result = await withRateLimit(limiter, async () => 'recovered');
    expect(result).toBe('recovered');
  });
});

describe('rate-limiter-config', () => {
  afterEach(() => resetRateLimiterConfig());

  it('returns default config', () => {
    const config = getRateLimiterConfig();
    expect(config.enabled).toBe(true);
    expect(config.delayMs).toBe(1000);
    expect(config.maxConcurrent).toBe(3);
  });

  it('allows partial overrides', () => {
    setRateLimiterConfig({ delayMs: 500 });
    expect(getRateLimiterConfig().delayMs).toBe(500);
    expect(getRateLimiterConfig().maxConcurrent).toBe(3);
  });

  it('resets to defaults', () => {
    setRateLimiterConfig({ delayMs: 0, enabled: false });
    resetRateLimiterConfig();
    expect(getRateLimiterConfig().enabled).toBe(true);
  });
});
