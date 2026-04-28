import {
  matchesPattern,
  isUrlInScope,
  getUrlDepth,
  isWithinDepth,
  filterByScope,
  filterByScopeAndCount,
  formatScopeSummary,
} from './scope-runner';
import { setScopeConfig, resetScopeConfig } from './scope-config';
import { AuditResult } from './types';

function makeResult(url: string): AuditResult {
  return { url, violations: [], score: 100, timestamp: new Date().toISOString() };
}

beforeEach(() => resetScopeConfig());

describe('matchesPattern', () => {
  it('matches exact url', () => {
    expect(matchesPattern('https://example.com/page', 'https://example.com/page')).toBe(true);
  });

  it('matches wildcard pattern', () => {
    expect(matchesPattern('https://example.com/blog/post', 'https://example.com/blog/*')).toBe(true);
  });

  it('does not match unrelated url', () => {
    expect(matchesPattern('https://other.com', 'https://example.com/*')).toBe(false);
  });
});

describe('getUrlDepth', () => {
  it('returns 0 for root', () => expect(getUrlDepth('https://example.com/')).toBe(0));
  it('returns 1 for single segment', () => expect(getUrlDepth('https://example.com/about')).toBe(1));
  it('returns 2 for two segments', () => expect(getUrlDepth('https://example.com/a/b')).toBe(2));
});

describe('isWithinDepth', () => {
  it('always true when maxDepth is 0', () => {
    setScopeConfig({ enabled: true, maxDepth: 0 });
    expect(isWithinDepth('https://example.com/a/b/c/d')).toBe(true);
  });

  it('filters deep urls', () => {
    setScopeConfig({ enabled: true, maxDepth: 1 });
    expect(isWithinDepth('https://example.com/a/b')).toBe(false);
    expect(isWithinDepth('https://example.com/a')).toBe(true);
  });
});

describe('filterByScope', () => {
  it('returns all when disabled', () => {
    const results = [makeResult('https://example.com'), makeResult('https://other.com')];
    expect(filterByScope(results)).toHaveLength(2);
  });

  it('filters by include pattern', () => {
    setScopeConfig({ enabled: true, includePatterns: ['https://example.com/*'] });
    const results = [makeResult('https://example.com/page'), makeResult('https://other.com/page')];
    expect(filterByScope(results)).toHaveLength(1);
  });

  it('filters by exclude pattern', () => {
    setScopeConfig({ enabled: true, excludePatterns: ['https://example.com/admin*'] });
    const results = [makeResult('https://example.com/page'), makeResult('https://example.com/admin')];
    expect(filterByScope(results)).toHaveLength(1);
  });
});

describe('filterByScopeAndCount', () => {
  it('reports removed count', () => {
    setScopeConfig({ enabled: true, includePatterns: ['https://example.com/*'] });
    const results = [makeResult('https://example.com/a'), makeResult('https://other.com/b')];
    const { results: filtered, removed } = filterByScopeAndCount(results);
    expect(filtered).toHaveLength(1);
    expect(removed).toBe(1);
  });
});

describe('formatScopeSummary', () => {
  it('formats message correctly', () => {
    expect(formatScopeSummary(3)).toBe('Scope filter removed 3 result(s) outside defined URL scope.');
  });
});
