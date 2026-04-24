import {
  normalizeUrl,
  normalizeResult,
  normalizeResults,
  normalizeAndCount,
} from './normalize-runner';
import { setNormalizeConfig, resetNormalizeConfig } from './normalize-config';
import { AuditResult } from './types';

function makeResult(url: string): AuditResult {
  return {
    url,
    violations: [],
    passes: 0,
    score: 100,
    timestamp: new Date().toISOString(),
  };
}

beforeEach(() => resetNormalizeConfig());

describe('normalizeUrl', () => {
  it('trims whitespace by default', () => {
    expect(normalizeUrl('  https://example.com  ')).toBe('https://example.com');
  });

  it('removes trailing slash by default', () => {
    expect(normalizeUrl('https://example.com/path/')).toBe(
      'https://example.com/path'
    );
  });

  it('preserves root slash', () => {
    expect(normalizeUrl('https://example.com/')).toBe('https://example.com/');
  });

  it('lowercases url when enabled', () => {
    setNormalizeConfig({ lowercaseUrls: true });
    expect(normalizeUrl('https://EXAMPLE.COM/path')).toBe(
      'https://example.com/path'
    );
  });

  it('does not lowercase when disabled', () => {
    setNormalizeConfig({ lowercaseUrls: false });
    expect(normalizeUrl('https://EXAMPLE.COM/path')).toBe(
      'https://EXAMPLE.COM/path'
    );
  });
});

describe('normalizeResult', () => {
  it('normalizes url on result', () => {
    const result = makeResult('  https://example.com/page/  ');
    expect(normalizeResult(result).url).toBe('https://example.com/page');
  });

  it('returns result unchanged when disabled', () => {
    setNormalizeConfig({ enabled: false });
    const result = makeResult('  https://example.com/  ');
    expect(normalizeResult(result).url).toBe('  https://example.com/  ');
  });
});

describe('normalizeAndCount', () => {
  it('counts normalized urls', () => {
    const results = [
      makeResult('https://example.com/a/'),
      makeResult('https://example.com/b'),
    ];
    const { results: out, normalizedCount } = normalizeAndCount(results);
    expect(normalizedCount).toBe(1);
    expect(out[0].url).toBe('https://example.com/a');
    expect(out[1].url).toBe('https://example.com/b');
  });

  it('returns zero count when disabled', () => {
    setNormalizeConfig({ enabled: false });
    const results = [makeResult('https://example.com/a/')];
    const { normalizedCount } = normalizeAndCount(results);
    expect(normalizedCount).toBe(0);
  });
});
