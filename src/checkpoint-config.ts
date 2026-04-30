export interface CheckpointConfig {
  enabled: boolean;
  checkpointDir: string;
  resumeOnRestart: boolean;
}

const defaults: CheckpointConfig = {
  enabled: false,
  checkpointDir: '.a11y-checkpoints',
  resumeOnRestart: true,
};

let current: CheckpointConfig = { ...defaults };

export function getCheckpointConfig(): CheckpointConfig {
  return { ...current };
}

export function setCheckpointConfig(overrides: Partial<CheckpointConfig>): void {
  current = { ...current, ...overrides };
}

export function resetCheckpointConfig(): void {
  current = { ...defaults };
}

export function isCheckpointEnabled(): boolean {
  return current.enabled;
}

export function getCheckpointDir(): string {
  return current.checkpointDir;
}

export function isResumeOnRestart(): boolean {
  return current.resumeOnRestart;
}
