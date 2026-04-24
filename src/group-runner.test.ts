import { groupResults, groupAndSummarize, buildGroupKey, formatGroupSummary } from './group-runner';
import { setGroupConfig, resetGroupConfig } from './group-config';
import { AuditResult } from './types';

function makeResult(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    ruleId: 'color-contrast',
    url: 'https://example.com',
    severity: 'serious',
    message: 'Insufficient color contrast',
    suggestion: 'Increase contrast ratio',
    ...overrides,
  };
}

beforeEach(() => resetGroupConfig());

describe('buildGroupKey', () => {
  it('groups by ruleId', () => {
    const r = makeResult({ ruleId: 'label' });
    expect(buildGroupKey(r, 'rule')).toBe('label');
  });

  it('groups by url', () => {
    const r = makeResult({ url: 'https://test.com' });
    expect(buildGroupKey(r, 'url')).toBe('https://test.com');
  });

  it('groups by severity', () => {
    const r = makeResult({ severity: 'critical' });
    expect(buildGroupKey(r, 'severity')).toBe('critical');
  });
});

describe('groupResults', () => {
  it('groups results by rule by default', () => {
    const results = [
      makeResult({ ruleId: 'label' }),
      makeResult({ ruleId: 'label' }),
      makeResult({ ruleId: 'color-contrast' }),
    ];
    const grouped = groupResults(results);
    expect(grouped.get('label')).toHaveLength(2);
    expect(grouped.get('color-contrast')).toHaveLength(1);
  });

  it('groups by url when configured', () => {
    setGroupConfig({ groupBy: 'url' });
    const results = [
      makeResult({ url: 'https://a.com' }),
      makeResult({ url: 'https://b.com' }),
      makeResult({ url: 'https://a.com' }),
    ];
    const grouped = groupResults(results);
    expect(grouped.get('https://a.com')).toHaveLength(2);
    expect(grouped.get('https://b.com')).toHaveLength(1);
  });
});

describe('groupAndSummarize', () => {
  it('returns sorted groups by count descending', () => {
    const results = [
      makeResult({ ruleId: 'a' }),
      makeResult({ ruleId: 'b' }),
      makeResult({ ruleId: 'b' }),
      makeResult({ ruleId: 'b' }),
    ];
    const summary = groupAndSummarize(results);
    expect(summary[0].key).toBe('b');
    expect(summary[0].count).toBe(3);
    expect(summary[1].key).toBe('a');
  });
});

describe('formatGroupSummary', () => {
  it('includes count when includeCount is true', () => {
    const groups = [{ key: 'label', items: [], count: 4 }];
    const output = formatGroupSummary(groups);
    expect(output).toContain('label (4)');
  });

  it('omits count when includeCount is false', () => {
    setGroupConfig({ includeCount: false });
    const groups = [{ key: 'label', items: [], count: 4 }];
    const output = formatGroupSummary(groups);
    expect(output).not.toContain('(4)');
    expect(output).toContain('label');
  });
});
