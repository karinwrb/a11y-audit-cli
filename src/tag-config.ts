export interface TagConfig {
  enabled: boolean;
  tags: string[];
  matchAll: boolean;
}

let config: TagConfig = {
  enabled: false,
  tags: [],
  matchAll: false,
};

export function getTagConfig(): TagConfig {
  return { ...config };
}

export function setTagConfig(partial: Partial<TagConfig>): void {
  config = { ...config, ...partial };
}

export function resetTagConfig(): void {
  config = { enabled: false, tags: [], matchAll: false };
}

export function isTagFilterEnabled(): boolean {
  return config.enabled && config.tags.length > 0;
}

export function getFilterTags(): string[] {
  return [...config.tags];
}

export function isMatchAll(): boolean {
  return config.matchAll;
}
