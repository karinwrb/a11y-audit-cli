/**
 * Configuration for audit diff / regression detection.
 * Compares the current run's results against a previous snapshot.
 */

export interface DiffConfig {
  enabled: boolean;
  /** Path to the previous snapshot JSON file */
  snapshotFile: string;
  /** If true, exit with non-zero code when new violations are found */
  failOnNew: boolean;
}

const DEFAULT: DiffConfig = {
  enabled: false,
  snapshotFile: '.a11y-snapshot.json',
  failOnNew: true,
};

let current: DiffConfig = { ...DEFAULT };

export function getDiffConfig(): DiffConfig {
  return { ...current };
}

export function setDiffConfig(overrides: Partial<DiffConfig>): void {
  current = { ...current, ...overrides };
}

export function resetDiffConfig(): void {
  current = { ...DEFAULT };
}

export function isDiffEnabled(): boolean {
  return current.enabled;
}

export function getSnapshotFile(): string {
  return current.snapshotFile;
}

export function isFailOnNew(): boolean {
  return current.failOnNew;
}
