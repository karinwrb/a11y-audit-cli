export interface PluginConfig {
  enabled: boolean;
  plugins: string[];
}

let config: PluginConfig = {
  enabled: false,
  plugins: [],
};

export function getPluginConfig(): PluginConfig {
  return { ...config };
}

export function setPluginConfig(partial: Partial<PluginConfig>): void {
  config = { ...config, ...partial };
}

export function resetPluginConfig(): void {
  config = { enabled: false, plugins: [] };
}

export function isPluginsEnabled(): boolean {
  return config.enabled;
}

export function getPluginList(): string[] {
  return [...config.plugins];
}

export function addPlugin(name: string): void {
  if (!config.plugins.includes(name)) {
    config.plugins = [...config.plugins, name];
  }
}

export function removePlugin(name: string): void {
  config.plugins = config.plugins.filter((p) => p !== name);
}
