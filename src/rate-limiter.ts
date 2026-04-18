const DEFAULT_DELAY_MS = 1000;
const DEFAULT_MAX_CONCURRENT = 3;

export interface RateLimiterOptions {
  delayMs?: number;
  maxConcurrent?: number;
}

export interface RateLimiter {
  acquire(): Promise<void>;
  release(): void;
  delay(): Promise<void>;
}

export function createRateLimiter(options: RateLimiterOptions = {}): RateLimiter {
  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  const maxConcurrent = options.maxConcurrent ?? DEFAULT_MAX_CONCURRENT;
  let active = 0;
  const queue: Array<() => void> = [];

  function acquire(): Promise<void> {
    return new Promise((resolve) => {
      if (active < maxConcurrent) {
        active++;
        resolve();
      } else {
        queue.push(() => {
          active++;
          resolve();
        });
      }
    });
  }

  function release(): void {
    active--;
    const next = queue.shift();
    if (next) next();
  }

  function delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return { acquire, release, delay };
}

export async function withRateLimit<T>(
  limiter: RateLimiter,
  fn: () => Promise<T>
): Promise<T> {
  await limiter.acquire();
  try {
    const result = await fn();
    await limiter.delay();
    return result;
  } finally {
    limiter.release();
  }
}
