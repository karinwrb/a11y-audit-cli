export interface IgnoreConfig {
  enabled: boolean;
  ruleIds: string[];
  urlPatterns: string[];
}

const defaults: IgnoreConfig = {
  enabled: true,
  ruleIds: [],
  urlPatterns: [],
};

let current: IgnoreConfig = { ...defaults };

export function getIgnoreConfig(): IgnoreConfig {
  return { ...current };
}

export function setIgnoreConfig(config: Partial<IgnoreConfig>): void {
  current = { ...current, ...config };
}

export function resetIgnoreConfig(): void {
  current = { ...defaults };
}

export function isIgnoreEnabled(): boolean {
  return current.enabled;
}

export function getIgnoredRuleIds(): string[] {
  return [...current.ruleIds];
}

export function getIgnoredUrlPatterns(): string[] {
  return [...current.urlPatterns];
}
