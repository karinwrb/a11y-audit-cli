import { AuditResult, Severity } from './types';
import { getMinSeverity, isIncompleteIncluded, getFilterConfig } from './filter-config';

const SEVERITY_ORDER: Severity[] = ['minor', 'moderate', 'serious', 'critical'];

function severityIndex(s: Severity): number {
  return SEVERITY_ORDER.indexOf(s);
}

export function meetsMinSeverity(result: AuditResult, min: Severity): boolean {
  return severityIndex(result.severity) >= severityIndex(min);
}

export function filterResults(results: AuditResult[]): AuditResult[] {
  const config = getFilterConfig();
  const min = getMinSeverity();
  const includeIncomplete = isIncompleteIncluded();

  return results.filter((r) => {
    if (!meetsMinSeverity(r, min)) return false;
    if (!includeIncomplete && r.incomplete) return false;
    if (config.impactFilter && config.impactFilter.length > 0) {
      if (!config.impactFilter.includes(r.severity)) return false;
    }
    return true;
  });
}

export function filterAndCount(results: AuditResult[]): {
  filtered: AuditResult[];
  total: number;
  excluded: number;
} {
  const total = results.length;
  const filtered = filterResults(results);
  return { filtered, total, excluded: total - filtered.length };
}
