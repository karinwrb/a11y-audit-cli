import { AuditResult } from './types';
import {
  isScopeEnabled,
  getIncludePatterns,
  getExcludePatterns,
  getMaxDepth,
} from './scope-config';

export function matchesPattern(url: string, pattern: string): boolean {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`).test(url);
}

export function isUrlInScope(url: string): boolean {
  const includes = getIncludePatterns();
  const excludes = getExcludePatterns();

  if (excludes.some((p) => matchesPattern(url, p))) return false;
  if (includes.length === 0) return true;
  return includes.some((p) => matchesPattern(url, p));
}

export function getUrlDepth(url: string): number {
  try {
    const { pathname } = new URL(url);
    return pathname.split('/').filter(Boolean).length;
  } catch {
    return 0;
  }
}

export function isWithinDepth(url: string): boolean {
  const maxDepth = getMaxDepth();
  if (maxDepth <= 0) return true;
  return getUrlDepth(url) <= maxDepth;
}

export function filterByScope(results: AuditResult[]): AuditResult[] {
  if (!isScopeEnabled()) return results;
  return results.filter((r) => isUrlInScope(r.url) && isWithinDepth(r.url));
}

export function filterByScopeAndCount(
  results: AuditResult[]
): { results: AuditResult[]; removed: number } {
  const filtered = filterByScope(results);
  return { results: filtered, removed: results.length - filtered.length };
}

export function formatScopeSummary(removed: number): string {
  return `Scope filter removed ${removed} result(s) outside defined URL scope.`;
}
