export interface QuotaConfig {
  enabled: boolean;
  maxRequestsPerHour: number;
  maxRequestsPerDay: number;
  storageKey: string;
}

const DEFAULT_CONFIG: QuotaConfig = {
  enabled: false,
  maxRequestsPerHour: 100,
  maxRequestsPerDay: 500,
  storageKey: 'a11y-audit-quota',
};

let current: QuotaConfig = { ...DEFAULT_CONFIG };

export function getQuotaConfig(): QuotaConfig {
  return { ...current };
}

export function setQuotaConfig(overrides: Partial<QuotaConfig>): void {
  current = { ...current, ...overrides };
}

export function resetQuotaConfig(): void {
  current = { ...DEFAULT_CONFIG };
}

export function isQuotaEnabled(): boolean {
  return current.enabled;
}

export function getMaxRequestsPerHour(): number {
  return current.maxRequestsPerHour;
}

export function getMaxRequestsPerDay(): number {
  return current.maxRequestsPerDay;
}

export function getStorageKey(): string {
  return current.storageKey;
}
