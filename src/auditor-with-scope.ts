import { AuditResult } from './types';
import { filterByScopeAndCount, formatScopeSummary } from './scope-runner';
import { isScopeEnabled } from './scope-config';

export type AuditorFn = (url: string) => Promise<AuditResult>;

export function createScopeFilteringAuditor(
  auditor: AuditorFn,
  onFiltered?: (message: string) => void
): AuditorFn {
  return async (url: string): Promise<AuditResult> => {
    const result = await auditor(url);

    if (!isScopeEnabled()) return result;

    const { results: filtered, removed } = filterByScopeAndCount([result]);

    if (removed > 0) {
      const message = formatScopeSummary(removed);
      if (onFiltered) onFiltered(message);
      return {
        url: result.url,
        violations: [],
        score: result.score,
        timestamp: result.timestamp,
        meta: { scopeFiltered: true },
      } as AuditResult;
    }

    return filtered[0];
  };
}
