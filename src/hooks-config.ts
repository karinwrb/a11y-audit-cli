export interface HooksConfig {
  enabled: boolean;
  beforeScan?: string;  // shell command or module path
  afterScan?: string;
}

const DEFAULT_CONFIG: HooksConfig = {
  enabled: false,
  beforeScan: undefined,
  afterScan: undefined,
};

let current: HooksConfig = { ...DEFAULT_CONFIG };

export function getHooksConfig(): HooksConfig {
  return { ...current };
}

export function setHooksConfig(config: Partial<HooksConfig>): void {
  current = { ...current, ...config };
}

export function resetHooksConfig(): void {
  current = { ...DEFAULT_CONFIG };
}

export function isHooksEnabled(): boolean {
  return current.enabled;
}

export function getBeforeHook(): string | undefined {
  return current.beforeScan;
}

export function getAfterHook(): string | undefined {
  return current.afterScan;
}
