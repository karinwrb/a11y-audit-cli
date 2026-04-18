import { AuditResult } from './types';
import { createRateLimiter, acquire, release, delay } from './rate-limiter';
import { getRateLimiterConfig, isRateLimitingEnabled, getDelayMs } from './rate-limiter-config';
import { createRetryingAuditor } from './auditor-with-retry';

export interface BatchRunOptions {
  urls: string[];
  onProgress?: (completed: number, total: number, url: string) => void;
}

export interface BatchRunResult {
  results: Array<{ url: string; result: AuditResult | null; error?: string }>;
  totalUrls: number;
  successCount: number;
  failureCount: number;
}

export async function runBatch(options: BatchRunOptions): Promise<BatchRunResult> {
  const { urls, onProgress } = options;
  const config = getRateLimiterConfig();
  const limiter = createRateLimiter(config.maxConcurrent);
  const auditUrl = createRetryingAuditor();

  const results: BatchRunResult['results'] = [];
  let completed = 0;

  const tasks = urls.map((url) => async () => {
    await acquire(limiter);
    try {
      if (isRateLimitingEnabled()) {
        await delay(getDelayMs());
      }
      const result = await auditUrl(url);
      results.push({ url, result });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({ url, result: null, error: message });
    } finally {
      release(limiter);
      completed++;
      onProgress?.(completed, urls.length, url);
    }
  });

  await Promise.all(tasks.map((t) => t()));

  const successCount = results.filter((r) => r.result !== null).length;
  const failureCount = results.filter((r) => r.result === null).length;

  return { results, totalUrls: urls.length, successCount, failureCount };
}
