export interface RedactConfig {
  enabled: boolean;
  fields: string[];
}

let config: RedactConfig = {
  enabled: true,
  fields: ['password', 'token', 'secret', 'apiKey', 'api_key'],
};

export function getRedactConfig(): RedactConfig {
  return { ...config };
}

export function setRedactConfig(partial: Partial<RedactConfig>): void {
  config = { ...config, ...partial };
}

export function resetRedactConfig(): void {
  config = {
    enabled: true,
    fields: ['password', 'token', 'secret', 'apiKey', 'api_key'],
  };
}

export function isRedactEnabled(): boolean {
  return config.enabled;
}

export function getRedactFields(): string[] {
  return [...config.fields];
}
