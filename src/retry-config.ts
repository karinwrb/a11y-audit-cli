import { RetryOptions } from './retry';

const DEFAULT_RETRY_CONFIG: RetryOptions = {
  maxAttempts: 3,
  delayMs: 500,
  backoffFactor: 2,
};

let retryConfig: RetryOptions = { ...DEFAULT_RETRY_CONFIG };

export function getRetryConfig(): RetryOptions {
  return { ...retryConfig };
}

export function setRetryConfig(overrides: Partial<RetryOptions>): void {
  retryConfig = { ...retryConfig, ...overrides };
}

export function resetRetryConfig(): void {
  retryConfig = { ...DEFAULT_RETRY_CONFIG };
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
