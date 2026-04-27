export interface PaginationConfig {
  enabled: boolean;
  pageSize: number;
  maxPages: number;
}

const DEFAULT_CONFIG: PaginationConfig = {
  enabled: false,
  pageSize: 10,
  maxPages: 100,
};

let currentConfig: PaginationConfig = { ...DEFAULT_CONFIG };

export function getPaginationConfig(): PaginationConfig {
  return { ...currentConfig };
}

export function setPaginationConfig(config: Partial<PaginationConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

export function resetPaginationConfig(): void {
  currentConfig = { ...DEFAULT_CONFIG };
}

export function isPaginationEnabled(): boolean {
  return currentConfig.enabled;
}

export function getPageSize(): number {
  return currentConfig.pageSize;
}

export function getMaxPages(): number {
  return currentConfig.maxPages;
}
