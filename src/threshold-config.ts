export interface ThresholdConfig {
  enabled: boolean;
  minScore: number;
  failOnViolation: boolean;
}

const defaults: ThresholdConfig = {
  enabled: false,
  minScore: 80,
  failOnViolation: false,
};

let current: ThresholdConfig = { ...defaults };

export function getThresholdConfig(): ThresholdConfig {
  return { ...current };
}

export function setThresholdConfig(config: Partial<ThresholdConfig>): void {
  current = { ...current, ...config };
}

export function resetThresholdConfig(): void {
  current = { ...defaults };
}

export function isThresholdEnabled(): boolean {
  return current.enabled;
}

export function getMinScore(): number {
  return current.minScore;
}

export function isFailOnViolation(): boolean {
  return current.failOnViolation;
}
