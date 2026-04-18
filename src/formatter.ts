import { AuditResult, AuditReport } from './types';

export function formatSeverity(severity: string): string {
  const map: Record<string, string> = {
    critical: '🔴 Critical',
    serious: '🟠 Serious',
    moderate: '🟡 Moderate',
    minor: '🔵 Minor',
  };
  return map[severity] ?? severity;
}

export function formatScore(score: number): string {
  if (score >= 90) return `${score}/100 ✅ Excellent`;
  if (score >= 70) return `${score}/100 ⚠️  Needs Improvement`;
  return `${score}/100 ❌ Poor`;
}

export function formatViolationSummary(results: AuditResult[]): string {
  const counts: Record<string, number> = {};
  for (const r of results) {
    counts[r.severity] = (counts[r.severity] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([sev, count]) => `${formatSeverity(sev)}: ${count}`)
    .join(' | ');
}

export function formatAuditResult(result: AuditResult, index: number): string {
  const lines: string[] = [
    `${index + 1}. [${formatSeverity(result.severity)}] ${result.description}`,
    `   Rule: ${result.ruleId}`,
    `   Element: ${result.element}`,
  ];
  if (result.fixSuggestion) {
    lines.push(`   Fix: ${result.fixSuggestion}`);
  }
  if (result.wcagCriteria) {
    lines.push(`   WCAG: ${result.wcagCriteria}`);
  }
  return lines.join('\n');
}

export function formatReportHeader(report: AuditReport): string {
  return [
    `URL: ${report.url}`,
    `Audited: ${new Date(report.timestamp).toLocaleString()}`,
    `Score: ${formatScore(report.score)}`,
    `Total Violations: ${report.totalViolations}`,
  ].join('\n');
}
