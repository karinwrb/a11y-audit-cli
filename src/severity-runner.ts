import { AuditResult } from './types';
import {
  isSeverityOverrideEnabled,
  getSeverityOverrides,
  getDefaultSeverity,
} from './severity-config';

export function applySeverityOverride(result: AuditResult): AuditResult {
  if (!isSeverityOverrideEnabled()) return result;
  const overrides = getSeverityOverrides();
  const overriddenSeverity = overrides[result.id];
  if (!overriddenSeverity) return result;
  return { ...result, severity: overriddenSeverity as AuditResult['severity'] };
}

export function applySeverityOverrides(results: AuditResult[]): AuditResult[] {
  if (!isSeverityOverrideEnabled()) return results;
  return results.map(applySeverityOverride);
}

export function applyDefaultSeverity(result: AuditResult): AuditResult {
  if (!isSeverityOverrideEnabled()) return result;
  if (result.severity) return result;
  const def = getDefaultSeverity();
  return { ...result, severity: def as AuditResult['severity'] };
}

export function applySeverityAndCount(
  results: AuditResult[]
): { results: AuditResult[]; overriddenCount: number } {
  if (!isSeverityOverrideEnabled()) {
    return { results, overriddenCount: 0 };
  }
  const overrides = getSeverityOverrides();
  let overriddenCount = 0;
  const updated = results.map((r) => {
    const overriddenSeverity = overrides[r.id];
    if (overriddenSeverity) {
      overriddenCount++;
      return { ...r, severity: overriddenSeverity as AuditResult['severity'] };
    }
    return r;
  });
  return { results: updated, overriddenCount };
}

export function formatSeverityOverrideSummary(
  overriddenCount: number,
  total: number
): string {
  return `Severity overrides applied: ${overriddenCount} of ${total} result(s) updated.`;
}
