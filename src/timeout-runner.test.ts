import { withTimeout, TimeoutError, isTimeoutError } from './timeout-runner';
import { setTimeoutConfig, resetTimeoutConfig } from './timeout-config';

afterEach(() => resetTimeoutConfig());

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

test('resolves when promise completes in time', async () => {
  const result = await withTimeout(Promise.resolve(42), 'http://example.com', 1000);
  expect(result).toBe(42);
});

test('rejects with TimeoutError when exceeded', async () => {
  const slow = sleep(200).then(() => 'done');
  await expect(withTimeout(slow, 'http://example.com', 50)).rejects.toBeInstanceOf(TimeoutError);
});

test('TimeoutError message contains url and ms', async () => {
  const slow = sleep(200).then(() => 'done');
  try {
    await withTimeout(slow, 'http://test.com', 50);
  } catch (e) {
    expect((e as Error).message).toContain('http://test.com');
    expect((e as Error).message).toContain('50ms');
  }
});

test('skips timeout when disabled', async () => {
  setTimeoutConfig({ enabled: false });
  const slow = sleep(100).then(() => 'ok');
  const result = await withTimeout(slow, 'http://example.com', 10);
  expect(result).toBe('ok');
});

test('isTimeoutError identifies TimeoutError correctly', () => {
  const e = new TimeoutError('http://x.com', 100);
  expect(isTimeoutError(e)).toBe(true);
  expect(isTimeoutError(new Error('other'))).toBe(false);
});
