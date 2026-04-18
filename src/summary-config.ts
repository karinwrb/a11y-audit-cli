export interface SummaryConfig {
  enabled: boolean;
  format: 'text' | 'json';
  passThreshold: number;
}

const DEFAULT_SUMMARY_CONFIG: SummaryConfig = {
  enabled: true,
  format: 'text',
  passThreshold: 90,
};

let currentConfig: SummaryConfig = { ...DEFAULT_SUMMARY_CONFIG };

export function getSummaryConfig(): SummaryConfig {
  return { ...currentConfig };
}

export function setSummaryConfig(overrides: Partial<SummaryConfig>): void {
  currentConfig = { ...currentConfig, ...overrides };
}

export function resetSummaryConfig(): void {
  currentConfig = { ...DEFAULT_SUMMARY_CONFIG };
}

export function isSummaryEnabled(): boolean {
  return currentConfig.enabled;
}

export function getSummaryFormat(): 'text' | 'json' {
  return currentConfig.format;
}

export function getPassThreshold(): number {
  return currentConfig.passThreshold;
}
