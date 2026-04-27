/**
 * Configuration for masking sensitive data in audit results and reports.
 */

export interface MaskConfig {
  enabled: boolean;
  maskChar: string;
  maskFields: string[];
  partialMask: boolean;
  visibleChars: number;
}

const DEFAULT_CONFIG: MaskConfig = {
  enabled: false,
  maskChar: "*",
  maskFields: ["password", "token", "secret", "apiKey", "authorization"],
  partialMask: false,
  visibleChars: 4,
};

let currentConfig: MaskConfig = { ...DEFAULT_CONFIG };

export function getMaskConfig(): MaskConfig {
  return { ...currentConfig };
}

export function setMaskConfig(config: Partial<MaskConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

export function resetMaskConfig(): void {
  currentConfig = { ...DEFAULT_CONFIG };
}

export function isMaskEnabled(): boolean {
  return currentConfig.enabled;
}

export function getMaskChar(): string {
  return currentConfig.maskChar;
}

export function getMaskFields(): string[] {
  return [...currentConfig.maskFields];
}

export function isPartialMask(): boolean {
  return currentConfig.partialMask;
}

export function getVisibleChars(): number {
  return currentConfig.visibleChars;
}
