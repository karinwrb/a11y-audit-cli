export interface MaskConfig {
  enabled: boolean;
  maskChar?: string;
  visibleChars?: number;
  sensitiveFields?: string[];
  maskUrls?: boolean;
}

const DEFAULT_CONFIG: MaskConfig = {
  enabled: false,
  maskChar: '*',
  visibleChars: 4,
  sensitiveFields: ['token', 'password', 'secret', 'apiKey', 'authorization'],
  maskUrls: false,
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
  return currentConfig.maskChar ?? '*';
}

export function getVisibleChars(): number {
  return currentConfig.visibleChars ?? 4;
}

export function getSensitiveFields(): string[] {
  return currentConfig.sensitiveFields ?? [];
}

export function isMaskUrlsEnabled(): boolean {
  return currentConfig.maskUrls ?? false;
}
