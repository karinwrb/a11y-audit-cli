export interface TransformConfig {
  enabled: boolean;
  stripHtml: boolean;
  normalizeWhitespace: boolean;
  truncateLength: number | null;
}

const defaultConfig: TransformConfig = {
  enabled: false,
  stripHtml: false,
  normalizeWhitespace: false,
  truncateLength: null,
};

let currentConfig: TransformConfig = { ...defaultConfig };

export function getTransformConfig(): TransformConfig {
  return { ...currentConfig };
}

export function setTransformConfig(config: Partial<TransformConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

export function resetTransformConfig(): void {
  currentConfig = { ...defaultConfig };
}

export function isTransformEnabled(): boolean {
  return currentConfig.enabled;
}

export function isStripHtml(): boolean {
  return currentConfig.stripHtml;
}

export function isNormalizeWhitespace(): boolean {
  return currentConfig.normalizeWhitespace;
}

export function getTruncateLength(): number | null {
  return currentConfig.truncateLength;
}
