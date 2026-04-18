import { withRetry, isRetryableError, sleep, getRetryOptions } from './retry';

describe('getRetryOptions', () => {
  it('returns defaults when no overrides', () => {
    const opts = getRetryOptions();
    expect(opts.maxAttempts).toBe(3);
    expect(opts.delayMs).toBe(500);
    expect(opts.backoffFactor).toBe(2);
  });

  it('merges overrides', () => {
    const opts = getRetryOptions({ maxAttempts: 5 });
    expect(opts.maxAttempts).toBe(5);
    expect(opts.delayMs).toBe(500);
  });
});

describe('withRetry', () => {
  it('resolves immediately on success', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await withRetry(fn, { delayMs: 0 });
    expect(result).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and eventually succeeds', async () => {
    let calls = 0;
    const fn = jest.fn().mockImplementation(() => {
      calls++;
      if (calls < 3) return Promise.reject(new Error('fail'));
      return Promise.resolve('done');
    });
    const result = await withRetry(fn, { maxAttempts: 3, delayMs: 0, backoffFactor: 1 });
    expect(result).toBe('done');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('throws after max attempts', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fails'));
    await expect(withRetry(fn, { maxAttempts: 2, delayMs: 0, backoffFactor: 1 })).rejects.toThrow('always fails');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('respects shouldRetry predicate', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('non-retryable'));
    const shouldRetry = jest.fn().mockReturnValue(false);
    await expect(withRetry(fn, { maxAttempts: 3, delayMs: 0, backoffFactor: 1, shouldRetry })).rejects.toThrow();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('isRetryableError', () => {
  it('identifies timeout errors', () => {
    expect(isRetryableError(new Error('Request timeout'))).toBe(true);
  });

  it('identifies network errors', () => {
    expect(isRetryableError(new Error('network failure'))).toBe(true);
  });

  it('returns false for non-retryable errors', () => {
    expect(isRetryableError(new Error('syntax error'))).toBe(false);
  });
});

describe('sleep', () => {
  it('resolves after delay', async () => {
    const start = Date.now();
    await sleep(50);
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
  });
});
