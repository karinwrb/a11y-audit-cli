import { filterResults, filterAndCount, meetsMinSeverity } from './filter-runner';
import { setFilterConfig, resetFilterConfig } from './filter-config';
import { AuditResult } from './types';

function makeResult(severity: AuditResult['severity'], incomplete = false): AuditResult {
  return {
    id: 'test-rule',
    description: 'Test',
    severity,
    incomplete,
    nodes: [],
    fixSuggestion: '',
  };
}

beforeEach(() => resetFilterConfig());

describe('meetsMinSeverity', () => {
  it('passes result at or above min severity', () => {
    expect(meetsMinSeverity(makeResult('serious'), 'moderate')).toBe(true);
    expect(meetsMinSeverity(makeResult('moderate'), 'moderate')).toBe(true);
  });

  it('rejects result below min severity', () => {
    expect(meetsMinSeverity(makeResult('minor'), 'moderate')).toBe(false);
  });
});

describe('filterResults', () => {
  it('filters by minSeverity', () => {
    setFilterConfig({ minSeverity: 'serious' });
    const results = [makeResult('minor'), makeResult('serious'), makeResult('critical')];
    const out = filterResults(results);
    expect(out).toHaveLength(2);
  });

  it('excludes incomplete when configured', () => {
    setFilterConfig({ includeIncomplete: false });
    const results = [makeResult('minor', true), makeResult('minor', false)];
    expect(filterResults(results)).toHaveLength(1);
  });

  it('includes incomplete when configured', () => {
    setFilterConfig({ includeIncomplete: true });
    const results = [makeResult('minor', true), makeResult('minor', false)];
    expect(filterResults(results)).toHaveLength(2);
  });

  it('filters by impactFilter list', () => {
    setFilterConfig({ impactFilter: ['critical'] });
    const results = [makeResult('minor'), makeResult('serious'), makeResult('critical')];
    expect(filterResults(results)).toHaveLength(1);
  });
});

describe('filterAndCount', () => {
  it('returns correct counts', () => {
    setFilterConfig({ minSeverity: 'serious' });
    const results = [makeResult('minor'), makeResult('serious')];
    const { filtered, total, excluded } = filterAndCount(results);
    expect(total).toBe(2);
    expect(filtered).toHaveLength(1);
    expect(excluded).toBe(1);
  });
});
