import { computeSummaryStats, formatSummaryText, formatSummaryJson } from './summary-reporter';
import { AuditReport } from './types';

function makeReport(score: number, severities: string[]): AuditReport {
  return {
    url: 'https://example.com',
    timestamp: new Date().toISOString(),
    score,
    results: severities.map((severity, i) => ({
      id: `rule-${i}`,
      description: 'Test',
      severity: severity as any,
      element: '<div>',
      suggestion: 'Fix it',
    })),
  };
}

describe('computeSummaryStats', () => {
  it('returns zeros for empty reports', () => {
    const stats = computeSummaryStats([]);
    expect(stats.totalUrls).toBe(0);
    expect(stats.averageScore).toBe(0);
    expect(stats.totalViolations).toBe(0);
  });

  it('counts passed and failed urls', () => {
    const reports = [makeReport(95, []), makeReport(70, ['critical'])];
    const stats = computeSummaryStats(reports);
    expect(stats.passedUrls).toBe(1);
    expect(stats.failedUrls).toBe(1);
  });

  it('calculates average score', () => {
    const reports = [makeReport(80, []), makeReport(60, [])];
    const stats = computeSummaryStats(reports);
    expect(stats.averageScore).toBe(70);
  });

  it('counts violations by severity', () => {
    const reports = [makeReport(50, ['critical', 'serious', 'moderate', 'minor', 'critical'])];
    const stats = computeSummaryStats(reports);
    expect(stats.criticalCount).toBe(2);
    expect(stats.seriousCount).toBe(1);
    expect(stats.moderateCount).toBe(1);
    expect(stats.minorCount).toBe(1);
    expect(stats.totalViolations).toBe(5);
  });
});

describe('formatSummaryText', () => {
  it('includes key labels', () => {
    const stats = computeSummaryStats([makeReport(90, [])]);
    const text = formatSummaryText(stats);
    expect(text).toContain('Batch Audit Summary');
    expect(text).toContain('URLs audited');
    expect(text).toContain('Avg score');
  });
});

describe('formatSummaryJson', () => {
  it('returns valid JSON', () => {
    const stats = computeSummaryStats([]);
    expect(() => JSON.parse(formatSummaryJson(stats))).not.toThrow();
  });

  it('includes totalUrls field', () => {
    const stats = computeSummaryStats([makeReport(80, [])]);
    const parsed = JSON.parse(formatSummaryJson(stats));
    expect(parsed.totalUrls).toBe(1);
  });
});
