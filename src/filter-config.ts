export type SeverityLevel = 'minor' | 'moderate' | 'serious' | 'critical';

const SEVERITY_ORDER: SeverityLevel[] = ['minor', 'moderate', 'serious', 'critical'];

interface FilterConfig {
  minSeverity: SeverityLevel;
  includeIncomplete: boolean;
  ruleIds: string[] | null;
}

let config: FilterConfig = {
  minSeverity: 'minor',
  includeIncomplete: false,
  ruleIds: null,
};

export function getFilterConfig(): Readonly<FilterConfig> {
  return { ...config };
}

export function setFilterConfig(partial: Partial<FilterConfig>): void {
  config = { ...config, ...partial };
}

export function resetFilterConfig(): void {
  config = { minSeverity: 'minor', includeIncomplete: false, ruleIds: null };
}

export function getMinSeverity(): SeverityLevel {
  return config.minSeverity;
}

export function isIncompleteIncluded(): boolean {
  return config.includeIncomplete;
}

export function getActiveRuleIds(): string[] | null {
  return config.ruleIds ? [...config.ruleIds] : null;
}

export function meetsMinSeverity(severity: SeverityLevel): boolean {
  return SEVERITY_ORDER.indexOf(severity) >= SEVERITY_ORDER.indexOf(config.minSeverity);
}
