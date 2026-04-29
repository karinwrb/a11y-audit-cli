export interface WatchlistConfig {
  enabled: boolean;
  urls: string[];
  alertOnNewViolations: boolean;
  alertOnRemovedViolations: boolean;
}

const defaults: WatchlistConfig = {
  enabled: false,
  urls: [],
  alertOnNewViolations: true,
  alertOnRemovedViolations: false,
};

let current: WatchlistConfig = { ...defaults };

export function getWatchlistConfig(): WatchlistConfig {
  return { ...current };
}

export function setWatchlistConfig(config: Partial<WatchlistConfig>): void {
  current = { ...current, ...config };
}

export function resetWatchlistConfig(): void {
  current = { ...defaults };
}

export function isWatchlistEnabled(): boolean {
  return current.enabled;
}

export function getWatchedUrls(): string[] {
  return [...current.urls];
}

export function addWatchedUrl(url: string): void {
  if (!current.urls.includes(url)) {
    current.urls = [...current.urls, url];
  }
}

export function removeWatchedUrl(url: string): void {
  current.urls = current.urls.filter((u) => u !== url);
}
