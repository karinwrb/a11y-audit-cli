export interface ScopeConfig {
  enabled: boolean;
  includePatterns: string[];
  excludePatterns: string[];
  maxDepth: number;
}

const defaults: ScopeConfig = {
  enabled: false,
  includePatterns: [],
  excludePatterns: [],
  maxDepth: 0,
};

let current: ScopeConfig = { ...defaults };

export function getScopeConfig(): ScopeConfig {
  return { ...current };
}

export function setScopeConfig(config: Partial<ScopeConfig>): void {
  current = { ...current, ...config };
}

export function resetScopeConfig(): void {
  current = { ...defaults };
}

export function isScopeEnabled(): boolean {
  return current.enabled;
}

export function getIncludePatterns(): string[] {
  return [...current.includePatterns];
}

export function getExcludePatterns(): string[] {
  return [...current.excludePatterns];
}

export function getMaxDepth(): number {
  return current.maxDepth;
}
