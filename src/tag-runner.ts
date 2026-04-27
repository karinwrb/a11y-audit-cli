import type { AuditResult } from './types';
import { isTagFilterEnabled, getFilterTags, isMatchAll } from './tag-config';

export function resultMatchesTags(result: AuditResult, tags: string[], matchAll: boolean): boolean {
  const resultTags: string[] = (result as any).tags ?? [];
  if (resultTags.length === 0) return false;
  if (matchAll) {
    return tags.every((t) => resultTags.includes(t));
  }
  return tags.some((t) => resultTags.includes(t));
}

export function filterByTags(results: AuditResult[]): AuditResult[] {
  if (!isTagFilterEnabled()) return results;
  const tags = getFilterTags();
  const matchAll = isMatchAll();
  return results.filter((r) => resultMatchesTags(r, tags, matchAll));
}

export function filterByTagsAndCount(
  results: AuditResult[]
): { results: AuditResult[]; total: number; kept: number } {
  const total = results.length;
  const filtered = filterByTags(results);
  return { results: filtered, total, kept: filtered.length };
}

export function formatTagSummary(total: number, kept: number, tags: string[]): string {
  const removed = total - kept;
  return `Tag filter [${tags.join(', ')}]: ${kept}/${total} results kept (${removed} removed).`;
}
