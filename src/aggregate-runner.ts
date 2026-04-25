import { AuditResult } from './types';
import { getAggregateConfig } from './aggregate-config';

export interface UrlAggregate {
  url: string;
  count: number;
  results: AuditResult[];
  ruleIds: string[];
}

export interface RuleAggregate {
  ruleId: string;
  count: number;
  urls: string[];
}

export interface AggregateStats {
  totalResults: number;
  uniqueUrls: number;
  uniqueRules: number;
  mostViolatedRule: string | null;
  mostAffectedUrl: string | null;
}

export function aggregateByUrl(results: AuditResult[]): UrlAggregate[] {
  const map = new Map<string, AuditResult[]>();
  for (const r of results) {
    const existing = map.get(r.url) ?? [];
    existing.push(r);
    map.set(r.url, existing);
  }
  return Array.from(map.entries()).map(([url, items]) => ({
    url,
    count: items.length,
    results: items,
    ruleIds: [...new Set(items.map((i) => i.ruleId))],
  }));
}

export function aggregateByRule(results: AuditResult[]): RuleAggregate[] {
  const map = new Map<string, Set<string>>();
  for (const r of results) {
    const existing = map.get(r.ruleId) ?? new Set();
    existing.add(r.url);
    map.set(r.ruleId, existing);
  }
  return Array.from(map.entries()).map(([ruleId, urlSet]) => ({
    ruleId,
    count: urlSet.size,
    urls: Array.from(urlSet),
  }));
}

export function computeAggregateStats(results: AuditResult[]): AggregateStats {
  const byUrl = aggregateByUrl(results);
  const byRule = aggregateByRule(results);
  const topUrl = byUrl.sort((a, b) => b.count - a.count)[0]?.url ?? null;
  const topRule = byRule.sort((a, b) => b.count - a.count)[0]?.ruleId ?? null;
  return {
    totalResults: results.length,
    uniqueUrls: byUrl.length,
    uniqueRules: byRule.length,
    mostViolatedRule: topRule,
    mostAffectedUrl: topUrl,
  };
}

export function runAggregation(
  results: AuditResult[]
): { byUrl?: UrlAggregate[]; byRule?: RuleAggregate[]; stats?: AggregateStats } {
  const config = getAggregateConfig();
  if (!config.enabled) return {};
  return {
    byUrl: config.groupByUrl ? aggregateByUrl(results) : undefined,
    byRule: config.groupByRule ? aggregateByRule(results) : undefined,
    stats: config.includeStats ? computeAggregateStats(results) : undefined,
  };
}
