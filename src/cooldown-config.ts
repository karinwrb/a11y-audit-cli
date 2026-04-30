/**
 * Cooldown configuration: enforces a minimum wait time between
 * successive audits of the same URL to avoid hammering targets.
 */

export interface CooldownConfig {
  enabled: boolean;
  /** Minimum milliseconds between audits of the same URL */
  cooldownMs: number;
}

const DEFAULT_CONFIG: CooldownConfig = {
  enabled: false,
  cooldownMs: 5000,
};

let currentConfig: CooldownConfig = { ...DEFAULT_CONFIG };

export function getCooldownConfig(): CooldownConfig {
  return { ...currentConfig };
}

export function setCooldownConfig(overrides: Partial<CooldownConfig>): void {
  currentConfig = { ...currentConfig, ...overrides };
}

export function resetCooldownConfig(): void {
  currentConfig = { ...DEFAULT_CONFIG };
}

export function isCooldownEnabled(): boolean {
  return currentConfig.enabled;
}

export function getCooldownMs(): number {
  return currentConfig.cooldownMs;
}
