export interface SnapshotConfig {
  enabled: boolean;
  snapshotDir: string;
  autoSave: boolean;
  compareOnRun: boolean;
}

const defaults: SnapshotConfig = {
  enabled: false,
  snapshotDir: '.a11y-snapshots',
  autoSave: false,
  compareOnRun: false,
};

let current: SnapshotConfig = { ...defaults };

export function getSnapshotConfig(): SnapshotConfig {
  return { ...current };
}

export function setSnapshotConfig(overrides: Partial<SnapshotConfig>): void {
  current = { ...current, ...overrides };
}

export function resetSnapshotConfig(): void {
  current = { ...defaults };
}

export function isSnapshotEnabled(): boolean {
  return current.enabled;
}

export function getSnapshotDir(): string {
  return current.snapshotDir;
}

export function isAutoSave(): boolean {
  return current.autoSave;
}

export function isCompareOnRun(): boolean {
  return current.compareOnRun;
}
