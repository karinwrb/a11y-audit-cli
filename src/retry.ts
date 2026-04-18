export interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  backoffFactor: number;
  shouldRetry?: (error: Error) => boolean;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  delayMs: 500,
  backoffFactor: 2,
};

export function getRetryOptions(overrides?: Partial<RetryOptions>): RetryOptions {
  return { ...DEFAULT_RETRY_OPTIONS, ...overrides };
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: Partial<RetryOptions>
): Promise<T> {
  const opts = getRetryOptions(options);
  let lastError: Error;
  let delay = opts.delayMs;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      const shouldRetry = opts.shouldRetry ? opts.shouldRetry(lastError) : true;
      if (!shouldRetry || attempt === opts.maxAttempts) {
        throw lastError;
      }
      await sleep(delay);
      delay *= opts.backoffFactor;
    }
  }

  throw lastError!;
}

export function isRetryableError(error: Error): boolean {
  const msg = error.message.toLowerCase();
  return (
    msg.includes('timeout') ||
    msg.includes('network') ||
    msg.includes('econnrefused') ||
    msg.includes('enotfound')
  );
}
