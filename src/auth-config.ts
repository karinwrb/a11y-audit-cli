export interface AuthConfig {
  enabled: boolean;
  bearerToken?: string;
  basicUser?: string;
  basicPass?: string;
}

let config: AuthConfig = {
  enabled: false,
};

export function getAuthConfig(): AuthConfig {
  return { ...config };
}

export function setAuthConfig(partial: Partial<AuthConfig>): void {
  config = { ...config, ...partial };
}

export function resetAuthConfig(): void {
  config = { enabled: false };
}

export function isAuthEnabled(): boolean {
  return config.enabled;
}

export function getBearerToken(): string | undefined {
  return config.bearerToken;
}

export function getBasicCredentials(): { user: string; pass: string } | undefined {
  if (config.basicUser && config.basicPass) {
    return { user: config.basicUser, pass: config.basicPass };
  }
  return undefined;
}

export function buildAuthHeaders(): Record<string, string> {
  if (!config.enabled) return {};
  if (config.bearerToken) {
    return { Authorization: `Bearer ${config.bearerToken}` };
  }
  const creds = getBasicCredentials();
  if (creds) {
    const encoded = Buffer.from(`${creds.user}:${creds.pass}`).toString('base64');
    return { Authorization: `Basic ${encoded}` };
  }
  return {};
}
