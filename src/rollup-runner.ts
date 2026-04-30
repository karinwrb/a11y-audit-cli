import type { AuditResult } from './types';
import { getRollupConfig, isRollupEnabled } from './rollup-config';

export interface RollupEntry {
  key: string;
  count: number;
  urls: string[];
  ruleIds: string[];
}

export interface RollupSummary {
  groupBy: string;
  totalResults: number;
  entries: RollupEntry[];
  topN: RollupEntry[];
}

export function rollupByRule(results: AuditResult[]): RollupEntry[] {
  const map = new Map<string, RollupEntry>();
  for (const r of results) {
    const key = r.ruleId;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      if (!existing.urls.includes(r.url)) existing.urls.push(r.url);
    } else {
      map.set(key, { key, count: 1, urls: [r.url], ruleIds: [r.ruleId] });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function rollupByUrl(results: AuditResult[]): RollupEntry[] {
  const map = new Map<string, RollupEntry>();
  for (const r of results) {
    const key = r.url;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      if (!existing.ruleIds.includes(r.ruleId)) existing.ruleIds.push(r.ruleId);
    } else {
      map.set(key, { key, count: 1, urls: [r.url], ruleIds: [r.ruleId] });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function rollupBySeverity(results: AuditResult[]): RollupEntry[] {
  const map = new Map<string, RollupEntry>();
  for (const r of results) {
    const key = r.severity;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      if (!existing.urls.includes(r.url)) existing.urls.push(r.url);
      if (!existing.ruleIds.includes(r.ruleId)) existing.ruleIds.push(r.ruleId);
    } else {
      map.set(key, { key, count: 1, urls: [r.url], ruleIds: [r.ruleId] });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function runRollup(results: AuditResult[]): RollupSummary | null {
  if (!isRollupEnabled()) return null;
  const cfg = getRollupConfig();

  let entries: RollupEntry[];
  if (cfg.groupBy === 'url') entries = rollupByUrl(results);
  else if (cfg.groupBy === 'severity') entries = rollupBySeverity(results);
  else entries = rollupByRule(results);

  const filtered = entries.filter(e => e.urls.length >= cfg.minUrlCount);
  return {
    groupBy: cfg.groupBy,
    totalResults: results.length,
    entries: filtered,
    topN: filtered.slice(0, cfg.topN),
  };
}

export function formatRollupSummary(summary: RollupSummary): string {
  const lines: string[] = [`Rollup (by ${summary.groupBy}): ${summary.totalResults} total results`];
  for (const entry of summary.topN) {
    lines.push(`  ${entry.key}: ${entry.count} occurrences across ${entry.urls.length} URL(s)`);
  }
  return lines.join('\n');
}
