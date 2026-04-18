import {
  formatSeverity,
  formatScore,
  formatViolationSummary,
  formatAuditResult,
  formatReportHeader,
} from './formatter';
import { AuditResult, AuditReport } from './types';

const mockResult: AuditResult = {
  ruleId: 'image-alt',
  description: 'Images must have alt text',
  severity: 'critical',
  element: '<img src="logo.png">',
  fixSuggestion: 'Add an alt attribute to the img element',
  wcagCriteria: '1.1.1',
};

const mockReport: AuditReport = {
  url: 'https://example.com',
  timestamp: '2024-01-15T10:00:00.000Z',
  score: 78,
  totalViolations: 3,
  results: [mockResult],
};

describe('formatSeverity', () => {
  it('formats known severities with emoji', () => {
    expect(formatSeverity('critical')).toBe('🔴 Critical');
    expect(formatSeverity('serious')).toBe('🟠 Serious');
    expect(formatSeverity('moderate')).toBe('🟡 Moderate');
    expect(formatSeverity('minor')).toBe('🔵 Minor');
  });

  it('returns raw value for unknown severity', () => {
    expect(formatSeverity('unknown')).toBe('unknown');
  });
});

describe('formatScore', () => {
  it('labels score >= 90 as Excellent', () => {
    expect(formatScore(95)).toContain('Excellent');
  });

  it('labels score 70-89 as Needs Improvement', () => {
    expect(formatScore(75)).toContain('Needs Improvement');
  });

  it('labels score < 70 as Poor', () => {
    expect(formatScore(50)).toContain('Poor');
  });
});

describe('formatViolationSummary', () => {
  it('counts violations by severity', () => {
    const results: AuditResult[] = [
      { ...mockResult, severity: 'critical' },
      { ...mockResult, severity: 'critical' },
      { ...mockResult, severity: 'minor' },
    ];
    const summary = formatViolationSummary(results);
    expect(summary).toContain('2');
    expect(summary).toContain('Critical');
  });
});

describe('formatAuditResult', () => {
  it('includes rule id and element', () => {
    const output = formatAuditResult(mockResult, 0);
    expect(output).toContain('image-alt');
    expect(output).toContain('<img src="logo.png">');
    expect(output).toContain('1.1.1');
  });
});

describe('formatReportHeader', () => {
  it('includes url and score', () => {
    const header = formatReportHeader(mockReport);
    expect(header).toContain('https://example.com');
    expect(header).toContain('78/100');
    expect(header).toContain('3');
  });
});
