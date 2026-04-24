import { AuditResult } from './types';
import { getGroupConfig } from './group-config';

export type GroupKey = string;

export interface GroupedResults {
  key: GroupKey;
  items: AuditResult[];
  count: number;
}

export function buildGroupKey(
  result: AuditResult,
  groupBy: 'rule' | 'url' | 'severity'
): GroupKey {
  switch (groupBy) {
    case 'rule':
      return result.ruleId;
    case 'url':
      return result.url;
    case 'severity':
      return result.severity;
    default:
      return result.ruleId;
  }
}

export function groupResults(
  results: AuditResult[]
): Map<GroupKey, AuditResult[]> {
  const config = getGroupConfig();
  const map = new Map<GroupKey, AuditResult[]>();

  for (const result of results) {
    const key = buildGroupKey(result, config.groupBy);
    const existing = map.get(key) ?? [];
    existing.push(result);
    map.set(key, existing);
  }

  return map;
}

export function groupAndSummarize(results: AuditResult[]): GroupedResults[] {
  const grouped = groupResults(results);
  const summary: GroupedResults[] = [];

  for (const [key, items] of grouped.entries()) {
    summary.push({ key, items, count: items.length });
  }

  return summary.sort((a, b) => b.count - a.count);
}

export function formatGroupSummary(groups: GroupedResults[]): string {
  const config = getGroupConfig();
  const lines: string[] = [`Grouped by: ${config.groupBy}`];

  for (const group of groups) {
    const countPart = config.includeCount ? ` (${group.count})` : '';
    lines.push(`  ${group.key}${countPart}`);
  }

  return lines.join('\n');
}
