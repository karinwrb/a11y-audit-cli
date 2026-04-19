export interface BaselineConfig {
  enabled: boolean;
  baselineFile: string;
  updateBaseline: boolean;
}

const defaults: BaselineConfig = {
  enabled: false,
  baselineFile: '.a11y-baseline.json',
  updateBaseline: false,
};

let current: BaselineConfig = { ...defaults };

export function getBaselineConfig(): BaselineConfig {
  return { ...current };
}

export function setBaselineConfig(config: Partial<BaselineConfig>): void {
  current = { ...current, ...config };
}

export function resetBaselineConfig(): void {
  current = { ...defaults };
}

export function isBaselineEnabled(): boolean {
  return current.enabled;
}

export function getBaselineFile(): string {
  return current.baselineFile;
}

export function shouldUpdateBaseline(): boolean {
  return current.updateBaseline;
}
