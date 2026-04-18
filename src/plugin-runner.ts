import { AuditResult } from './types';
import { getPluginConfig } from './plugin-config';

export type PluginTransform = (results: AuditResult[]) => AuditResult[];

const registry = new Map<string, PluginTransform>();

export function registerPlugin(name: string, transform: PluginTransform): void {
  registry.set(name, transform);
}

export function unregisterPlugin(name: string): void {
  registry.delete(name);
}

export function getRegisteredPlugins(): string[] {
  return Array.from(registry.keys());
}

export function applyPlugins(results: AuditResult[]): AuditResult[] {
  const { enabled, plugins } = getPluginConfig();
  if (!enabled || plugins.length === 0) {
    return results;
  }

  return plugins.reduce((acc, name) => {
    const transform = registry.get(name);
    if (!transform) {
      console.warn(`[plugin-runner] Plugin "${name}" is not registered, skipping.`);
      return acc;
    }
    return transform(acc);
  }, results);
}
