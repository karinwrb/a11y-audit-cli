/**
 * Sampling config — controls probabilistic sampling of audit results.
 * When enabled, only a percentage of results are kept for reporting.
 */

export interface SamplingConfig {
  enabled: boolean;
  /** Value between 0 and 1 (e.g. 0.5 = 50%) */
  rate: number;
  /** Optional fixed seed for reproducible sampling */
  seed?: number;
}

const DEFAULT_CONFIG: SamplingConfig = {
  enabled: false,
  rate: 1.0,
  seed: undefined,
};

let currentConfig: SamplingConfig = { ...DEFAULT_CONFIG };

export function getSamplingConfig(): SamplingConfig {
  return { ...currentConfig };
}

export function setSamplingConfig(config: Partial<SamplingConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

export function resetSamplingConfig(): void {
  currentConfig = { ...DEFAULT_CONFIG };
}

export function isSamplingEnabled(): boolean {
  return currentConfig.enabled;
}

export function getSamplingRate(): number {
  return currentConfig.rate;
}

export function getSamplingSeed(): number | undefined {
  return currentConfig.seed;
}
