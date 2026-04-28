export interface SeverityConfig {
  enabled: boolean;
  overrides: Record<string, string>;
  defaultSeverity: string;
}

let config: SeverityConfig = {
  enabled: false,
  overrides: {},
  defaultSeverity: 'moderate',
};

export function getSeverityConfig(): SeverityConfig {
  return { ...config };
}

export function setSeverityConfig(partial: Partial<SeverityConfig>): void {
  config = { ...config, ...partial };
}

export function resetSeverityConfig(): void {
  config = {
    enabled: false,
    overrides: {},
    defaultSeverity: 'moderate',
  };
}

export function isSeverityOverrideEnabled(): boolean {
  return config.enabled;
}

export function getSeverityOverrides(): Record<string, string> {
  return { ...config.overrides };
}

export function getDefaultSeverity(): string {
  return config.defaultSeverity;
}

export function getSeverityForRule(ruleId: string): string | undefined {
  return config.overrides[ruleId];
}
