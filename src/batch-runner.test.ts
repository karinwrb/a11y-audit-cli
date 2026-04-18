import { runBatch } from './batch-runner';
import { resetRateLimiterConfig, setRateLimiterConfig } from './rate-limiter-config';
import { resetRetryConfig } from './retry-config';

jest.mock('./auditor-with-retry', () => ({
  createRetryingAuditor: () =>
    jest.fn(async (url: string) => {
      if (url === 'http://fail.example.com') throw new Error('Network error');
      return { url, score: 90, violations: [], timestamp: new Date().toISOString() };
    }),
}));

describe('batch-runner', () => {
  beforeEach(() => {
    resetRateLimiterConfig();
    resetRetryConfig();
    setRateLimiterConfig({ enabled: false, delayMs: 0, maxConcurrent: 5 });
  });

  it('runs all URLs and returns results', async () => {
    const urls = ['http://a.example.com', 'http://b.example.com'];
    const batch = await runBatch({ urls });
    expect(batch.totalUrls).toBe(2);
    expect(batch.successCount).toBe(2);
    expect(batch.failureCount).toBe(0);
  });

  it('records failures without throwing', async () => {
    const urls = ['http://ok.example.com', 'http://fail.example.com'];
    const batch = await runBatch({ urls });
    expect(batch.successCount).toBe(1);
    expect(batch.failureCount).toBe(1);
    const failed = batch.results.find((r) => r.url === 'http://fail.example.com');
    expect(failed?.error).toBe('Network error');
  });

  it('calls onProgress callback', async () => {
    const progress: number[] = [];
    await runBatch({
      urls: ['http://x.example.com', 'http://y.example.com'],
      onProgress: (completed) => progress.push(completed),
    });
    expect(progress).toContain(1);
    expect(progress).toContain(2);
  });
});
