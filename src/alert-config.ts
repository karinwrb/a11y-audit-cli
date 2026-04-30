export interface AlertConfig {
  enabled: boolean;
  onCritical: boolean;
  onScoreBelow: number | null;
  onNewViolations: boolean;
  channels: string[];
}

const defaults: AlertConfig = {
  enabled: false,
  onCritical: true,
  onScoreBelow: null,
  onNewViolations: false,
  channels: [],
};

let current: AlertConfig = { ...defaults };

export function getAlertConfig(): AlertConfig {
  return { ...current };
}

export function setAlertConfig(overrides: Partial<AlertConfig>): void {
  current = { ...current, ...overrides };
}

export function resetAlertConfig(): void {
  current = { ...defaults };
}

export function isAlertEnabled(): boolean {
  return current.enabled;
}

export function isAlertOnCritical(): boolean {
  return current.onCritical;
}

export function getAlertScoreThreshold(): number | null {
  return current.onScoreBelow;
}

export function isAlertOnNewViolations(): boolean {
  return current.onNewViolations;
}

export function getAlertChannels(): string[] {
  return [...current.channels];
}
