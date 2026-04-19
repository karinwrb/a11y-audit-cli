export interface TelemetryConfig {
  enabled: boolean;
  endpoint: string | null;
  includeUrl: boolean;
}

const defaults: TelemetryConfig = {
  enabled: false,
  endpoint: null,
  includeUrl: false,
};

let current: TelemetryConfig = { ...defaults };

export function getTelemetryConfig(): TelemetryConfig {
  return { ...current };
}

export function setTelemetryConfig(partial: Partial<TelemetryConfig>): void {
  current = { ...current, ...partial };
}

export function resetTelemetryConfig(): void {
  current = { ...defaults };
}

export function isTelemetryEnabled(): boolean {
  return current.enabled;
}

export function getTelemetryEndpoint(): string | null {
  return current.endpoint;
}

export function isUrlIncluded(): boolean {
  return current.includeUrl;
}
