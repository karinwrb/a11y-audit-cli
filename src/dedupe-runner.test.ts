import { buildDedupeKey, dedupeResults, dedupeAndCount } from './dedupe-runner';
import { AuditResult } from './types';

function makeResult(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    url: 'https://example.com',
    ruleId: 'color-contrast',
    description: 'Insufficient color contrast',
    severity: 'serious',
    target: 'button.primary',
    suggestion: 'Increase contrast ratio to at least 4.5:1',
    ...overrides,
  };
}

describe('buildDedupeKey', () => {
  it('builds a key from url, ruleId, and target', () => {
    const result = makeResult();
    expect(buildDedupeKey(result)).toBe('https://example.com::color-contrast::button.primary');
  });

  it('uses "unknown" when target is undefined', () => {
    const result = makeResult({ target: undefined });
    expect(buildDedupeKey(result)).toBe('https://example.com::color-contrast::unknown');
  });
});

describe('dedupeResults', () => {
  it('returns all results when there are no duplicates', () => {
    const results = [
      makeResult({ ruleId: 'color-contrast' }),
      makeResult({ ruleId: 'image-alt' }),
    ];
    expect(dedupeResults(results)).toHaveLength(2);
  });

  it('removes duplicate results with the same key', () => {
    const r = makeResult();
    const results = [r, { ...r }, { ...r }];
    const out = dedupeResults(results);
    expect(out).toHaveLength(1);
    expect(out[0]).toBe(r);
  });

  it('keeps results that differ by target', () => {
    const results = [
      makeResult({ target: 'button.a' }),
      makeResult({ target: 'button.b' }),
    ];
    expect(dedupeResults(results)).toHaveLength(2);
  });

  it('keeps results that differ by url', () => {
    const results = [
      makeResult({ url: 'https://example.com/page1' }),
      makeResult({ url: 'https://example.com/page2' }),
    ];
    expect(dedupeResults(results)).toHaveLength(2);
  });
});

describe('dedupeAndCount', () => {
  it('returns correct stats when duplicates are removed', () => {
    const r = makeResult();
    const { results, stats } = dedupeAndCount([r, { ...r }, { ...r }]);
    expect(results).toHaveLength(1);
    expect(stats.original).toBe(3);
    expect(stats.deduped).toBe(1);
    expect(stats.removed).toBe(2);
  });

  it('returns zero removed when no duplicates exist', () => {
    const results = [makeResult({ ruleId: 'rule-a' }), makeResult({ ruleId: 'rule-b' })];
    const { stats } = dedupeAndCount(results);
    expect(stats.removed).toBe(0);
  });
});
