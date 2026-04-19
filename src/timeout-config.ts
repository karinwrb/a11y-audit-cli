export interface TimeoutConfig {
  enabled: boolean;
  requestTimeoutMs: number;
  pageLoadTimeoutMs: number;
}

const defaults: TimeoutConfig = {
  enabled: true,
  requestTimeoutMs: 10000,
  pageLoadTimeoutMs: 30000,
};

let current: TimeoutConfig = { ...defaults };

export function getTimeoutConfig(): TimeoutConfig {
  return { ...current };
}

export function setTimeoutConfig(partial: Partial<TimeoutConfig>): void {
  current = { ...current, ...partial };
}

export function resetTimeoutConfig(): void {
  current = { ...defaults };
}

export function isTimeoutEnabled(): boolean {
  return current.enabled;
}

export function getRequestTimeoutMs(): number {
  return current.requestTimeoutMs;
}

export function getPageLoadTimeoutMs(): number {
  return current.pageLoadTimeoutMs;
}
