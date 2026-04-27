import { describe, it, expect, beforeEach } from 'vitest';
import { filterByTags, filterByTagsAndCount, resultMatchesTags, formatTagSummary } from './tag-runner';
import { resetTagConfig, setTagConfig } from './tag-config';
import type { AuditResult } from './types';

function makeResult(tags: string[]): AuditResult {
  return {
    ruleId: 'rule-1',
    description: 'Test',
    severity: 'minor',
    url: 'https://example.com',
    fixSuggestion: 'Fix it',
    tags,
  } as any;
}

beforeEach(() => resetTagConfig());

describe('resultMatchesTags', () => {
  it('returns false when result has no tags', () => {
    expect(resultMatchesTags(makeResult([]), ['wcag2a'], false)).toBe(false);
  });

  it('matches any tag by default', () => {
    expect(resultMatchesTags(makeResult(['wcag2a', 'best-practice']), ['wcag2a'], false)).toBe(true);
  });

  it('matchAll requires all tags present', () => {
    expect(resultMatchesTags(makeResult(['wcag2a']), ['wcag2a', 'best-practice'], true)).toBe(false);
    expect(resultMatchesTags(makeResult(['wcag2a', 'best-practice']), ['wcag2a', 'best-practice'], true)).toBe(true);
  });
});

describe('filterByTags', () => {
  it('returns all results when tag filter disabled', () => {
    const results = [makeResult(['wcag2a']), makeResult([])];
    expect(filterByTags(results)).toHaveLength(2);
  });

  it('filters results by tag when enabled', () => {
    setTagConfig({ enabled: true, tags: ['wcag2a'], matchAll: false });
    const results = [makeResult(['wcag2a']), makeResult(['best-practice']), makeResult([]) ];
    expect(filterByTags(results)).toHaveLength(1);
  });
});

describe('filterByTagsAndCount', () => {
  it('returns correct counts', () => {
    setTagConfig({ enabled: true, tags: ['wcag2a'], matchAll: false });
    const results = [makeResult(['wcag2a']), makeResult(['best-practice'])];
    const { total, kept } = filterByTagsAndCount(results);
    expect(total).toBe(2);
    expect(kept).toBe(1);
  });
});

describe('formatTagSummary', () => {
  it('formats summary string correctly', () => {
    const msg = formatTagSummary(10, 7, ['wcag2a']);
    expect(msg).toContain('7/10');
    expect(msg).toContain('3 removed');
    expect(msg).toContain('wcag2a');
  });
});
