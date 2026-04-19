import { AuditResult } from './types';
import { getIgnoreConfig, isIgnoreEnabled } from './ignore-config';

export function isRuleIgnored(ruleId: string): boolean {
  if (!isIgnoreEnabled()) return false;
  const { ruleIds } = getIgnoreConfig();
  return ruleIds.includes(ruleId);
}

export function isUrlIgnored(url: string): boolean {
  if (!isIgnoreEnabled()) return false;
  const { urlPatterns } = getIgnoreConfig();
  return urlPatterns.some((pattern) => {
    try {
      return new RegExp(pattern).test(url);
    } catch {
      return url.includes(pattern);
    }
  });
}

export function filterIgnored(
  results: AuditResult[],
  url: string
): AuditResult[] {
  if (!isIgnoreEnabled()) return results;
  if (isUrlIgnored(url)) return [];
  return results.filter((r) => !isRuleIgnored(r.ruleId));
}

export function filterIgnoredAndCount(
  results: AuditResult[],
  url: string
): { results: AuditResult[]; ignoredCount: number } {
  const filtered = filterIgnored(results, url);
  return { results: filtered, ignoredCount: results.length - filtered.length };
}
