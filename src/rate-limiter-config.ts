export interface RateLimiterConfig {
  enabled: boolean;
  delayMs: number;
  maxConcurrent: number;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  enabled: true,
  delayMs: 1000,
  maxConcurrent: 3,
};

let currentConfig: RateLimiterConfig = { ...DEFAULT_CONFIG };

export function getRateLimiterConfig(): RateLimiterConfig {
  return { ...currentConfig };
}

export function setRateLimiterConfig(overrides: Partial<RateLimiterConfig>): void {
  currentConfig = { ...currentConfig, ...overrides };
}

export function resetRateLimiterConfig(): void {
  currentConfig = { ...DEFAULT_CONFIG };
}

export function isRateLimitingEnabled(): boolean {
  return currentConfig.enabled;
}

export function getDelayMs(): number {
  return currentConfig.delayMs;
}

export function getMaxConcurrent(): number {
  return currentConfig.maxConcurrent;
}
