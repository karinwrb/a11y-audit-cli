export interface DedupeConfig {
  enabled: boolean;
  strategy: 'url+rule' | 'rule' | 'url';
}

const defaults: DedupeConfig = {
  enabled: true,
  strategy: 'url+rule',
};

let current: DedupeConfig = { ...defaults };

export function getDedupeConfig(): DedupeConfig {
  return { ...current };
}

export function setDedupeConfig(overrides: Partial<DedupeConfig>): void {
  current = { ...current, ...overrides };
}

export function resetDedupeConfig(): void {
  current = { ...defaults };
}

export function isDedupeEnabled(): boolean {
  return current.enabled;
}

export function getDedupeStrategy(): DedupeConfig['strategy'] {
  return current.strategy;
}
