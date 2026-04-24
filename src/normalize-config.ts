export interface NormalizeConfig {
  enabled: boolean;
  lowercaseUrls: boolean;
  trimWhitespace: boolean;
  removeTrailingSlash: boolean;
}

const defaults: NormalizeConfig = {
  enabled: true,
  lowercaseUrls: false,
  trimWhitespace: true,
  removeTrailingSlash: true,
};

let current: NormalizeConfig = { ...defaults };

export function getNormalizeConfig(): NormalizeConfig {
  return { ...current };
}

export function setNormalizeConfig(partial: Partial<NormalizeConfig>): void {
  current = { ...current, ...partial };
}

export function resetNormalizeConfig(): void {
  current = { ...defaults };
}

export function isNormalizeEnabled(): boolean {
  return current.enabled;
}

export function isLowercaseUrls(): boolean {
  return current.lowercaseUrls;
}

export function isTrimWhitespace(): boolean {
  return current.trimWhitespace;
}

export function isRemoveTrailingSlash(): boolean {
  return current.removeTrailingSlash;
}
