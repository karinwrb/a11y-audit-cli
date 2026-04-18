import { RetryOptions } from './retry';

let retryConfig: RetryOptions = {
  maxAttempts: 3,
  delayMs: 500,
  backoffFactor: 2,
};

export function getRetryConfig(): RetryOptions {
  return { ...retryConfig };
}

export function setRetryConfig(overrides: Partial<RetryOptions>): void {
  retryConfig = { ...retryConfig, ...overrides };
}

export function resetRetryConfig(): void {
  retryConfig = {
    maxAttempts: 3,
    delayMs: 500,
    backoffFactor: 2,
  };
}

export function isRetryEnabled(): boolean {
  return retryConfig.maxAttempts > 1;
}

export function getMaxAttempts(): number {
  return retryConfig.maxAttempts;
}

export function getDelayMs(): number {
  return retryConfig.delayMs;
}
