export interface GroupConfig {
  enabled: boolean;
  groupBy: 'rule' | 'url' | 'severity';
  includeCount: boolean;
}

const defaults: GroupConfig = {
  enabled: false,
  groupBy: 'rule',
  includeCount: true,
};

let current: GroupConfig = { ...defaults };

export function getGroupConfig(): GroupConfig {
  return { ...current };
}

export function setGroupConfig(config: Partial<GroupConfig>): void {
  current = { ...current, ...config };
}

export function resetGroupConfig(): void {
  current = { ...defaults };
}

export function isGroupingEnabled(): boolean {
  return current.enabled;
}

export function getGroupBy(): GroupConfig['groupBy'] {
  return current.groupBy;
}

export function isCountIncluded(): boolean {
  return current.includeCount;
}
