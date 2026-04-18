export interface CacheConfig {
  enabled: boolean;
  ttlMinutes: number;
  maxEntries: number;
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  enabled: true,
  ttlMinutes: 60,
  maxEntries: 100,
};

let activeConfig: CacheConfig = { ...DEFAULT_CACHE_CONFIG };

export function getCacheConfig(): CacheConfig {
  return { ...activeConfig };
}

export function setCacheConfig(overrides: Partial<CacheConfig>): void {
  activeConfig = { ...activeConfig, ...overrides };
}

export function resetCacheConfig(): void {
  activeConfig = { ...DEFAULT_CACHE_CONFIG };
}

export function isCacheEnabled(): boolean {
  return activeConfig.enabled;
}

export function getTtlMs(): number {
  return activeConfig.ttlMinutes * 60 * 1000;
}

export function parseCacheFlags(args: {
  noCache?: boolean;
  cacheTtl?: number;
}): Partial<CacheConfig> {
  const overrides: Partial<CacheConfig> = {};
  if (args.noCache) overrides.enabled = false;
  if (args.cacheTtl !== undefined && args.cacheTtl > 0) {
    overrides.ttlMinutes = args.cacheTtl;
  }
  return overrides;
}
