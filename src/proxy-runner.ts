import { getProxyConfig, isProxyEnabled, isBypassed } from './proxy-config';

export interface RequestOptions {
  url: string;
  headers?: Record<string, string>;
  agent?: unknown;
}

export function buildProxyAgent(proxyUrl: string): Record<string, string> {
  // Returns a simplified proxy descriptor; real impl would use 'https-proxy-agent'
  return { proxyUrl };
}

export function applyProxy(options: RequestOptions): RequestOptions {
  if (!isProxyEnabled()) return options;

  const config = getProxyConfig();
  if (!config.url) return options;

  if (isBypassed(options.url)) return options;

  const agent = buildProxyAgent(config.url);
  return { ...options, agent };
}

export function injectProxy<T extends RequestOptions>(options: T): T {
  const patched = applyProxy(options);
  return { ...options, ...patched };
}
