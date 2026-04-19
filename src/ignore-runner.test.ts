import { resetIgnoreConfig, setIgnoreConfig } from './ignore-config';
import {
  isRuleIgnored,
  isUrlIgnored,
  filterIgnored,
  filterIgnoredAndCount,
} from './ignore-runner';
import { AuditResult } from './types';

function makeResult(ruleId: string): AuditResult {
  return { ruleId, impact: 'minor', description: 'test', url: 'http://example.com', suggestion: '' };
}

beforeEach(() => resetIgnoreConfig());

describe('isRuleIgnored', () => {
  it('returns false when no rules ignored', () => {
    expect(isRuleIgnored('color-contrast')).toBe(false);
  });

  it('returns true for ignored rule', () => {
    setIgnoreConfig({ ruleIds: ['color-contrast'] });
    expect(isRuleIgnored('color-contrast')).toBe(true);
  });

  it('returns false when disabled', () => {
    setIgnoreConfig({ enabled: false, ruleIds: ['color-contrast'] });
    expect(isRuleIgnored('color-contrast')).toBe(false);
  });
});

describe('isUrlIgnored', () => {
  it('returns false when no patterns', () => {
    expect(isUrlIgnored('http://example.com')).toBe(false);
  });

  it('matches regex pattern', () => {
    setIgnoreConfig({ urlPatterns: ['example\.com'] });
    expect(isUrlIgnored('http://example.com/page')).toBe(true);
  });

  it('falls back to string includes on invalid regex', () => {
    setIgnoreConfig({ urlPatterns: ['example.com'] });
    expect(isUrlIgnored('http://example.com')).toBe(true);
  });
});

describe('filterIgnored', () => {
  it('removes results with ignored ruleIds', () => {
    setIgnoreConfig({ ruleIds: ['aria-label'] });
    const results = [makeResult('aria-label'), makeResult('color-contrast')];
    expect(filterIgnored(results, 'http://x.com')).toHaveLength(1);
  });

  it('returns empty array when url is ignored', () => {
    setIgnoreConfig({ urlPatterns: ['staging'] });
    const results = [makeResult('aria-label')];
    expect(filterIgnored(results, 'http://staging.example.com')).toHaveLength(0);
  });
});

describe('filterIgnoredAndCount', () => {
  it('reports correct ignored count', () => {
    setIgnoreConfig({ ruleIds: ['aria-label'] });
    const results = [makeResult('aria-label'), makeResult('color-contrast')];
    const { results: filtered, ignoredCount } = filterIgnoredAndCount(results, 'http://x.com');
    expect(filtered).toHaveLength(1);
    expect(ignoredCount).toBe(1);
  });
});
