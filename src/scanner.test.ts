import { calculateScore, violationsToAuditResults } from './scanner';
import { runRules } from './rules';
import { RuleViolation } from './rules';

describe('calculateScore', () => {
  it('returns 100 for no violations', () => {
    expect(calculateScore([])).toBe(100);
  });

  it('penalises critical violations by 20', () => {
    const violations: RuleViolation[] = [{
      ruleId: 'img-alt',
      message: 'Missing alt',
      severity: 'critical',
      wcagCriteria: '1.1.1',
    }];
    expect(calculateScore(violations)).toBe(80);
  });

  it('does not go below 0', () => {
    const violations: RuleViolation[] = Array(10).fill({
      ruleId: 'img-alt',
      message: 'Missing alt',
      severity: 'critical',
      wcagCriteria: '1.1.1',
    });
    expect(calculateScore(violations)).toBe(0);
  });

  it('penalises multiple severities correctly', () => {
    const violations: RuleViolation[] = [
      { ruleId: 'a', message: 'x', severity: 'serious', wcagCriteria: '1.3.1' },
      { ruleId: 'b', message: 'y', severity: 'minor', wcagCriteria: '1.1.1' },
    ];
    expect(calculateScore(violations)).toBe(88);
  });
});

describe('runRules', () => {
  it('detects missing alt on img tags', () => {
    const html = '<html lang="en"><body><img src="test.png"></body></html>';
    const violations = runRules(html);
    expect(violations.some(v => v.ruleId === 'img-alt')).toBe(true);
  });

  it('detects missing lang on html element', () => {
    const html = '<html><body></body></html>';
    const violations = runRules(html);
    expect(violations.some(v => v.ruleId === 'html-lang')).toBe(true);
  });

  it('returns no violations for valid html', () => {
    const html = '<html lang="en"><body><img src="x.png" alt="desc"></body></html>';
    const violations = runRules(html);
    expect(violations.filter(v => v.ruleId === 'img-alt')).toHaveLength(0);
    expect(violations.filter(v => v.ruleId === 'html-lang')).toHaveLength(0);
  });
});

describe('violationsToAuditResults', () => {
  it('maps violations to audit results with fix suggestions', () => {
    const violations: RuleViolation[] = [{
      ruleId: 'img-alt',
      message: 'Image is missing alt attribute',
      selector: 'img',
      severity: 'critical',
      wcagCriteria: '1.1.1',
    }];
    const results = violationsToAuditResults(violations);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('img-alt');
    expect(results[0].fix).toBeDefined();
  });
});
