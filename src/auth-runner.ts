import { getAuthConfig } from './auth-config';

export interface RequestHeaders {
  [key: string]: string;
}

export function buildAuthHeaders(): RequestHeaders {
  const config = getAuthConfig();
  if (!config.enabled) return {};

  if (config.bearerToken) {
    return { Authorization: `Bearer ${config.bearerToken}` };
  }

  if (config.username && config.password) {
    const encoded = Buffer.from(`${config.username}:${config.password}`).toString('base64');
    return { Authorization: `Basic ${encoded}` };
  }

  if (config.customHeaders) {
    return { ...config.customHeaders };
  }

  return {};
}

export function applyAuthToUrl(url: string): string {
  const config = getAuthConfig();
  if (!config.enabled) return url;

  if (config.apiKey && config.apiKeyParam) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${config.apiKeyParam}=${encodeURIComponent(config.apiKey)}`;
  }

  return url;
}

export function injectAuth(url: string): { url: string; headers: RequestHeaders } {
  return {
    url: applyAuthToUrl(url),
    headers: buildAuthHeaders(),
  };
}

/**
 * Returns true if any authentication method is configured and enabled.
 * Useful for logging or conditional behaviour in the audit runner.
 */
export function isAuthConfigured(): boolean {
  const config = getAuthConfig();
  if (!config.enabled) return false;

  return !!(
    config.bearerToken ||
    (config.username && config.password) ||
    config.customHeaders ||
    (config.apiKey && config.apiKeyParam)
  );
}
