import { renderResult, renderReport } from './output-formatter';
import { setOutputConfig, resetOutputConfig } from './output-config';
import { AuditResult, AuditReport } from './types';

beforeEach(() => {
  resetOutputConfig();
  setOutputConfig({ color: false });
});

const mockResult: AuditResult = {
  rule: 'image-alt',
  description: 'Images must have alt text',
  severity: 'serious',
  element: '<img src="foo.png">',
  fixSuggestion: 'Add an alt attribute to the img element.',
};

const mockReport: AuditReport = {
  url: 'https://example.com',
  timestamp: new Date('2024-01-01').toISOString(),
  score: 75,
  results: [mockResult],
};

describe('renderResult', () => {
  it('includes rule and description', () => {
    const out = renderResult(mockResult);
    expect(out).toContain('image-alt');
    expect(out).toContain('Images must have alt text');
  });

  it('shows fix suggestion in verbose mode', () => {
    setOutputConfig({ verbose: true, color: false });
    const out = renderResult(mockResult);
    expect(out).toContain('Add an alt attribute');
  });

  it('hides fix suggestion in non-verbose mode', () => {
    const out = renderResult(mockResult);
    expect(out).not.toContain('Add an alt attribute');
  });
});

describe('renderReport', () => {
  it('includes URL and score', () => {
    const out = renderReport(mockReport);
    expect(out).toContain('example.com');
    expect(out).toContain('75');
  });

  it('shows violation count', () => {
    const out = renderReport(mockReport);
    expect(out).toContain('Violations: 1');
  });

  it('shows no violations message for empty results', () => {
    const emptyReport = { ...mockReport, results: [] };
    const out = renderReport(emptyReport);
    expect(out).toContain('No violations found');
  });
});
