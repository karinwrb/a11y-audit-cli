/**
 * Rollup configuration: controls how audit results are rolled up
 * into higher-level summaries across multiple URLs or runs.
 */

export interface RollupConfig {
  enabled: boolean;
  /** Group rolled-up results by: 'url' | 'rule' | 'severity' */
  groupBy: 'url' | 'rule' | 'severity';
  /** Include only rules that appear in at least this many URLs */
  minUrlCount: number;
  /** Emit a top-N list of most-violated rules */
  topN: number;
}

const DEFAULT_CONFIG: RollupConfig = {
  enabled: true,
  groupBy: 'rule',
  minUrlCount: 1,
  topN: 10,
};

let current: RollupConfig = { ...DEFAULT_CONFIG };

export function getRollupConfig(): RollupConfig {
  return { ...current };
}

export function setRollupConfig(overrides: Partial<RollupConfig>): void {
  current = { ...current, ...overrides };
}

export function resetRollupConfig(): void {
  current = { ...DEFAULT_CONFIG };
}

export function isRollupEnabled(): boolean {
  return current.enabled;
}

export function getGroupBy(): RollupConfig['groupBy'] {
  return current.groupBy;
}

export function getTopN(): number {
  return current.topN;
}
