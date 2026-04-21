import { AuditResult } from './types';

/**
 * Builds a unique key for an audit result based on rule ID, URL, and target selector.
 */
export function buildDedupeKey(result: AuditResult): string {
  const selector = result.target ?? 'unknown';
  return `${result.url}::${result.ruleId}::${selector}`;
}

/**
 * Deduplicates an array of AuditResults, keeping the first occurrence of each unique key.
 */
export function dedupeResults(results: AuditResult[]): AuditResult[] {
  const seen = new Set<string>();
  const deduped: AuditResult[] = [];

  for (const result of results) {
    const key = buildDedupeKey(result);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(result);
    }
  }

  return deduped;
}

/**
 * Returns deduplication stats: original count, deduped count, and number of duplicates removed.
 */
export interface DedupeStats {
  original: number;
  deduped: number;
  removed: number;
}

export function dedupeAndCount(results: AuditResult[]): { results: AuditResult[]; stats: DedupeStats } {
  const deduped = dedupeResults(results);
  return {
    results: deduped,
    stats: {\n      deduped: deduped.length,
      removed: results.length - deduped.length,
    },
  };
}
