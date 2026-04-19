export interface ProxyConfig {
  enabled: boolean;
  url: string | null;
  bypassList: string[];
}

let config: ProxyConfig = {
  enabled: false,
  url: null,
  bypassList: [],
};

export function getProxyConfig(): ProxyConfig {
  return { ...config };
}

export function setProxyConfig(partial: Partial<ProxyConfig>): void {
  config = { ...config, ...partial };
}

export function resetProxyConfig(): void {
  config = { enabled: false, url: null, bypassList: [] };
}

export function isProxyEnabled(): boolean {
  return config.enabled && config.url !== null;
}

export function getProxyUrl(): string | null {
  return config.url;
}

export function getBypassList(): string[] {
  return [...config.bypassList];
}

export function isBypassed(url: string): boolean {
  return config.bypassList.some((pattern) => url.includes(pattern));
}
