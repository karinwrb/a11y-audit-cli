import { generateJsonReport, generateMarkdownReport } from './reporter';
import { AuditReport } from './types';

const mockReport: AuditReport = {
  url: 'https://example.com',
  timestamp: new Date('2024-01-15T10:00:00Z').toISOString(),
  score: 72,
  violations: [
    {
      id: 'image-alt',
      description: 'Images must have alternate text',
      impact: 'critical',
      wcagCriteria: ['1.1.1'],
      fixSuggestion: 'Add an alt attribute to all <img> elements.',
      nodes: ['<img src="logo.png">'],
    },
  ],
};

const emptyReport: AuditReport = {
  url: 'https://example.com',
  timestamp: new Date('2024-01-15T10:00:00Z').toISOString(),
  score: 100,
  violations: [],
};

describe('generateJsonReport', () => {
  it('should return valid JSON string', () => {
    const result = generateJsonReport(mockReport);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('should include url and score in output', () => {
    const result = generateJsonReport(mockReport);
    const parsed = JSON.parse(result);
    expect(parsed.url).toBe('https://example.com');
    expect(parsed.score).toBe(72);
  });

  it('should serialize violations correctly', () => {
    const result = generateJsonReport(mockReport);
    const parsed = JSON.parse(result);
    expect(parsed.violations).toHaveLength(1);
    expect(parsed.violations[0].id).toBe('image-alt');
  });
});

describe('generateMarkdownReport', () => {
  it('should include URL in output', () => {
    const result = generateMarkdownReport(mockReport);
    expect(result).toContain('https://example.com');
  });

  it('should list violations with headers', () => {
    const result = generateMarkdownReport(mockReport);
    expect(result).toContain('### image-alt');
    expect(result).toContain('critical');
    expect(result).toContain('1.1.1');
  });

  it('should show no violations message for clean report', () => {
    const result = generateMarkdownReport(emptyReport);
    expect(result).toContain('No accessibility violations found');
  });

  it('should include score in header section', () => {
    const result = generateMarkdownReport(mockReport);
    expect(result).toContain('72/100');
  });
});
