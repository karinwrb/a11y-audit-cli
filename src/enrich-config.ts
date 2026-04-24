/**
 * Configuration for result enrichment (adding metadata to audit results).
 */

export interface EnrichConfig {
  enabled: boolean;
  addTimestamp: boolean;
  addHostname: boolean;
  addUserAgent: string | null;
}

let config: EnrichConfig = {
  enabled: false,
  addTimestamp: true,
  addHostname: true,
  addUserAgent: null,
};

export function getEnrichConfig(): EnrichConfig {
  return { ...config };
}

export function setEnrichConfig(partial: Partial<EnrichConfig>): void {
  config = { ...config, ...partial };
}

export function resetEnrichConfig(): void {
  config = {
    enabled: false,
    addTimestamp: true,
    addHostname: true,
    addUserAgent: null,
  };
}

export function isEnrichEnabled(): boolean {
  return config.enabled;
}

export function isTimestampEnabled(): boolean {
  return config.addTimestamp;
}

export function isHostnameEnabled(): boolean {
  return config.addHostname;
}

export function getUserAgent(): string | null {
  return config.addUserAgent;
}
