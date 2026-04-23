export interface ExportConfig {
  enabled: boolean;
  destinations: ExportDestination[];
  includeTimestamp: boolean;
}

export type ExportDestination = 'file' | 's3' | 'stdout';

const DEFAULT_CONFIG: ExportConfig = {
  enabled: true,
  destinations: ['file'],
  includeTimestamp: true,
};

let currentConfig: ExportConfig = { ...DEFAULT_CONFIG };

export function getExportConfig(): ExportConfig {
  return { ...currentConfig };
}

export function setExportConfig(partial: Partial<ExportConfig>): void {
  currentConfig = { ...currentConfig, ...partial };
}

export function resetExportConfig(): void {
  currentConfig = { ...DEFAULT_CONFIG };
}

export function isExportEnabled(): boolean {
  return currentConfig.enabled;
}

export function getExportDestinations(): ExportDestination[] {
  return [...currentConfig.destinations];
}

export function isTimestampIncluded(): boolean {
  return currentConfig.includeTimestamp;
}
