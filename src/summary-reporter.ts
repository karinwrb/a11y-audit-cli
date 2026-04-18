import { AuditReport } from './types';
import { formatScore, formatSeverity } from './formatter';

export interface SummaryStats {
  totalUrls: number;
  passedUrls: number;
  failedUrls: number;
  averageScore: number;
  totalViolations: number;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
}

export function computeSummaryStats(reports: AuditReport[]): SummaryStats {
  const totalUrls = reports.length;
  let passedUrls = 0;
  let totalScore = 0;
  let totalViolations = 0;
  let criticalCount = 0;
  let seriousCount = 0;
  let moderateCount = 0;
  let minorCount = 0;

  for (const report of reports) {
    totalScore += report.score;
    if (report.score >= 90) passedUrls++;
    totalViolations += report.results.length;
    for (const result of report.results) {
      switch (result.severity) {
        case 'critical': criticalCount++; break;
        case 'serious': seriousCount++; break;
        case 'moderate': moderateCount++; break;
        case 'minor': minorCount++; break;
      }
    }
  }

  return {
    totalUrls,
    passedUrls,
    failedUrls: totalUrls - passedUrls,
    averageScore: totalUrls > 0 ? Math.round(totalScore / totalUrls) : 0,
    totalViolations,
    criticalCount,
    seriousCount,
    moderateCount,
    minorCount,
  };
}

export function formatSummaryText(stats: SummaryStats): string {
  const lines: string[] = [
    '=== Batch Audit Summary ===',
    `URLs audited : ${stats.totalUrls}`,
    `Passed (≥90) : ${stats.passedUrls}`,
    `Failed       : ${stats.failedUrls}`,
    `Avg score    : ${formatScore(stats.averageScore)}`,
    `Total issues : ${stats.totalViolations}`,
    `  ${formatSeverity('critical')} ${stats.criticalCount}`,
    `  ${formatSeverity('serious')}  ${stats.seriousCount}`,
    `  ${formatSeverity('moderate')} ${stats.moderateCount}`,
    `  ${formatSeverity('minor')}    ${stats.minorCount}`,
  ];
  return lines.join('\n');
}

export function formatSummaryJson(stats: SummaryStats): string {
  return JSON.stringify(stats, null, 2);
}
