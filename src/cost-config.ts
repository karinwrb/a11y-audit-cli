export interface CostConfig {
  enabled: boolean;
  maxCostPerRun: number;
  costPerRequest: number;
  currency: string;
}

const DEFAULT_CONFIG: CostConfig = {
  enabled: false,
  maxCostPerRun: 10.0,
  costPerRequest: 0.01,
  currency: 'USD',
};

let current: CostConfig = { ...DEFAULT_CONFIG };

export function getCostConfig(): CostConfig {
  return { ...current };
}

export function setCostConfig(config: Partial<CostConfig>): void {
  current = { ...current, ...config };
}

export function resetCostConfig(): void {
  current = { ...DEFAULT_CONFIG };
}

export function isCostTrackingEnabled(): boolean {
  return current.enabled;
}

export function getMaxCostPerRun(): number {
  return current.maxCostPerRun;
}

export function getCostPerRequest(): number {
  return current.costPerRequest;
}

export function getCurrency(): string {
  return current.currency;
}
