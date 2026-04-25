export interface AggregateConfig {
  enabled: boolean;
  groupByUrl: boolean;
  groupByRule: boolean;
  includeStats: boolean;
}

const defaults: AggregateConfig = {
  enabled: false,
  groupByUrl: true,
  groupByRule: false,
  includeStats: true,
};

let current: AggregateConfig = { ...defaults };

export function getAggregateConfig(): AggregateConfig {
  return { ...current };
}

export function setAggregateConfig(overrides: Partial<AggregateConfig>): void {
  current = { ...current, ...overrides };
}

export function resetAggregateConfig(): void {
  current = { ...defaults };
}

export function isAggregateEnabled(): boolean {
  return current.enabled;
}

export function isGroupByUrl(): boolean {
  return current.groupByUrl;
}

export function isGroupByRule(): boolean {
  return current.groupByRule;
}

export function isIncludeStats(): boolean {
  return current.includeStats;
}
