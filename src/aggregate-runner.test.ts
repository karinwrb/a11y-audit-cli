import {
  aggregateByUrl,
  aggregateByRule,
  computeAggregateStats,
  runAggregation,
} from './aggregate-runner';
import { setAggregateConfig, resetAggregateConfig } from './aggregate-config';
import { AuditResult } from './types';

function makeResult(url: string, ruleId: string): AuditResult {
  return {
    url,
    ruleId,
    impact: 'minor',
    description: 'test',
    helpUrl: '',
    nodes: [],
    fixSuggestion: '',
  };
}

const results: AuditResult[] = [
  makeResult('https://a.com', 'rule-1'),
  makeResult('https://a.com', 'rule-2'),
  makeResult('https://b.com', 'rule-1'),
  makeResult('https://b.com', 'rule-1'),
];

afterEach(() => resetAggregateConfig());

describe('aggregateByUrl', () => {
  it('groups results by url', () => {
    const out = aggregateByUrl(results);
    expect(out).toHaveLength(2);
    const a = out.find((x) => x.url === 'https://a.com')!;
    expect(a.count).toBe(2);
    expect(a.ruleIds).toContain('rule-1');
    expect(a.ruleIds).toContain('rule-2');
  });
});

describe('aggregateByRule', () => {
  it('groups results by rule', () => {
    const out = aggregateByRule(results);
    const r1 = out.find((x) => x.ruleId === 'rule-1')!;
    expect(r1.count).toBe(2);
    expect(r1.urls).toContain('https://a.com');
    expect(r1.urls).toContain('https://b.com');
  });
});

describe('computeAggregateStats', () => {
  it('returns correct totals', () => {
    const stats = computeAggregateStats(results);
    expect(stats.totalResults).toBe(4);
    expect(stats.uniqueUrls).toBe(2);
    expect(stats.uniqueRules).toBe(2);
  });

  it('identifies most affected url and rule', () => {
    const stats = computeAggregateStats(results);
    expect(stats.mostViolatedRule).toBe('rule-1');
  });
});

describe('runAggregation', () => {
  it('returns empty object when disabled', () => {
    setAggregateConfig({ enabled: false });
    expect(runAggregation(results)).toEqual({});
  });

  it('returns byUrl and stats when enabled', () => {
    setAggregateConfig({ enabled: true, groupByUrl: true, groupByRule: false, includeStats: true });
    const out = runAggregation(results);
    expect(out.byUrl).toBeDefined();
    expect(out.byRule).toBeUndefined();
    expect(out.stats).toBeDefined();
  });

  it('returns byRule when configured', () => {
    setAggregateConfig({ enabled: true, groupByUrl: false, groupByRule: true, includeStats: false });
    const out = runAggregation(results);
    expect(out.byRule).toBeDefined();
    expect(out.byUrl).toBeUndefined();
    expect(out.stats).toBeUndefined();
  });
});
